celery -A api.celery_worker worker --loglevel=info -P eventlet
celery -A api.celery_worker beat
flask --app "api:create_app()" run
redis-server
