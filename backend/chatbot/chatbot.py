import torch
import sentencepiece as spm
from .constants.custom_tokens import *
from .model.classifier import Classifier


class Chatbot:
    def __init__(self, config):
        # config
        self.config = config

        # vocab
        self.vocab = spm.SentencePieceProcessor()

        # model
        self.model = Classifier(config)
        self.model = self.model.to(config.device)
    
    def load(self, path_vocab, path_weight):
        self.vocab.load(path_vocab)
        self.model.load_state_dict(torch.load(path_weight, map_location=self.config.device))
        self.model.eval()
    
    def chat(self, text, n_max=50):
        question = torch.tensor([[BOS] + self.vocab.EncodeAsIds(text) + [EOS]]).to(self.config.device)
        answer = torch.tensor([[BOS]]).to(self.config.device)

        for _ in range(n_max):
            predict = self.model(question, answer)
            last_word = torch.argmax(predict[:, :, -1:], dim=1)

            answer = torch.cat([answer, last_word], dim=1)
            
            if last_word.item() == EOS:
                break
        
        question = question.cpu().tolist()[0]
        answer = answer.cpu().tolist()[0]

        question_decode = self.vocab.DecodeIds(question)
        answer_decode = self.vocab.DecodeIds(answer)

        return question, question_decode, answer, answer_decode