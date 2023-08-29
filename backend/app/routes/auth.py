import datetime
import jwt
import bcrypt
from flask import Blueprint, request, jsonify, current_app, g
from app.constants.status_code import *
from app.decorator import login_required
from db.database import db_user, db_schedule


class AuthBluePrint(Blueprint):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.add_url_rule('/signup', 'signup', self.signup, methods=['POST'])
        self.add_url_rule('/signin', 'signin', self.signin, methods=['POST'])
        self.add_url_rule('/delete', 'delete', self.delete, methods=['POST'])
    
    @staticmethod
    def signup():
        # extract data
        name = str(request.json['name'])
        password = str(request.json['password'])

        # check if name or password is empty
        if not name or not password:
            return {'message': 'Both name and password are required'}, BAD_REQUEST
        
        # check if the user's name already exists
        if db_user.select(where={"name": name}):
            return {'message': 'Name already exists'}, CONFLICT
        
        # encrypt password
        password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # insert user
        user = db_user.insert({
            'name': name,
            'password': password,
        })

        return jsonify(user), CREATED

    @staticmethod
    def signin():
        # extract data
        name = str(request.json['name'])
        password = str(request.json['password'])

        # get user data
        user = db_user.select(where={"name": name}, show_credentials=True)

        # check if the user exists
        if not user:
            return {'message': 'No user found'}, NOT_FOUND
    
        # check if the pass is valid
        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return {'message': 'Invalid password'}, UNAUTHORIZED
        
        # create payload
        payload = {
            'id': user['id'],
            'name': user['name'],
            'expire_timestamp': (datetime.datetime.now() + datetime.timedelta(seconds=60*60*24)).timestamp()
        }

        # create access token
        access_token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], 'HS256')

        return {'Authorization': access_token}, OK
    
    @login_required
    def delete(self):
        # user
        user = g.user

        # delete schedules
        schedules = [s for s in db_schedule.select_all() if s['name'] == user['name']]
        for schedule in schedules:
            db_schedule.delete(where={'tag': schedule['tag']})
        
        # delete user
        db_user.delete(where={'id': user['id']})

        return {'message': "Deleted"}, OK

        

        