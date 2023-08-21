import io
import os
from db.decorator import update
from db.crypt import crypt

        
class Database:
    def __init__(self, schema, credentials, path_fs, path_data):
        # make dir for fs
        os.makedirs(path_fs, exist_ok=True)

        # schema
        self.schema = schema
        self.credentials = credentials

        # store
        self.path_data = path_data
        self.path_fs = path_fs
        self.data = {}
        self.id_cur = 0
    
    def check_schema(self, row):
        # check invalid columns
        for col in row:
            if col not in self.schema:
                raise KeyError(f"Invalid column: {col}")
        
    def fill_schema(self, row):
        # check null columns
        for col in self.schema:
            if col not in row:
                row[col] = None
        return row

    def hide_credentials(self, row):
        return {col: value for col, value in row.items() if col not in self.credentials}

    @update
    def insert(self, row):
        self.check_schema(row)
        row = self.fill_schema(row)
        row['id'] = self.id_cur

        # put into data
        self.data[row['id']] = row
        
        return self.hide_credentials(row)
    
    @update
    def select(self, where, show_credentials=False):
        for i in self.data:
            row = self.data[i]
            
            if sum([row[col] != value for col, value in where.items()]) == 0:
                return row if show_credentials else self.hide_credentials(row)
            
        return None
    
    @update
    def select_all(self, show_credentials=False):
        rows = list(self.data.values())
        return rows if show_credentials else [self.hide_credentials(row) for row in rows]

    @update
    def update(self, where, row):
        self.check_schema(row)

        for i in self.data:
            if sum([self.data[i][col] != value for col, value in where.items()]) == 0:
                for col, value in row.items():
                    self.data[i][col] = value

                return self.hide_credentials(self.data[i])
        
        return None
    
    def fs_upload(self, f, path):
        with open(path, 'w') as file:
            # flask filestroage -> python file object
            data = io.BytesIO(f.read()).read().decode()

            # encrypt
            data_encrypted = crypt.encrypt(data)

            # write encrypted data
            file.write(data_encrypted)


db_user = Database(
    schema=[
        "id",
        "name",
        "password",
    ],
    credentials=[
        "password"
    ],
    path_fs='db/users', 
    path_data='db/users/data.json'
)

db_schedule = Database(
    schema=[
        "id",
        "tag",
        "name",
        "filename",
        "path_data",
        "path_vocab",
        "path_config",
        "path_weight",
        "speaker",
        "reserve_timestamp",
        "reserve_status"
    ],
    credentials=[],
    path_fs='db/schedules', 
    path_data='db/schedules/data.json'
)