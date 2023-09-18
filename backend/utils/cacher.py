from redis import Redis
import json
from functools import wraps
from api import app

class RedisCacher():
    """Cacher engine implemented using redis"""
    
    CACHE_EXPIRY = 60 * 60 * 24 * 7 # Last seven days    
    def __init__(self, **args) -> None:
        """Redis cacher system to cache
        user profiles
        """
        self.cli = Redis(**args)
        
    def cache_profile(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            _put = str((args[1]['user_id']))
            info = self.cli.get(_put)
            data = None
            if info:
                data = json.loads(info)
            if data:
                # print("Caching worked")
                return data
            user = func(*args)
            try:
                data = json.dumps(user.toDict())
                self.cli.set(_put, data, self.CACHE_EXPIRY)
            except Exception as e:
                print(e)
            return user
        return wrapper

    def reset_cache(self, func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = func(*args)(1)
            print(user)
            try:
                self.cli.delete(str(user.id))
                data = json.dumps(user.toDict())
                self.cli.set(str(user.id), data, self.CACHE_EXPIRY)
            except Exception as e:
                print("Error: ", e)
            return user
        return wrapper


Cacher = RedisCacher(**app.config['REDIS'])
