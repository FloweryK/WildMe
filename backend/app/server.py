from flask import Flask
from app.routes.home import home_bp
from app.routes.auth import auth_bp
from app.routes.train import train_bp
from app.routes.inference import inference_bp


# app settings
app = Flask(__name__)

# blueprints
app.register_blueprint(home_bp, url_prefix='/')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(train_bp, url_prefix='/train')
app.register_blueprint(inference_bp, url_prefix='/inference')