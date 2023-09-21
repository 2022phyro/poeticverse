import os

# Server Socket
wsgi_app = os.environ["FLASK_APP"]
reload = os.getenv("GUNICORN_RELOAD", "0") == "1"
HOST = os.getenv("HOST", "localhost")
PORT = os.getenv("PORT", "5000")
bind = os.getenv("GUNICORN_BIND", f"{HOST}:{PORT}")
workers = int(os.getenv("GUNICORN_WORKERS", "1"))
threads = int(os.getenv("GUNICORN_THREADS", "1"))

# Logging
loglevel = os.getenv("GUNICORN_LOG_LEVEL", os.getenv("LOG_LEVEL", "info"))
