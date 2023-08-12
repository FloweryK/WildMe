from flask import Blueprint, g, request
from chatbot import config
from chatbot.chatbot import Chatbot
from ..constants.status_code import *
from ..decorator import login_required


class InferenceBluePrint(Blueprint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # define chatbot
        # TODO: detach config
        self.chatbot = Chatbot(config)

        self.add_url_rule('/load', 'load', self.load, methods=['POST'])
        self.add_url_rule('/chat', 'chat', self.chat, methods=['POST'])
    
    @login_required
    def load(self):
        path_vocab = g.user['path_vocab']
        path_weight = g.user['path_weight']

        # load chatbot
        self.chatbot.load(path_vocab, path_weight)

        return {"message": "Model loaded"}, OK
    
    @login_required
    def chat(self):
        # extract data
        text = str(request.json['text'])

        # get answer from chatbot
        _, _, _, answer_decode = self.chatbot.chat(text)

        return {"message": answer_decode}, OK