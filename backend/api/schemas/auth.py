"""data validation & serialization schemas"""
from apiflask import Schema, fields, validators as va
from apiflask.schemas import EmptySchema
from api.examples import exauth as ex
from models.rank import Rank
# from . import examples as ex
from . import validators as v



def FirstName(**attrs):
    return fields.String(
        validate=v.FirstName(),
        metadata={"description": "user's first name", "example": ex.FirstName},
        **attrs
    )


def LastName(**attrs):
    return fields.String(
        validate=v.LastName(),
        metadata={"description": "user's last name", "example": ex.LastName},
        **attrs
    )


def PenName(**attrs):
    return fields.String(
        metadata={"description": "user's pen name", "example": ex.PenName},
        **attrs
    )


def Email(**attrs):
    return fields.String(
        validate=v.Email(),
        metadata={"description": "user's email address", "example": ex.Email},
        **attrs
    )


def Login(**attrs):
    return fields.String(
        validate=v.Login(),
        metadata={
            "description": "user's username or email",
            "example": ex.Email,
        },
        **attrs
    )


def Password(**attrs):
    return fields.String(
        validate=v.Password(),
        metadata={"description": "user's password", "example": ex.Password},
        **attrs
    )


def AuthToken(**attrs):
    return fields.String(
        metadata={
            "description": "a JWT to authenticate as a user to the backend",
            "example": ex.AuthToken,
        },
        **attrs
    )

class UserRank(fields.Field):
    def _serialize(self, value, attr, obj, **kwargs):
        if isinstance(value, str):
            return value
        elif isinstance(value, Rank):
            return value.value

# def UserRank(**attrs):
#     if isinstance(attrs.get("example"), str):
#         # If "example" attribute is a string, return a string field
#         return fields.String(**attrs)
#     else:
#         # Otherwise, return an enum field
#         return fields.Enum(
#             Rank,
#             by_value=True,
#             metadata={"description": "the type of user", "example": ex.Rank},
#             **attrs
#         )


def Datetime(**attrs):
    return fields.DateTime(
        metadata={"description": "a datetime", "example": ex.DateTime}, **attrs
    )

def Bio(**attrs):
    return fields.String(
        metadata={'description': "users's bio", 'example': ex.Bio}, **attrs
    )
    
def P_P(**attrs):
    return fields.String(
        metadata={'descriptiom': "a user's photo url", "example": "https://picsum/1243dfsd"}, **attrs
    )

class User:
    """user data"""

    class get_In(EmptySchema):
        user_id = fields.UUID(
            metadata={"description": "user's id", "example": ex.Uuid}
        )

    class get_Out(Schema):
        id = fields.UUID(
            metadata={"description": "user's id", "example": ex.Uuid}
        )
        rank = UserRank(
            metadata={"description": "the type of user", "example": "Verse Apprentice"}
        )
        first_name = FirstName()
        last_name = LastName()
        pen_name = PenName()
        email = Email()
        bio = Bio()
        profile_picture = P_P()
        created_at = fields.String()


class UserCreate:
    """User signup data"""

    class user_create_In(Schema):
        first_name = FirstName(required=True)
        last_name = LastName(required=True)
        email = Email(required=True)
        password = Password(required=True)
        pen_name = PenName(allow_none=True)

    class user_create_Out(Schema):
        message = fields.String()

    class user_create_Error(Schema):
        message = fields.String()


class UserLogin:
    """User login data"""

    class user_login_In(Schema):
        login = Login(required=True)
        password = Password(required=True)

    class user_login_Out(Schema):
        message = fields.String()
        atoken = AuthToken()
        atoken_expiry = Datetime()
        rtoken = AuthToken()
        rtoken_expiry = Datetime()
        id = fields.UUID()
        pen_name = PenName()
        auth_type = fields.String()

    class user_reset_password(Schema):
        password = Password(required=False)
        email = Email(required=False)

    class user_request_password_change(Schema):
        email = Email()
        tochange = fields.String(validate=va.OneOf(["email", "password"]))    

    class NotFound(Schema):
        message = fields.String()

    class Unauthorized(Schema):
        message = fields.String()


class UserLogout:
    """User logout data"""

    class user_logout_In(EmptySchema):
        pass

    class user_logout_Out(Schema):
        message = fields.String()


class UserUpdate:
    """Update user data"""

    class user_update_In(Schema):
        first_name = FirstName(required=False)
        last_name = LastName(required=False)
        pen_name = PenName(required=False)
        bio = Bio(required=False)
        profile_picture = P_P(required=False)
        pref = fields.List(fields.String(), required=False)

    class user_update_Out(Schema):
        message = fields.String()
        user = fields.Nested(User.get_Out)

    class user_update_email(Schema):
        old_email = Email()
        new_email = Email()
        
    class user_update_password(Schema):
        old_password = Password()
        new_password = Password()

    class Error(Schema):
        message = fields.String()


class UserDelete:
    """Delete user data"""

    class In(EmptySchema):
        pass

    class user_delete_Out(Schema):
        id = fields.UUID(
            metadata={"description": "user's id", "example": ex.Uuid}
        )
        message = fields.String()


class TokenRefresh:
    """Refresh a json web token"""

    class token_refreshIn(EmptySchema):
        pass

    class token_refreshOut(UserLogin.user_login_Out):
        pass

class Search:
    class searchIn(Schema):
        search_string = fields.String(metadata={'description': "Any of the person's name, whether first or last"})
        curr = fields.Integer()  
