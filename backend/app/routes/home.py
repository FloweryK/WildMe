from flask import Blueprint, g
from app.constants.status_code import *
from app.decorator import login_required


class HomeBluePrint(Blueprint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
        self.add_url_rule('/', 'heartbeat', self.heartbeat)
        self.add_url_rule('/vip', 'vip', self.vip)
    
    def heartbeat(self):
        return {'message': 'hello world!'}, OK
    
    @login_required
    def vip(self):
        return {"message": f"hello vip!: {g.user['name']}"}, OK