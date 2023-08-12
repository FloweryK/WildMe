import os
import time
import torch
from torch.utils.data import DataLoader, random_split
from torch.utils.tensorboard import SummaryWriter
from pprint import pprint
from db.database import database
from .constants.custom_tokens import *
from .dataset.base import collate_fn
from .dataset.kakaotalk_mobile import KakaotalkMobileDataset
from .model.classifier import Classifier
from .utils import WarmupScheduler
from .trainer import Trainer


class Checker:
    def __init__(self, config):
        self.config = config
    
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
                path_weight=user['path_weight'],
                prefix=user['name']
            )

            # update user's reserved_status
            user['reserve_status'] = 'done'
            database.update(user['name'], user)
            

    def train(self, path_data, path_vocab, path_weight, prefix):
        # dataset
        dataset = KakaotalkMobileDataset(self.config.n_vocab, path_data, path_vocab, speaker='유민상')
        train_size = int(self.config.r_split * len(dataset))
        trainset, testset = random_split(dataset, [train_size, len(dataset) - train_size])

        # dataloader
        trainloader = DataLoader(trainset, batch_size=self.config.n_batch, shuffle=True, collate_fn=collate_fn)
        testloader = DataLoader(testset, batch_size=self.config.n_batch, shuffle=True, collate_fn=collate_fn)

        # model
        model = Classifier(self.config)
        model = model.to(self.config.device)

        # criterion, optimizer and scheduler
        criterion = torch.nn.CrossEntropyLoss(ignore_index=PAD, label_smoothing=self.config.label_smoothing)
        optimizer = torch.optim.Adam(model.parameters(), lr=self.config.lr, betas=(0.9, 0.98), eps=1e-9)
        scheduler = WarmupScheduler(optimizer, warmup_steps=self.config.warmup_steps, d_model=self.config.d_emb)

        # scaler
        scaler = torch.cuda.amp.GradScaler(enabled=self.config.use_amp)

        # writer
        os.makedirs(f'runs/{prefix}', exist_ok=True)
        writer = SummaryWriter(log_dir=f'runs/{prefix}/vocab={self.config.n_vocab}_batch={self.config.n_batch}_accum={self.config.n_accum}_amp={self.config.use_amp}_warmup={self.config.warmup_steps}_demb={self.config.d_emb}')

        # trainer
        trainer = Trainer(model, criterion, scaler, optimizer, scheduler, writer, path_weight)

        # train
        for epoch in range(self.config.n_epoch):
            trainer.run_epoch(epoch, trainloader, device=self.config.device, train=True, use_amp=self.config.use_amp, n_accum=self.config.n_accum)
            trainer.run_epoch(epoch, testloader, device=self.config.device, train=False, use_amp=self.config.use_amp, n_accum=self.config.n_accum)