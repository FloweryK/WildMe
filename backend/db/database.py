import io
import os
from db.decorator import update
from db.utils import check_schema, fill_schema, hide_credentials
from db.crypt import crypt

        
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
        check_schema(user)
        user = fill_schema(user)
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
        check_schema(user)

        for i in self.data:
            if self.data[i]['name'] == name:
                for key, value in user.items():
                    self.data[i][key] = value

                return hide_credentials(self.data[i])
        
        return None
    
    def fs_upload(self, f, path):
        with open(path, 'w') as file:
            # flask filestroage -> python file object
            data = io.BytesIO(f.read()).read().decode()

            # encrypt
            data_encrypted = crypt.encrypt(data)

            # write encrypted data
            file.write(data_encrypted)


database = Database(path_fs='db/files', path_data='db/files/data.json')