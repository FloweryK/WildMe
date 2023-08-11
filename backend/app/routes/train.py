import os
import datetime
import threading
import torch
from flask import Blueprint, g, request, jsonify
from torch.optim.lr_scheduler import _LRScheduler
from torch.utils.data import DataLoader, random_split
from torch.utils.tensorboard import SummaryWriter

from app.utils import login_required, hide_credentials
from app.status_code import *
from db.database import database
from chatbot import config
from chatbot.constant import *
from chatbot.dataset.base import collate_fn
from chatbot.dataset.kakaotalk_mobile import KakaotalkMobileDataset
from chatbot.model.classifier import Classifier
from chatbot.trainer import Trainer


class WarmupScheduler(_LRScheduler):
    def __init__(self, optimizer, warmup_steps, d_model):
        self.warmup_steps = warmup_steps
        self.d_model = d_model
        self.current_step = 0
        super().__init__(optimizer)
    
    def get_lr(self):
        self.current_step += 1
        lr = self.d_model ** (-0.5) * min(self.current_step ** (-0.5), self.current_step * self.warmup_steps ** (-1.5))

        return [lr for _ in self.base_lrs]


def get_model_parameters(model):
    return sum(p.numel() for p in model.parameters() if p.requires_grad)


class TrainBluePrint(Blueprint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # add url rules
        self.add_url_rule('/upload', 'upload', self.upload, methods=['POST'])
        self.add_url_rule('/train', 'train', self.run_training, methods=['POST'])
    
    @staticmethod
    @login_required
    def upload():
        # extract txt file
        f = request.files['file']

        # file path
        file_name = f'{g.user["name"]}_{datetime.datetime.now().strftime("%Y%m%d_%H_%M_%S")}.txt'

        # upload to db
        path_data = database.fs_upload(f, file_name)

        # update user's file path
        g.user['files']['data'] = path_data
        user = database.update(name=g.user['name'], user=g.user)
        user = hide_credentials(user)
        
        return jsonify(user), CREATED
    
    @login_required
    def run_training(self):
        user = g.user

        # arguments
        path_data = user['files']['data']
        path_vocab = 'testvocab.model'
        prefix = ''
        speaker = '유민상'

        # threading
        t = threading.Thread(target=self.train, args=(config, path_data, path_vocab, prefix, speaker))
        t.start()

        return {"message": "train started"}, OK
    
    def train(self, config, path_data, path_vocab, prefix, speaker):
        # dataset
        dataset = KakaotalkMobileDataset(config.n_vocab, path_data, path_vocab, speaker)
        train_size = int(config.r_split * len(dataset))
        trainset, testset = random_split(dataset, [train_size, len(dataset) - train_size])

        # dataloader
        trainloader = DataLoader(trainset, batch_size=config.n_batch, shuffle=True, collate_fn=collate_fn)
        testloader = DataLoader(testset, batch_size=config.n_batch, shuffle=True, collate_fn=collate_fn)

        # model
        model = Classifier(config)
        model = model.to(config.device)
        print("model parameters:", get_model_parameters(model))

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
        trainer = Trainer(model, criterion, scaler, optimizer, scheduler, writer)

        # train
        for epoch in range(config.n_epoch):
            trainer.run_epoch(epoch, trainloader, device=config.device, train=True, use_amp=config.use_amp, n_accum=config.n_accum)
            trainer.run_epoch(epoch, testloader, device=config.device, train=False, use_amp=config.use_amp, n_accum=config.n_accum)
