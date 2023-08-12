from flask import Flask
from .routes.home import HomeBluePrint
from .routes.auth import AuthBluePrint
from .routes.schedule import ScheduleBluePrint
from .routes.inference import InferenceBluePrint
from chatbot import config


# app settings
app = Flask(__name__)

# blueprints
app.register_blueprint(HomeBluePrint('home', __name__), url_prefix='/')
app.register_blueprint(AuthBluePrint('auth', __name__), url_prefix='/auth')
app.register_blueprint(ScheduleBluePrint('schedule', __name__), url_prefix='/schedule')
app.register_blueprint(InferenceBluePrint(config, 'inference', __name__), url_prefix='/inference')