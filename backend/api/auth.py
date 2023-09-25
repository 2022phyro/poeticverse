"""This module contains decorators and functions that deal with token based authentcation"""
from datetime import timedelta
from typing import TYPE_CHECKING, Callable, Optional

from apiflask import HTTPTokenAuth
from apiflask.scaffold import _annotate
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

if TYPE_CHECKING:
    from apiflask import APIFlask

auth = HTTPTokenAuth()


jwt = JWTManager()


def auth_required(
    optional: bool = False,
    fresh: bool = False,
    refresh: bool = False,
    locations: Optional["str | list"] = None,
    verify_type: bool = True,
    skip_revocation_check: bool = False,
):
    """Protect routes"""

    def decorator(fn):
        _annotate(fn, auth=auth, roles=[])
        return jwt_required(
            optional=optional,
            fresh=fresh,
            refresh=refresh,
            locations=locations,
            verify_type=verify_type,
            skip_revocation_check=skip_revocation_check,
        )(fn)

    return decorator


@jwt.user_lookup_loader
def user_loader_callback(header, payload):
    """User loader callback"""
    from uuid import UUID
    user_id = UUID(payload.get("sub"))

    from models import User, store
    return store.get_one(User, user_id)


"""NOTE: For cookie-based authentication

def refresh_expiring_jwts(response):
    '''Refreshes expiring JWTs'''
    from flask_jwt_extended import set_access_cookies
    from zingela.auth.models import Token
    from uuid import UUID
    from flask import current_app as app

    jwt = get_jwt()
    if jwt["type"] == "refresh":
        return response
    token: "Token" = db.session.get(Token, UUID(jwt["jti"]))
    if token is None:
        # TODO: Log this
        return response
    expiry = jwt["exp"]
    now = datetime.datetime.now()
    target_timestamp = datetime.datetime.timestamp(
        now + app.config["JWT_REFRESH_TOKEN_LEEWAY"])
    if expiry < target_timestamp:
        token.refresh()
        set_access_cookies(response, token.access_token)
    return response

"""


def init_app(app: "APIFlask"):
    """Initializes extension"""

    def convert_from_dict(to_type: Callable, key: str):
        """Converts a value in the app config from a dict to a timedelta"""
        value = app.config.get(key)
        if isinstance(value, dict):
            app.config[key] = to_type(**value)

    for key in (
        "JWT_ACCESS_TOKEN_LEEWAY",
        "JWT_ACCESS_TOKEN_EXPIRES",
        "JWT_REFRESH_TOKEN_EXPIRES",
        "JWT_REFRESH_TOKEN_LEEWAY",
    ):
        convert_from_dict(timedelta, key)
    jwt.init_app(app)
