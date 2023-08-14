import os
import json
import datetime
from flask import Blueprint, g, request, jsonify
from app.constants.status_code import *
from app.decorator import login_required
from db.database import database


class ScheduleBluePrint(Blueprint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # add url rules
        self.add_url_rule('/reserve', 'reserve', self.reserve, methods=['POST'])
        self.add_url_rule('/read', 'read', self.read, methods=['POST'])
        self.add_url_rule('/stop', 'stop', self.stop, methods=['POST'])
        self.add_url_rule('/delete', 'delete', self.delete, methods=['POST'])
    
    @login_required
    def reserve(self):
        # user
        user = g.user

        # extract data
        speaker = request.form['speaker']
        f = request.files['file']

        # extract config
        config = {
            "data_type":        str(request.form['data_type']),
            "n_vocab" :         int(request.form['n_vocab']),
            "n_seq" :           int(request.form['n_seq']),
            "n_layer" :         int(request.form['n_layer']),
            "n_head" :          int(request.form['n_head']),
            "d_emb" :           int(request.form['d_emb']),
            "d_hidden" :        int(request.form['d_hidden']),
            "dropout" :         float(request.form['dropout']),
            "scale" :           float(request.form['scale']),
            "r_split" :         float(request.form['r_split']),
            "device" :          str(request.form['device']),
            "use_amp" :         bool(request.form['use_amp'] == 'True'),
            "n_epoch" :         int(request.form['n_epoch']),
            "n_batch" :         int(request.form['n_batch']),
            "n_accum" :         int(request.form['n_accum']),
            "lr" :              float(request.form['lr']),
            "warmup_steps" :    int(request.form['warmup_steps']),
            "label_smoothing" : float(request.form['label_smoothing']),
        }

        # file path
        dir_user = os.path.join(database.path_fs, user['name'])
        path_data = os.path.join(dir_user, 'data.txt')
        path_vocab = os.path.join(dir_user, 'vocab.model')
        path_config = os.path.join(dir_user, 'config.json')
        path_weight = os.path.join(dir_user, 'model.pt')
        
        # update user
        user['path_data'] = path_data
        user['path_vocab'] = path_vocab
        user['path_config'] = path_config
        user['path_weight'] = path_weight
        user['speaker'] = speaker
        user['reserve_timestamp'] = datetime.datetime.now().timestamp()
        user['reserve_status'] = 'reserved'
        user = database.update(user['name'], user)

        # upload to db
        os.makedirs(dir_user, exist_ok=True)
        database.fs_upload(f, path_data)

        # upload config as json
        with open(path_config, 'w') as j:
            json.dump(config, j)

        return jsonify(user), OK
    
    @login_required
    def read(self):
        schedule = database.select_all()
        schedule = [s for s in schedule if s['reserve_status'] != None]
        return jsonify(schedule), OK
    
    @login_required
    def stop(self):
        # update user
        user = g.user
        user['reserve_status'] = 'stop'
        user = database.update(user['name'], user)

        return {"message": "Deleted"}, OK
    
    @login_required
    def delete(self):
        # update user
        user = g.user
        user['path_data'] = None
        user['path_vocab'] = None
        user['path_config'] = None
        user['path_weight'] = None
        user['speaker'] = None
        user['reserve_timestamp'] = None
        user['reserve_status'] = None
        user = database.update(user['name'], user)

        return {"message": "Deleted"}, OK

