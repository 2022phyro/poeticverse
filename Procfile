web: gunicorn -c gunicorn.conf.py
worker: celery -A api.celery_worker worker --loglevel=info -P eventlet