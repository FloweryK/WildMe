import os
import datetime
from flask import Blueprint, g, request, jsonify
from app.utils import login_required, hide_credentials
from app.status_code import *
from db.database import database


class TrainBluePrint(Blueprint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # add url rules
        self.add_url_rule('/reserve', 'reserve', self.reserve, methods=['POST'])
    
    @login_required
    def reserve(self):
        # user
        user = g.user

        # extract speaker
        speaker = request.form['speaker']

        # extract file
        f = request.files['file']

        # file path
        dir_user = os.path.join(database.path_fs, user['name'])
        path_data = os.path.join(dir_user, 'data.txt')
        path_vocab = os.path.join(dir_user, 'vocab.model')
        path_weight = os.path.join(dir_user, 'model.pt')
        
        # update user
        user['path_data'] = path_data
        user['path_vocab'] = path_vocab
        user['path_weight'] = path_weight
        user['speaker'] = speaker
        user['reserve_timestamp'] = datetime.datetime.now().timestamp()
        user['reserve_status'] = 'reserved'
        user = database.update(user['name'], user)
        user = hide_credentials(user)

        # upload to db
        os.makedirs(dir_user, exist_ok=True)
        database.fs_upload(f, path_data)

        return jsonify(user), OK
    