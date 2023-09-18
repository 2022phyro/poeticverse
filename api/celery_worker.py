from api import celery  # Import your Celery instance from api/__init__.py
from utils.mailer import *  # Import your Celery tasks from utils/mailer.py
from utils.notify import *
if __name__ == '__main__':
    celery.start()
