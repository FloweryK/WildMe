import datetime
import jwt
from functools import wraps
from flask import request, g, current_app
from app.constants.status_code import *
from db.database import db_user


def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        # get access token
        access_token = request.headers.get("Authorization")

        if access_token is None:
            return {'message': 'Unauthorized access'}, UNAUTHORIZED
        else:
            try:
                payload = jwt.decode(access_token, current_app.config["JWT_SECRET_KEY"], "HS256")
            except jwt.InvalidTokenError:
                payload = None
            
            # check if decoding on payload failed
            if payload is None:
                return {'message': 'Unauthorized access'}, UNAUTHORIZED

            # get user
            user = db_user.select(where={"name": payload["name"]})

            # check if the access token is expired
            if (user is None) or (payload['expire_timestamp'] < datetime.datetime.now().timestamp()):
                return {'message': 'Unauthorized access'}, UNAUTHORIZED
            
            g.user = user
	
        return func(*args, **kwargs)
    
    return decorated_function