import os
import argparse
import threading
from flask import Flask
from dotenv import load_dotenv
from app.routes.home import HomeBluePrint
from app.routes.auth import AuthBluePrint
from app.routes.schedule import ScheduleBluePrint
from app.routes.inference import InferenceBluePrint
from chatbot import config
from chatbot.checker import Checker


if __name__ == '__main__':
    # load .env
    load_dotenv()

    # parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('-o', '--host', type=str, default='localhost')
    parser.add_argument('-p', '--port', type=int, default=8080)
    args = parser.parse_args()

    # app settings
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

    # blueprints
    app.register_blueprint(HomeBluePrint('home', __name__), url_prefix='/')
    app.register_blueprint(AuthBluePrint('auth', __name__), url_prefix='/auth')
    app.register_blueprint(ScheduleBluePrint('schedule', __name__), url_prefix='/schedule')
    app.register_blueprint(InferenceBluePrint('inference', __name__), url_prefix='/inference')

    # run app
    t = threading.Thread(target=app.run, kwargs={'host': args.host, 'port': args.port})
    t.start()
    
    # run checker
    checker = Checker(config)
    checker.run()