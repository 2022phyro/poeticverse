"""schema and fields examples for authentication and user"""

Rank = "Verse Apprentice"
FirstName = "John"
LastName = "Doe"
PenName = "johndoe"
Email = "johndoe@example.com"
Password = "Password123!"
PP = 'https://picsum/12345e'
Bio = """I am very determined to raising storms
        in the enclave of the abyss where something is
        lies beyond my reach"""
AuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
Uuid = "36b51f8a-c9fa-43f8-92fa-ff6927736c10"
DateTime = "2021-01-01 00:00:00"

class AuthEx:
    Login_in = {
        "login": PenName,
        "password": Password,
    }
    Login_out = {
        "message": "Successfully logged in",
        "atoken": AuthToken,
        "atoken_expiry": DateTime,
        "rtoken": AuthToken,
        "rtoken_expiry": DateTime,
        "pen_name": PenName,
        "auth_type": "Bearer",
    }
    Logout_out = {"message": "Logged out user"}

class UserEx:
    "User routes examples"
    Signup_in = {
        "first_name": FirstName,
        "last_name": LastName,
        "pen_name": PenName,
        "email": Email,
        "password": Password,
    }
    Signup_out = {"message": "Successfully signed up"}
    Signup_error = {"message": "email is taken"}
    
class TokenRefresh:
    """token refresh data example"""

    t_Out = {
        "message": "Refreshed access token",
        "atoken": AuthToken,
        "atoken_expiry": DateTime,
        "rtoken": AuthToken,
        "rtoken_expiry": DateTime,
        "pen_name": PenName,
        "auth_type": "Bearer",
    }
    
class User:
    get_in = {'user_id':Uuid}
    get_out = {
        "id": Uuid,
        "rank": Rank,
        "first_name": FirstName,
        "last_name": LastName,
        "pen_name": PenName,
        "email": Email,
        "bio": Bio,
        'profile_picture': PP
    }
    update_in = {
        "first_name": FirstName,
        "last_name": LastName,
        "email": Email,
        "password": Password,
        "pen_name": PenName,
        'bio': Bio,
        'profile_picture': PP
    }
    update_out = {
        "message": "Successfully updated",
        "user": get_out
    }
    update_error = {"message": "email is taken"}
    delete_out = {
        "message": "user deleted",
    }
