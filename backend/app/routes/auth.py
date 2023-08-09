import datetime
import jwt
import bcrypt
from flask import Blueprint, request, jsonify, current_app
from app.utils import hide_credentials
from app.status_code import *
from db.database import database


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=["POST"])
def on_signup():
    # extract data
    data = request.json
    name = str(data['name'])
    password = str(data['password'])

    # check if name or password is empty
    if not name or not password:
        return {'message': 'Both name and password are required'}, BAD_REQUEST
    
    # check if the user's name already exists
    if database.select(name):
        return {'message': 'Name already exists'}, CONFLICT
    
    # encrypt password
    password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # insert user
    user = {
        'name': name,
        'password': password,
        'file': None
    }

    # hide credentials
    result = hide_credentials(database.insert(user))

    return jsonify(result), CREATED


@auth_bp.route('/signin', methods=["POST"])
def on_signin():
    # extract data
    data = request.json
    name = data['name']
    password = data['password']

    # get user data
    user = database.select(name)

    if not user:
        return {'message': 'No user found'}, NOT_FOUND
    elif not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return {'message': 'Invalid password'}, UNAUTHORIZED
    else:
        # create payload
        payload = {
            'id': user['id'],
            'name': user['name'],
            'expire_timestamp': (datetime.datetime.now() + datetime.timedelta(seconds=60*60*24)).timestamp()
        }

        # create access token
        access_token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], 'HS256')
        result = {'Authorization': access_token}

        return jsonify(result), OK