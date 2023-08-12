import os
import argparse
import threading
from app.server import app
from dotenv import load_dotenv


if __name__ == '__main__':
    # load .env
    load_dotenv()

    # parse arguments
    parser = argparse.ArgumentParser()
    parser.add_argument('-o', '--host', type=str, default='localhost')
    parser.add_argument('-p', '--port', type=int, default=8080)
    args = parser.parse_args()

    # app configure
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

    # run app
    t = threading.Thread(target=app.run, kwargs={'host': args.host, 'port': args.port})
    t.start()
    