from apiflask import APIFlask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from .auth import init_app
from utils.tasks import make_celery
import config
app = APIFlask(__name__)
cors = CORS(app, resources={r"/v1/*": {"origins": "*"}})
app.config.from_object(config.DevelopmentConfig)
app.app_context().push()
db = SQLAlchemy(app)
make_celery(app)
init_app(app)
celery = app.extensions["celery"]

# socket = SocketIO(app)
# init_app(app)

def create_app():
    """Create and configure an instance of the Flask application."""
    from api.v1 import app_views
    app.register_blueprint(app_views)
    return app

if __name__ == "__main__":
    create_app().run()
