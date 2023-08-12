import os
from .decorator import update
from .utils import check_and_fill

        
class Database:
    def __init__(self, path_fs, path_data):
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
        return list(self.data.values())

    @update
    def update(self, name, user):
        for i in self.data:
            if self.data[i]['name'] == name:
                self.data[i] = check_and_fill(user)
                return self.data[i]
        
        return None
    
    def fs_upload(self, f, path):
        f.save(path)


database = Database(path_fs='db/files', path_data='db/files/data.json')