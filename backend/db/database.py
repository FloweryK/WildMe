import os
import json
from .schema import SCHEMA


def update(func):
    def wrapper(*args, **kwargs):
        self = args[0]
        
        # load data
        if os.path.exists(self.path_data):
            with open(self.path_data, 'r') as f:
                self.data = json.load(f)
        else:
            self.initialize()

        # update id_cur
        self.id_cur = max([-1] + [int(i) for i in self.data]) + 1
        
        # run func
        result = func(*args, **kwargs)

        # save data
        with open(self.path_data, 'w') as f:
            json.dump(self.data, f)
        
        return result
    
    return wrapper


def check_schema(user):
    for col_name in SCHEMA:
        if col_name not in user:
            raise KeyError('field not found:', col_name)
    
    for col_name in user:
        if col_name not in SCHEMA:
            raise KeyError('field not found:', col_name)
    
    return user
        

class Database:
    def __init__(self, path_data, path_fs):
        # make dir for fs
        os.makedirs(path_fs, exist_ok=True)

        self.path_data = path_data
        self.path_fs = path_fs
        self.initialize()
        
    def initialize(self):
        self.data = {}
        self.id_cur = 0
    
    @update
    def select_all(self):
        return self.data.values()

    @update
    def select(self, name):
        for user in self.data.values():
            if user['name'] == name:
                return user
        return None
    
    @update
    def insert(self, user):
        user['id'] = self.id_cur
        self.data[user['id']] = check_schema(user)
        
        return user
    
    @update
    def update(self, name, user):
        for i in self.data:
            if self.data[i]['name'] == name:
                user['id'] = i
                self.data[i] = check_schema(user)
                
                return user
        return None
    
    def fs_upload(self, f, path):
        f.save(path)


database = Database(path_data='db/data.json', path_fs='db/files')