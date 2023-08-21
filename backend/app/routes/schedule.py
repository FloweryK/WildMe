import os
import json
import uuid
import datetime
from flask import Blueprint, g, request, jsonify
from app.constants.status_code import *
from app.decorator import login_required
from db.database import db_schedule


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
            "use_amp" :         bool(request.form['use_amp'] == 'true'),
            "n_epoch" :         int(request.form['n_epoch']),
            "n_batch" :         int(request.form['n_batch']),
            "n_accum" :         int(request.form['n_accum']),
            "lr" :              float(request.form['lr']),
            "warmup_steps" :    int(request.form['warmup_steps']),
            "label_smoothing" : float(request.form['label_smoothing']),
        }

        # file path
        tag = uuid.uuid4().hex
        dir_user = os.path.join(db_schedule.path_fs, user['name'])
        path_data = os.path.join(dir_user, f'{tag}_data.txt')
        path_vocab = os.path.join(dir_user, f'{tag}_vocab.model')
        path_config = os.path.join(dir_user, f'{tag}_config.json')
        path_weight = os.path.join(dir_user, f'{tag}_model.pt')
        
        # create row
        schedule = {
            'tag': tag,
            'name': user['name'],
            'filename': f.filename,
            'path_data': path_data,
            'path_vocab': path_vocab,
            'path_config': path_config,
            'path_weight': path_weight,
            'speaker': speaker,
            'reserve_timestamp': datetime.datetime.now().timestamp(),
            'reserve_status': 'reserved',
        }
        db_schedule.insert(schedule)

        # upload to db
        os.makedirs(dir_user, exist_ok=True)
        db_schedule.fs_upload(f, path_data)

        # upload config as json
        with open(path_config, 'w') as j:
            json.dump(config, j)

        return jsonify(user), OK
    
    @login_required
    def read(self):
        user = g.user
        schedule = db_schedule.select_all()
        schedule = [{
            'tag': s['tag'],
            'name': s['name'],
            'filename': s['filename'],
            'reserve_status': s['reserve_status'],
            'reserve_timestamp': s['reserve_timestamp'],
        } for s in schedule if (s['reserve_status'] != None) and (s['name'] == user['name'])]
        return jsonify(schedule), OK
    
    @login_required
    def stop(self):
        # extract data
        tag = str(request.json['tag'])

        # find schedule
        schedule = db_schedule.select(where={"tag": tag})
        schedule['reserve_status'] = 'stop'

        # update schedule
        db_schedule.update(where={"tag": tag}, row=schedule)
        
        return {"message": "Deleted"}, OK