import os
import time
import torch
from torch.utils.data import DataLoader, random_split
from torch.utils.tensorboard import SummaryWriter
from chatbot.constants.custom_tokens import *
from chatbot.dataset.base import collate_fn
from chatbot.dataset.kakaotalk import KakaotalkDataset
from chatbot.model.classifier import Classifier
from chatbot.utils import WarmupScheduler
from chatbot.config import Config
from chatbot.trainer import Trainer
from db.database import database


class Checker:
    def run(self):
        while True:
            time.sleep(1)
            schedule = database.select_all()

            # check ongoing
            ongoing = [user for user in schedule if user['reserve_status'] == "ongoing"]
            if ongoing:
                continue

            # check reserved
            reserved = [user for user in schedule if user['reserve_status'] == "reserved"]
            reserved = sorted(reserved, key=lambda x: x['reserve_timestamp'])
            if not reserved:
                continue

            # run the training process for the first reserved element
            user = reserved[0]

            # update user's reserved_status
            user['reserve_status'] = 'ongoing'
            database.update(user['name'], user)

            # run training
            self.train(
                path_data=user['path_data'],
                path_vocab=user['path_vocab'],
                path_config=user['path_config'],
                path_weight=user['path_weight'],
                prefix=user['name'],
                speaker=user['speaker'],
            )

            # update user's reserve_status
            user['reserve_status'] = 'done'
            database.update(user['name'], user)
            
            # except:
            #     # update user's reserve_status 
            #     user['reserve_status'] = 'failed'
            #     database.update(user['name'], user)


    def train(self, path_data, path_config, path_vocab, path_weight, prefix, speaker):
        # load config
        config = Config(path_config)

        # dataset
        dataset = KakaotalkDataset(config.data_type, config.n_vocab, path_data, path_vocab, speaker)
        train_size = int(config.r_split * len(dataset))
        trainset, testset = random_split(dataset, [train_size, len(dataset) - train_size])

        # dataloader
        trainloader = DataLoader(trainset, batch_size=config.n_batch, shuffle=True, collate_fn=collate_fn)
        testloader = DataLoader(testset, batch_size=config.n_batch, shuffle=True, collate_fn=collate_fn)

        # model
        model = Classifier(config)
        model = model.to(config.device)

        # criterion, optimizer and scheduler
        criterion = torch.nn.CrossEntropyLoss(ignore_index=PAD, label_smoothing=config.label_smoothing)
        optimizer = torch.optim.Adam(model.parameters(), lr=config.lr, betas=(0.9, 0.98), eps=1e-9)
        scheduler = WarmupScheduler(optimizer, warmup_steps=config.warmup_steps, d_model=config.d_emb)

        # scaler
        scaler = torch.cuda.amp.GradScaler(enabled=config.use_amp)

        # writer
        os.makedirs(f'runs/{prefix}', exist_ok=True)
        writer = SummaryWriter(log_dir=f'runs/{prefix}/vocab={config.n_vocab}_batch={config.n_batch}_accum={config.n_accum}_amp={config.use_amp}_warmup={config.warmup_steps}_demb={config.d_emb}')

        # trainer
        trainer = Trainer(model, criterion, scaler, optimizer, scheduler, writer, path_weight)

        print("dataset size:", len(dataset))
        # train
        for epoch in range(config.n_epoch):
            trainer.run_epoch(epoch, trainloader, device=config.device, train=True, use_amp=config.use_amp, n_accum=config.n_accum)
            trainer.run_epoch(epoch, testloader, device=config.device, train=False, use_amp=config.use_amp, n_accum=config.n_accum)

            # check stop sign
            user = database.select(name=prefix)
            if user['reserve_status'] == 'stop':
                break
