from flask import Blueprint, g, request
from app.constants.status_code import *
from app.decorator import login_required
from chatbot import config
from chatbot.chatbot import Chatbot


class InferenceBluePrint(Blueprint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # define chatbot
        # TODO: detach config
        self.chatbot = Chatbot(config)

        self.add_url_rule('/chat', 'chat', self.chat, methods=['POST'])
    
    @login_required
    def chat(self):
        # extract data
        text = str(request.json['text'])
        
        # get paths
        user = g.user
        path_vocab = user['path_vocab']
        path_weight = user['path_weight']

        if (not path_vocab) or (not path_weight):
            return {"message": "Not trained yet"}, BAD_REQUEST

        # load chatbot
        self.chatbot.load(path_vocab, path_weight)

        # get answer from chatbot
        _, _, _, answer_decode = self.chatbot.chat(text)

        return {"message": answer_decode}, OK