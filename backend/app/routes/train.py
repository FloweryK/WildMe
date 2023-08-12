import os
import time
import json
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

        # ongoing
        self.ongoing = []

        # add url rules
        self.add_url_rule('/reserve', 'reserve', self.reserve, methods=['POST'])

        # thread job
        t = threading.Thread(target=self.thread_job)
        t.start()
    
    def thread_job(self):
        while True:
            time.sleep(1)

            if self.queue and (not self.ongoing):
                # move the first user to ongoing
                user = self.queue.pop(0)
                self.ongoing.append(user)

                path_data = user['path_data']
                path_vocab = user['path_vocab']
                path_weight = user['path_weight']
                speaker = user['speaker']
                prefix = ''

                self.train(config, path_data, path_vocab, path_weight, prefix, speaker)
            else:
                print('nothing in queue')
    
    @login_required
    def reserve(self):
        # user
        user = g.user

        # extract data
        data = request.form
        f = request.files['file']

        # check if the user is already in the queue
        if user['name'] in [u['name'] for u in self.queue]:
            return {"message": "Already in queue"}, CONFLICT

        # file path
        dir_user = os.path.join(database.path_fs, user['name'])
        path_data = os.path.join(dir_user, 'data.txt')
        path_vocab = os.path.join(dir_user, 'vocab.model')
        path_weight = os.path.join(dir_user, 'model.pt')
        
        # update user's speaker
        user['path_data'] = path_data
        user['path_vocab'] = path_vocab
        user['path_weight'] = path_weight
        user['speaker'] = data['speaker']
        user = database.update(user['name'], user)
        user = hide_credentials(user)

        # upload to db
        os.makedirs(dir_user, exist_ok=True)
        database.fs_upload(f, path_data)

        # add to the queue
        self.queue.append(user)

        return jsonify(user), OK
    
    def train(self, config, path_data, path_vocab, path_weight, prefix, speaker):
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
        trainer = Trainer(model, criterion, scaler, optimizer, scheduler, writer, path_weight)

        # train
        for epoch in range(config.n_epoch):
            trainer.run_epoch(epoch, trainloader, device=config.device, train=True, use_amp=config.use_amp, n_accum=config.n_accum)
            trainer.run_epoch(epoch, testloader, device=config.device, train=False, use_amp=config.use_amp, n_accum=config.n_accum)
        
        # clear self.ongoing
        self.ongoing = []
