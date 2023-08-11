from flask import Blueprint, g, request
from app.utils import login_required
from app.status_code import *
from chatbot.chatbot import Chatbot
from chatbot import config


inference_bp = Blueprint('inference', __name__)


# define chatbot
chatbot = Chatbot(config)


@inference_bp.route('/load', methods=["POST"])
@login_required
def load():
    # load chatbot
    path_vocab = g.user['files']['vocab']
    path_weight = g.user['files']['weight']
    chatbot.load(path_vocab, path_weight)

    return {"message": "Model loaded"}, OK


@inference_bp.route('/chat', methods=["POST"])
@login_required
def chat():
    data = request.json
    text = str(data['text'])

    question, question_decode, answer, answer_decode = chatbot.chat(text)

    return {"message": answer_decode}, OK

