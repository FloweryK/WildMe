import os
from cryptography.fernet import Fernet
from dotenv import load_dotenv
load_dotenv()


class Crypt:
    def __init__(self, key):
        self.fernet = Fernet(key.encode())
    
    def encrypt(self, data: str):
        return self.fernet.encrypt(data.encode()).decode()
    
    def decrypt(self, data: str):
        return self.fernet.decrypt(data.encode()).decode()


crypt = Crypt(os.environ.get('FERNET_KEY'))
