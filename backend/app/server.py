from flask import Flask
from app.routes.home import HomeBluePrint
from app.routes.auth import AuthBluePrint
from app.routes.train import train_bp
from app.routes.inference import inference_bp


# app settings
app = Flask(__name__)

# blueprints
app.register_blueprint(HomeBluePrint('home', __name__), url_prefix='/')
app.register_blueprint(AuthBluePrint('auth', __name__), url_prefix='/auth')
app.register_blueprint(train_bp, url_prefix='/train')
app.register_blueprint(inference_bp, url_prefix='/inference')