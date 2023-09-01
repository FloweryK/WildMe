import time
import torch
from torch.utils.data import Subset, DataLoader, random_split
from torch.optim.lr_scheduler import _LRScheduler
from torch.utils.tensorboard import SummaryWriter
from chatbot.constants.custom_tokens import *
from chatbot.dataset.base import collate_fn
from chatbot.dataset.kakaotalk import KakaotalkDataset
from chatbot.model.classifier import Classifier
from chatbot.config import Config
from chatbot.trainer import Trainer
from db.database import db_schedule


def get_model_parameters(model):
    return sum(p.numel() for p in model.parameters() if p.requires_grad)


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
    

class Checker:
    def run(self):
        while True:
            time.sleep(1)
            schedules = db_schedule.select_all()

            # check ongoing
            ongoing = [schedule for schedule in schedules if schedule['reserve_status'] == "ongoing"]
            if ongoing:
                continue

            # check reserved
            reserved = [schedule for schedule in schedules if schedule['reserve_status'] == "reserved"]
            reserved = sorted(reserved, key=lambda x: x['reserve_timestamp'])
            if not reserved:
                continue

            # run the training process for the first reserved element
            schedule = reserved[0]

            # update user's reserved_status
            schedule['reserve_status'] = 'ongoing'
            db_schedule.update(where={"tag": schedule['tag']}, row=schedule)

            # run training
            try:
                self.train(
                    path_config=schedule['path_config'],
                    path_data=schedule['path_data'],
                    path_vocab=schedule['path_vocab'],
                    path_weight=schedule['path_weight'],
                    speaker=schedule['speaker'],
                    tag=schedule['tag'],
                )

                # update as done
                schedule['reserve_status'] = 'done'
                db_schedule.update(where={"tag": schedule['tag']}, row=schedule)
            except Exception as e:
                print(e)

                # update as failed
                if schedule:
                    schedule['reserve_status'] = 'failed'
                    schedule['reserve_message'] = str(e)
                    db_schedule.update(where={"tag": schedule['tag']}, row=schedule)


    def train(self, path_config, path_data, path_vocab, path_weight, speaker, tag):
        # load config
        config = Config(path_config)

        # dataset
        dataset = KakaotalkDataset(
            path_data=path_data, 
            path_vocab=path_vocab, 
            n_vocab=config.n_vocab,
            is_augment=config.is_augment, 
            augment_topn=config.augment_topn, 
            augment_threshold=config.augment_threshold, 
            speaker=speaker
        )
        train_size = int(config.r_split * len(dataset))
        trainset, testset = random_split(dataset, [train_size, len(dataset) - train_size])

        # filter out augmented data in the testset
        testset = Subset(testset, indices=[i for i, data in enumerate(testset) if not data['is_augmented']])

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
        scaler = torch.cuda.amp.GradScaler(enabled=config.is_amp)

        # writer
        writer = SummaryWriter()

        # trainer
        trainer = Trainer(model, criterion, scaler, optimizer, scheduler, writer)

        # train
        t_start = time.time()
        for epoch in range(config.n_epoch):
            # train and test
            trainer.run_epoch(epoch, trainloader, config.device, True, config.is_amp, config.n_accum)
            trainer.run_epoch(epoch, testloader, config.device, False, config.is_amp, config.n_accum)

            # check schedule delete or stop
            schedule = db_schedule.select({"tag": tag})
            if (not schedule) or (schedule['reserve_status'] == 'stop'):
                break
            
            # save weight
            trainer.save_weight(path_weight)

            # calculate ETA
            t_mid = time.time()
            ETA = (t_mid - t_start) * (config.n_epoch - epoch - 1) / (epoch + 1)

            # udpate schedule
            schedule['i_epoch'] = epoch
            schedule['n_epoch'] = config.n_epoch
            schedule['ETA'] = ETA
            db_schedule.update({"tag": tag}, schedule)