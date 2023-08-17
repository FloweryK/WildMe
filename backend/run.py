import os
import argparse
import threading
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from app.routes.home import HomeBluePrint
from app.routes.auth import AuthBluePrint
from app.routes.schedule import ScheduleBluePrint
from app.routes.inference import InferenceBluePrint
from chatbot.checker import Checker


if __name__ == '__main__':
    # load .env
    load_dotenv()

    # app settings
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    CORS(app)

    # blueprints
    app.register_blueprint(HomeBluePrint('home', __name__), url_prefix='/')
    app.register_blueprint(AuthBluePrint('auth', __name__), url_prefix='/auth')
    app.register_blueprint(ScheduleBluePrint('schedule', __name__), url_prefix='/schedule')
    app.register_blueprint(InferenceBluePrint('inference', __name__), url_prefix='/inference')

    # run app
    t = threading.Thread(target=app.run, kwargs={'host': os.environ.get('HOST'), 'port': os.environ.get('PORT')})
    t.start()
    
    # run checker
    checker = Checker()
    checker.run()