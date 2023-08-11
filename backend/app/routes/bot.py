import datetime
from flask import Blueprint, g, request, jsonify
from app.utils import login_required, hide_credentials
from app.status_code import *
from db.database import database
from model.chatbot import Chatbot
import model.config as config


bot_bp = Blueprint('bot', __name__)


# define chatbot
chatbot = Chatbot(config)


@bot_bp.route('/upload', methods=["POST"])
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


@bot_bp.route('/preprocess', methods=["POST"])
@login_required
def preprocess():
    # TODO: preprocess logic
    user = g.user

    # update user's file path
    user['files']['vocab'] = 'db/files/flowerk_vocab.model'
    user = database.update(name=user['name'], user=user)
    user = hide_credentials(user)

    return jsonify(user), CREATED


@bot_bp.route('/train', methods=["POST"])
@login_required
def train():
    # TODO: train logic
    user = g.user

    # update user's file path
    user['files']['weight'] = 'db/files/flowerk_weight.pt'
    user = database.update(name=user['name'], user=user)
    user = hide_credentials(user)

    return jsonify(user), CREATED


@bot_bp.route('/load', methods=["POST"])
@login_required
def load():
    # load chatbot
    path_vocab = g.user['files']['vocab']
    path_weight = g.user['files']['weight']
    chatbot.load(path_vocab, path_weight)

    return {"message": "Model loaded"}, OK


@bot_bp.route('/chat', methods=["POST"])
@login_required
def chat():
    data = request.json
    text = str(data['text'])

    question, question_decode, answer, answer_decode = chatbot.chat(text)

    return {"message": answer_decode}, OK

