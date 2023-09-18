from typing import cast
from uuid import UUID
from apiflask.views import MethodView
from flask import jsonify
from flask_jwt_extended import get_current_user, get_jwt
from utils.mailer import (
    send_verification_mail,
    send_reset_password_mail,
    extract_cred,
)
from utils.cacher import Cacher
from api.v1 import app_views as app
from api.examples import exauth as ex
from api.schemas.auth import TokenRefresh
from api.schemas.auth import User as UserSchema
from api.schemas.auth import (
    UserCreate,
    UserDelete,
    UserLogin,
    UserLogout,
    UserUpdate,
    Search
)
from api.schemas.file import UpdateAvatar, upload_image, delete_image
from models import Token
from api.auth import auth_required
from models import store
from apiflask import abort
from datetime import datetime
from werkzeug.utils import secure_filename

@app.post("/login")
@app.input(UserLogin.user_login_In, example=ex.AuthEx.Login_in)
@app.output(UserLogin.user_login_Out, 200, example=ex.AuthEx.Login_out)
def login(json_data):
    """Login"""
    from models import User

    login = json_data["login"]
    password = json_data["password"]

    if "@" in login:
        user: "User" = store.get_one(User, None, email=login)
        if not user:
            user: "User" = store.get_one(User, None, pen_name=login)
    else:
        user: "User" = store.get_one(User, None, pen_name=login)
    if user is None:
        return abort(404, "User does not exist")
    elif not user.verifyPassword(password):
        return abort(401, "Cannot authenticate")
    token: "Token" = user.request_token()
    response = jsonify(
        {
            "message": "Successfully logged in",
            "atoken": token.access_token,
            "atoken_expiry": token.atoken_expiry,
            "rtoken": token.refresh_token,
            "rtoken_expiry": token.rtoken_expiry,
            'id': user.id,
            "rank": user.rank.value,
            "auth_type": "Bearer",
        }
    )
    return response


@app.post("/logout")
@auth_required()
@app.output(UserLogout.user_logout_Out, 200, example=ex.AuthEx.Logout_out)
def logout():
    """Logout"""
    from models import User

    jwt = get_jwt()
    user: "User" = get_current_user()
    token: "Token" = store.get_one(Token, UUID(jwt["jti"]))
    user.deactivate_token(token)
    return {"message": "Logged out user"}


@app.post("/signup")
@app.input(UserCreate.user_create_In, example=ex.UserEx.Signup_in)
@app.output(UserCreate.user_create_Out, 201, example=ex.UserEx.Signup_out)
def signup(json_data):
    """Signup"""
    from models import User

    try:
        user = User.create(**json_data)
        send_verification_mail.delay(user_id = user.id)        
    except ValueError as err:
        print(err)
        return {"message": err.args[0]}, 422
    return {"message": "Successfully signed up"}, 201

@app.post("/refresh")
@auth_required(refresh=True)
@app.output(TokenRefresh.token_refreshOut, 200, example=ex.TokenRefresh.t_Out)
def refresh():
    """refresh access token"""
    jti = UUID(get_jwt()["jti"])
    token = cast(Token, store.get_one(Token, jti))
    # import ipdb; ipdb.set_trace()
    token.refresh()
    response = jsonify(
        {
            "message": "Refreshed access token",
            "atoken": token.access_token,
            "atoken_expiry": token.atoken_expiry,
            "rtoken": token.refresh_token,
            "rtoken_expiry": token.rtoken_expiry,
            "rank": token.user.rank.value,
            "auth_type": "Bearer",
        }
    )
    return response
@app.get('/verify/<totp>')
def verify_user(totp: str):
    """This verifies a user one tie. the otp will be
    deleted after a particular period of time
    Args:
        totp (str)  the otp to check"""
    from models import store, User
    try:
        email, token, stamp = extract_cred(totp)
    except:
        abort(422, "Invalid reset link")    
    user: User = store.get_one("User", email = email)
    if user:
        curr = datetime.utcnow().timestamp()
        if user.secret[0] != token:
            abort(422, "Invalid reset token")
        if user.verified:
            abort(422, "Already verified")
        if  curr > float(stamp):
            abort(422, "Reset link has expired")
        user.verified = True
        val = user.secret.copy() if user.secret else ["", ""]
        val[0] = ""
        user.secret = val
        store.save()
        return jsonify({"verified": True})
    abort(404, "Not found")

@app.post('/request_reset')
@app.input(UserLogin.user_request_password_change)
def request_reset(data):
    """Requests for a reset  token"""
    from models import User, store
    user: User = store.get_one(User, email=data['email'])
    if not user:
        abort(404, "User not found")
    send_reset_password_mail.delay(user_id=user.id, tochange=data['tochange'])
    store.save()
    return jsonify("Reset link sent")

@app.post('/reset/<link>')
@app.input(UserLogin.user_reset_password)
def user_reset_password(link: str, data: str):
    """Allows the user to reset his password
    A user can not change his password after it has
    been set until after seven days
    Args:
        link (str) The password reset link"""
    from models import User, store
    try:
        email, token, stamp = extract_cred(link)
    except:
        abort(422, "Invalid reset link")
    if not('email' in data or 'password' in data):
        abort(400, "Email or password must be set for update")
    value = " ".join(data.keys())
    user: User = store.get_one("User", email = email)
    if user:
        curr = datetime.utcnow().timestamp()
        if user.secret[1] != token:
            abort(422, "Invalid reset token")
        if  curr > float(stamp):
            abort(422, "Reset link has expired")
        user.update(**data)
        val = user.secret.copy()
        val[1] = ""
        user.secret = val
        store.save()
        return jsonify(f"{value} changed")
    abort(400, "Error in changing password")


@app.get("/profile")
@app.output(UserSchema.get_Out, example=ex.User.get_out)
@auth_required()
def get_logged_in_user():
    """Gets the logged in user's profile"""
    user = get_current_user()
    return user


class UserView(MethodView):
    """User view"""
    @app.input(UserSchema.get_In, location='query', example=ex.User.get_in)
    @app.output(UserSchema.get_Out, example=ex.User.get_out)
    @Cacher.cache_profile
    def get(self, data):
        """get user details"""
        from models import store, User
        user: User = store.get_one(User, data['user_id'])
        if not user:
            abort(404, "User not found")
        return user

    @auth_required()
    @app.input(UserUpdate.user_update_In, example=ex.User.update_in)
    @app.output(UserSchema.get_Out, example=ex.User.update_out)
    def patch(self, json_data):
        """update user details"""
        from models import User
        user: User = get_current_user()
        Cacher.cli.delete(str(user.id))
        # type: ignore
        try:
            pref = json_data.pop('pref', [])
            user.extendpreference(pref)
            user.update(**json_data)
        except ValueError as err:
            return {"message": err.args[0]}, 422
        return user

    @auth_required()
    @app.output(UserDelete.user_delete_Out, example=ex.User.delete_out)
    def delete(self):
        """delete user"""
        from models import User

        user: User = get_current_user()  # type: ignore
        Cacher.cli.delete(str(user.id))
        delete_image(user)
        user.delete()
        return {"message": "user deleted"}
app.add_url_rule("/user", view_func=UserView.as_view("user"))  # type: ignore


@app.get('/searchuser')
@app.input(Search.searchIn, location='query')
def find_poem_or_author(data):
    """Looks for a particular poem"""
    from models import store
    data['mode'] = 'User'
    prev, pages, nex = store.search(**data)
    response = jsonify({
        'prev': prev,
        'next': nex,
        'pages':[{
                'id': user.id,
                'profile_picture': user.profile_picture,
                'pen_name': user.pen_name,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'rank': user.rank.value
            } for user in pages]
    })
    return response, 200

@app.get('/youmaylikethisuser')
def gen_random_users():
    """Generates random users for 
    """
    from models import store
    users = store.gen_random_reference_users()
    return jsonify([{
                'id': user.id,
                'profile_picture': user.profile_picture,
                'pen_name': user.pen_name,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'rank': user.rank.value
            } for user in users])

@app.post('/profile_picture')
@app.input(UpdateAvatar, location='files')
@auth_required()
def post_file(data):
    user = get_current_user()
    f = data['profile_picture']
    filename = secure_filename(f.filename)
    # f.save(os.path.join('.', filename)) # Save to a folder to be changed with imagekit SDK
    upload_image(user, f)
    return {'message': f'file {filename} saved.'}
