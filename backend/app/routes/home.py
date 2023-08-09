from flask import Blueprint, g
from app.utils import login_required
from app.status_code import *


home_bp = Blueprint('home', __name__)


@home_bp.route('/')
def heartbeat():
    return {'message': 'hello world!'}, OK


@home_bp.route('/vip')
@login_required
def vip():
    return {"message": f"hello vip!: {g.user['name']}"}, OK