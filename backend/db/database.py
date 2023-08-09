import os
import json


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
    def select(self, name):
        for user in self.data.values():
            if user['name'] == name:
                return user
        return None
    
    @update
    def insert(self, user):
        user['id'] = self.id_cur
        self.data[user['id']] = user
        return user
    
    @update
    def update(self, name, user):
        for i in self.data:
            if self.data[i]['name'] == name:
                user['id'] = i
                self.data[i] = user
                return self.data[i]
        return None
    
    def fs_upload(self, f, file_name):
        # save the file
        path = os.path.join(self.path_fs, file_name)
        f.save(path)
        return path


database = Database(path_data='db/data.json', path_fs='db/files')