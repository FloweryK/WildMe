import datetime
from flask import Blueprint, g, request, jsonify
from app.utils import login_required, hide_credentials
from app.status_code import *
from db.database import database


model_bp = Blueprint('model', __name__)


@model_bp.route('/upload', methods=["POST"])
@login_required
def upload():
    # extract txt file
    f = request.files['file']

    # file path
    file_name = f'{g.user["name"]}_{datetime.datetime.now().strftime("%Y%m%d_%H_%M_%S")}.txt'

    # upload to db
    path_data = database.fs_upload(f, file_name)

    # update user's file path
    g.user['files']['data'] = path_data
    result = hide_credentials(database.update(name=g.user['name'], user=g.user))
    
    return jsonify(result), CREATED