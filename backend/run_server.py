import os
from flask import Flask, send_from_directory, request, abort
from flask_cors import CORS
from dotenv import load_dotenv
from app.routes.home import HomeBluePrint
from app.routes.auth import AuthBluePrint
from app.routes.schedule import ScheduleBluePrint
from app.routes.inference import InferenceBluePrint

VALID_REQUESTS_PREFIX = (
    "/static/js",
    "/static/css",
    "/manifest.json",
    "/favicon.ico",
    "/logo192.png",
    "/logo512.png"
)

VALID_REQUESTS = (
    # Screens
    "/", 
    "/auth/personal",
    "/auth/chat",

    # APIS
    "/auth/signin",
    "/auth/signup",
    "/schedule/reserve", 
    "/schedule/read", 
    "/schedule/stop", 
    "/schedule/delete", 
    "/inference/chat"
)


# load .env
load_dotenv()

# app settings
app = Flask(__name__)
app = Flask(__name__, static_folder='build/')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
CORS(app)

# app routings
@app.before_request
def block_path():
    if ".git" in request.path:
        abort(403)  # Forbidden
    if not (request.path.startswith(VALID_REQUESTS_PREFIX) or (request.path in VALID_REQUESTS)):
        abort(403)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != '' and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# blueprints
app.register_blueprint(HomeBluePrint('home', __name__), url_prefix='/')
app.register_blueprint(AuthBluePrint('auth', __name__), url_prefix='/auth')
app.register_blueprint(ScheduleBluePrint('schedule', __name__), url_prefix='/schedule')
app.register_blueprint(InferenceBluePrint('inference', __name__), url_prefix='/inference')


if __name__ == '__main__':
    app.run(host=os.environ.get('HOST'), port=os.environ.get('PORT'))
