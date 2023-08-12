import os
import json


def update(func):
    def wrapper(*args, **kwargs):
        self = args[0]
        
        # load data
        if os.path.exists(self.path_data):
            with open(self.path_data, 'r') as f:
                self.data = json.load(f)

        # update id_cur
        self.id_cur = max([-1] + [int(i) for i in self.data]) + 1
        
        # run func
        result = func(*args, **kwargs)

        # save data
        with open(self.path_data, 'w') as f:
            json.dump(self.data, f)
        
        return result
    
    return wrapper


def check_and_fill(user):
    SCHEMA = [
        "id",
        "name",
        "password",
        "path_data",
        "path_vocab",
        "path_weight",
        "speaker",
        "reserve_timestamp",
        "reserve_status"
    ]

    # check invalid columns
    for col in user:
        if col not in SCHEMA:
            raise KeyError(f"Invalid column: {col}")
    
    # check null columns
    for col in SCHEMA:
        if col not in user:
            user[col] = None
    
    return user

        
class Database:
    def __init__(self, path_data, path_fs):
        # make dir for fs
        os.makedirs(path_fs, exist_ok=True)

        self.path_data = path_data
        self.path_fs = path_fs
        self.data = {}
        self.id_cur = 0

    @update
    def insert(self, user):
        user = check_and_fill(user)
        user['id'] = self.id_cur

        # put into data
        self.data[user['id']] = user
        
        return user
    
    @update
    def select(self, name):
        for i in self.data:
            if self.data[i]['name'] == name:
                return self.data[i]
            
        return None
    
    @update
    def select_all(self):
        return self.data.values()

    @update
    def update(self, name, user):
        for i in self.data:
            if self.data[i]['name'] == name:
                self.data[i] = check_and_fill(user)
                return self.data[i]
        
        return None
    
    def fs_upload(self, f, path):
        f.save(path)


database = Database(path_data='db/data.json', path_fs='db/files')