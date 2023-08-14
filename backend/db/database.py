import os
from db.decorator import update
from db.utils import check_and_fill, hide_credentials

        
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
        
        return hide_credentials(user)
    
    @update
    def select(self, name, show_credentials=False):
        for i in self.data:
            user = self.data[i]
            if user['name'] == name:
                return user if show_credentials else hide_credentials(user)
            
        return None
    
    @update
    def select_all(self, show_credentials=False):
        users = list(self.data.values())
        return users if show_credentials else [hide_credentials(user) for user in users]

    @update
    def update(self, name, user):
        for i in self.data:
            if self.data[i]['name'] == name:
                self.data[i] = check_and_fill(user)
                return hide_credentials(self.data[i])
        
        return None
    
    def fs_upload(self, f, path):
        f.save(path)


database = Database(path_fs='db/files', path_data='db/files/data.json')