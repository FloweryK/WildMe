import os
import json
import uuid
import datetime
from flask import Blueprint, g, request, jsonify
from app.constants.status_code import *
from app.decorator import login_required
from db.database import db_schedule
from pprint import pprint


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
            "n_vocab" :             int(request.form['n_vocab']),
            "n_seq" :               int(request.form['n_seq']),
            "n_layer" :             int(request.form['n_layer']),
            "n_head" :              int(request.form['n_head']),
            "d_emb" :               int(request.form['d_emb']),
            "d_hidden" :            int(request.form['d_hidden']),
            "dropout" :             float(request.form['dropout']),
            "scale" :               float(request.form['scale']),
            "r_split" :             float(request.form['r_split']),
            "device" :              str(request.form['device']),
            "is_amp" :              bool(request.form['is_amp'] == 'true'),
            "n_epoch" :             int(request.form['n_epoch']),
            "n_batch" :             int(request.form['n_batch']),
            "n_accum" :             int(request.form['n_accum']),
            "lr" :                  float(request.form['lr']),
            "warmup_steps" :        int(request.form['warmup_steps']),
            "label_smoothing" :     float(request.form['label_smoothing']),
            "is_augment":           bool(request.form['is_augment'] == 'true'),
            "augment_topn":         int(request.form['augment_topn']),
            "augment_threshold":    float(request.form['augment_threshold']),
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
            'i_epoch': 0,
            'n_epoch': config['n_epoch'],
            'ETA': 0,
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

        # get all valid schedules
        schedules = [{
            'tag': s['tag'],
            'name': s['name'],
            'filename': s['filename'],
            'reserve_status': s['reserve_status'],
            'reserve_timestamp': s['reserve_timestamp'],
            'reserve_message': s['reserve_message'],
            'reserve_order': None,
            'i_epoch': s['i_epoch'],
            'n_epoch': s['n_epoch'],
            'ETA': s['ETA'],
        } for s in db_schedule.select_all() if (s['reserve_status'] != None)]

        # sort schedules
        schedules = sorted(schedules, key=lambda s: s['reserve_timestamp'])

        # split done, undone schedules
        schedules_done = [s for s in schedules if (s['reserve_status'] != "reserved")]
        schedules_undone = [s for s in schedules if (s['reserve_status'] == "reserved")]

        # sort undone schedules and calculate reserve order
        for i, s in enumerate(schedules_undone):
            schedules_undone[i]['reserve_order'] = i + 1
        
        # merge schedules
        schedules = schedules_done + schedules_undone

        # filter only the user's schedules
        schedules = [s for s in schedules if s['name'] == user['name']]

        return jsonify(schedules), OK
    
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
    
    @login_required
    def delete(self):
        # extract data
        tag = str(request.json['tag'])

        # find schedule
        db_schedule.delete(where={"tag": tag})

        return {"message": "Deleted"}, OK