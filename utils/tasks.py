from celery import Celery, Task
from celery.schedules import crontab
from apiflask import APIFlask

def make_celery(app: APIFlask):
    """Configures the celery app"""
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)
    celery = Celery(
        app.import_name, broker=app.config['CELERY_BROKER'],
        task_cls=FlaskTask, backend=app.config['CELERY_RESULTS_BACKEND']
        )
    schedules = {
        'Cleanup Job': {
            'task': 'utils.mailer.cleanup_unverified_users',
            'schedule': crontab(day_of_week='*', minute=0,
                                hour=0, day_of_month='*/2'),
        },
        'Notification job': {
            'task': 'utils.mailer.cleanup_notifications',
            'schedule': crontab(day_of_week='*', minute=0,
                                hour=0, day_of_month='*/7'),
        },
        'test beat': {
        'task': 'utils.notify.test',
            'schedule': crontab(minute='*/2'),  # Set the task to run every two minutes
            'options': {'expires': 120},  # Optional: Set an expiration time for the task (in seconds)
        }
    }
    celery.conf.beat_schedule.update(schedules)
    celery.set_default()
    app.extensions['celery'] = celery
    return celery
