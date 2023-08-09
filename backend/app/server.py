from flask import Flask
from app.routes.home import home_bp
from app.routes.auth import auth_bp
from app.routes.bot import bot_bp


# app settings
app = Flask(__name__)

# blueprints
app.register_blueprint(home_bp, url_prefix='/')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(bot_bp, url_prefix='/bot')