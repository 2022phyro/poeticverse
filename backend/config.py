import os
from datetime import timedelta
from pathlib import Path

BaseDir = Path(__file__).resolve().parent
is_testing = os.getenv("TESTING", "0") == "1"
stage = os.getenv("STAGE", "dev")
DB_USER = os.getenv("DB_USER")

class BaseConfig:
    """Base configuration"""

    SECRET_KEY = os.getenv("SECRET_KEY", "my_precious_secret_key")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    TOKEN_EXPIRY = timedelta(days=7)
    TOKEN_ALGORITHM = "HS256"
    TOKEN_REISSUANCE_LEEWAY = timedelta(days=5)


class DevelopmentConfig(BaseConfig):
    """Development configuration"""
    TESTING = False
    DEBUG = True
    # TOKEN_EXPIRY = timedelta(days=1)
    # TOKEN_REISSUANCE_LEEWAY = timedelta(hours=12)
    JWT_ACCESS_TOKEN_EXPIRES = {'days':1}
    JWT_ACCESS_TOKEN_LEEWAY = {'hours': 12}
    JWT_REFRESH_TOKEN_EXPIRES = {'days':5}
    JWT_REFRESH_TOKEN_LEEWAY = {'minutes': 15}
    # SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BaseDir, "dev.db")
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+mysqlconnector://{DB_USER}:{os.environ['DB_PASSWORD']}@{os.environ['DB_HOST']}/{os.environ['DB_NAME']}"
    )
    CELERY = dict(
        broker_url=os.getenv('BROKER_URL_DEV'),
        result_backend=os.getenv('RESULT_BACKEND_DEV'),
    )
    REDIS = dict(
        host = '127.0.0.1',
        port = 6379
    )
    IMAGE_KIT = dict(
        public_key = os.environ['PUBLIC_KEY'],
        private_key = os.environ['PRIVATE_KEY'],
        url_endpoint = os.environ['URL_ENDPOINT']
    )
    JSONIFY_PRETTYPRINT_REGULAR = True
    

class TestingConfig(DevelopmentConfig):
    """Testing configuration"""
    TESTING = True
    TOKEN_EXPIRY = timedelta(minutes=1)
    TOKEN_REISSUANCE_LEEWAY = timedelta(seconds=30)
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    

class ProductionConfig(BaseConfig):
    """Production configuration"""
    TESTING = False
    DEBUG = False
    TOKEN_EXPIRY = timedelta(days=7)
    TOKEN_REISSUANCE_LEEWAY = timedelta(days=5)
    DB_NAME = os.environ["DB_NAME"]
    DB_USER = os.environ["DB_USER"]
    DB_PASSWORD = os.environ["DB_PASSWORD"]
    DB_HOST = os.environ["DB_HOST"]
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
    )
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = {'days': 7}
    JWT_ACCESS_TOKEN_LEEWAY = {'days': 5}
    JWT_REFRESH_TOKEN_EXPIRES = {'days': 30}
    JWT_REFRESH_TOKEN_LEEWAY = {'minutes': 30}
    REDIS = dict(
        host=os.environ['REDIS_HOST'],
        port=os.environ['REDIS_PORT'],
        password=os.environ['REDIS_PASSWORD'],
        ssl=os.environ['REDIS_SSL']
    )
    IMAGE_KIT = dict(
        public_key = os.environ['PUBLIC_KEY'],
        private_key = os.environ['PRIVATE_KEY'],
        url_endpoint = os.environ['URL_ENDPOINT']
    )
    CELERY = dict(
        broker_url=os.getenv('BROKER_URL_DEV'),
        result_backend=os.getenv('RESULT_BACKEND_DEV')       
    )


if is_testing:
    config = TestingConfig()
elif stage == "prod":
    config = ProductionConfig()
else:
    config = DevelopmentConfig()
