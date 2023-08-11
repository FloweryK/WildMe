import os
import time
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


class TrainBluePrint(Blueprint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # queue
        self.queue = []

        # add url rules
        self.add_url_rule('/upload', 'upload', self.upload, methods=['POST'])
        self.add_url_rule('/reserve', 'reserve', self.reserve, methods=['POST'])

        # thread job
        t = threading.Thread(target=self.thread_job)
        t.start()
    
    def thread_job(self):
        while True:
            time.sleep(1)

            if self.queue:
                user = self.queue.pop(0)

                path_data = user['files']['data']
                path_vocab = user['files']['vocab']
                prefix = ''
                speaker = '유민상'

                self.train(config, path_data, path_vocab, prefix, speaker)
            else:
                print('nothing in queue')
    
    @staticmethod
    @login_required
    def upload():
        # extract txt file
        f = request.files['file']

        # file path
        dir_user = os.path.join(database.path_fs, g.user['name'])
        path_data = os.path.join(dir_user, f'data.txt')
        path_vocab = os.path.join(dir_user, 'vocab.model')

        # upload to db
        os.makedirs(dir_user, exist_ok=True)
        database.fs_upload(f, path_data)

        # update user's file path
        g.user['files']['data'] = path_data
        g.user['files']['vocab'] = path_vocab
        user = database.update(name=g.user['name'], user=g.user)
        user = hide_credentials(user)
        
        return jsonify(user), CREATED
    
    @login_required
    def reserve(self):
        user = g.user

        if user['name'] in [u['name'] for u in self.queue]:
            return {"message": "Already in queue"}, CONFLICT
        else:
            self.queue.append(g.user)
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
