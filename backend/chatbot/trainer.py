import time
import torch
import numpy as np
from tqdm import tqdm
from contextlib import nullcontext
from chatbot.utils import get_bleu


class Trainer:
    def __init__(self, model, criterion, scaler, optimizer, scheduler, writer, path_weight):
        self.model = model
        self.criterion = criterion
        self.scaler = scaler
        self.optimizer = optimizer
        self.scheduler = scheduler
        self.writer = writer
        self.path_weight = path_weight
    
    def run_epoch(self, epoch, dataloader, device, train=True, use_amp=False, n_accum=1):
        losses = []
        times = []
        bleus = []

        if train:
            self.model.train()
        else:
            self.model.eval()

        with tqdm(total=len(dataloader), desc=f"{'train' if train else 'test '} {epoch}") as pbar:
            for i, data in enumerate(dataloader):
                # perf counter: start
                t_start = time.perf_counter()

                # load input, label
                x_enc, x_dec = (x.to(device) for x in  data)
                x_dec_input = x_dec[:, :-1]
                x_dec_target = x_dec[:, 1:]

                # autocast
                with torch.autocast(device_type=device, dtype=torch.float16) if use_amp else nullcontext():
                    predict = self.model(x_enc, x_dec_input)

                    # calculate loss
                    loss = self.criterion(predict, x_dec_target)
                    losses.append(loss.item())

                    if train:
                        # accumulate gradient (x.grad += dloss/dx)
                        self.scaler.scale(loss).backward()

                        if ((i+1) % n_accum == 0) or (i+1 == len(dataloader)):
                            # perform a step of gradient descent (x += -lr * x.grad)
                            # if the gradients do not contain infs or NaNs, optimizer.step() is called. otherwise, optimizer.step() is skipped.
                            self.scaler.step(self.optimizer)

                            # update the scale for next iteration
                            self.scaler.update()

                            # update the learning rate (for every iteration)
                            self.scheduler.step()

                            # clear gradient (x.grad = 0)
                            self.optimizer.zero_grad()

                # perf counter: end
                t_end = time.perf_counter()
                times.append(t_end - t_start)

                # extract logits from predict
                predict = torch.argmax(predict, dim=1)

                # get bleu
                bleus.extend([get_bleu(ref, cand) for ref, cand in zip(x_dec_target, predict)])

                # get memory
                mem_info = torch.cuda.mem_get_info() if device == 'cuda' else [0, 0]
                memory = (mem_info[1] - mem_info[0]) / 1024**3
            
                # update progress bar
                pbar.update(1)
                pbar.set_postfix_str(f"Loss: {losses[-1]:.2f} ({np.mean(losses):.2f}) | lr: {self.scheduler.get_last_lr()[0]:.2e} | bleu: {np.mean(bleus):.1f} | {memory:.2f}GB | {np.mean(times) * 1000:.0f}ms")

            # save model
            if train:
                torch.save(self.model.state_dict(), self.path_weight)
            
            # tensorboard
            self.writer.add_scalar(f'Train/Loss' if train else 'Test/Loss', np.mean(losses), epoch)
            self.writer.add_scalar(f'Train/lr' if train else 'Test/lr', self.scheduler.get_last_lr()[0], epoch)
            self.writer.add_scalar(f'Train/bleu' if train else 'Test/bleu', np.mean(bleus), epoch)
            self.writer.add_scalar(f'Train/memory' if train else 'Test/memory', memory, epoch)
            self.writer.add_scalar(f'Train/time_iter' if train else 'Test/time_iter', np.mean(times) * 1000, epoch)
            self.writer.add_scalar(f'Train/time_epoch' if train else 'Test/time_epoch', np.sum(times), epoch)

