"""This module holds all our database schema. The classes here represent the 
tables are are most useful for validation purposes
eg : UserSchema Represents the Schema for the user class"""
from datetime import datetime
from typing import Any

from apiflask import Schema, fields, validators
from apiflask.validators import OneOf
from bcrypt import gensalt, hashpw

from .rank import Rank


# Define custom field classes
class DateTime(fields.DateTime):
    def _deserialize(self, value, attr, data, **kwargs):
        if isinstance(value, datetime):
            return value
        return super()._deserialize(value, attr, data, **kwargs)


class Password(fields.String):
    def __init__(self, **kwargs):
        super().__init__(load_only=True, validate=[validators.Length(min=5)])

    def _deserialize(self, value, attr, data, **kwargs) -> Any:
        password = super()._deserialize(value, attr, data, **kwargs)
        return hashpw(password.encode(), gensalt())


# Define base schema class
class BaseModelSchema(Schema):
    sn = fields.Integer(load_only=True)
    id = fields.UUID(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)


# Adding Our custom field classes
fields.DateTime = DateTime
fields.Password = Password


class UserSchema(BaseModelSchema):
    first_name = fields.String(validate=validators.Length(max=128))
    last_name = fields.String(validate=validators.Length(max=128))
    pen_name = fields.String(validate=validators.Length(max=100))
    email = fields.Email()
    phone_number = fields.String(validate=validators.Length(min=10, max=15))
    password = fields.Password()
    bio = fields.String()
    profile_picture = fields.URL()
    rank = fields.Enum(Rank, by_value=True)
    verified = fields.Boolean()
    preferences = fields.List(fields.String())
    secret = fields.List(fields.String(), load_only=True)
    poems = fields.List(fields.Nested("PoemSchema"), load_only=True)
    comment = fields.List(fields.Nested("CommentSchema"), load_only=True)
    fav_comments = fields.List(fields.Nested("CommentSchema"), load_only=True)
    fav_poems = fields.List(fields.Nested("PoemSchema"), load_only=True)
    messages = fields.List(fields.Nested("MessageSchema"), load_only=True)
    conversations = fields.List(fields.Nested("ConversationSchema"), load_only=True)
    group_admin = fields.List(fields.Nested("ConversationSchema"), load_only=True)
    tokens = fields.List(fields.Nested("TokenSchema"), load_only=True)
    notifications = fields.List(fields.Nested("NotificationSchema"), load_only=True)


class CommentSchema(BaseModelSchema):
    author_id = fields.UUID()
    poem_id = fields.UUID()
    parent_id = fields.UUID()
    body = fields.String()
    likes = fields.List(fields.Nested("UserSchema"), load_only=True)


class PoemSchema(BaseModelSchema):
    author_id = fields.UUID()
    title = fields.String()
    body = fields.String()
    comments = fields.List(fields.Nested("CommentSchema"), load_only=True)
    likes = fields.List(fields.Nested("UserSchema"), load_only=True)
    isAI = fields.Boolean()
    tags = fields.List(fields.Nested("TagSchema"), load_only=True)


class MessageSchema(BaseModelSchema):
    sender_id = fields.UUID()
    conversation_id = fields.UUID()
    body = fields.String()


class ConversationSchema(BaseModelSchema):
    members = fields.List(fields.Nested("UserSchema"), load_only=True)
    messages = fields.List(fields.Nested("MessageSchema"), load_only=True)
    admin_id = fields.UUID()
    group = fields.Boolean()
    name = fields.String()


class TokenSchema(BaseModelSchema):
    access_token = fields.String()
    refresh_token = fields.String()
    revoked = fields.Boolean()
    active = fields.Boolean()
    user_id = fields.UUID()


class TagSchema(Schema):
    id = fields.UUID(load_only=True)
    created_at = fields.DateTime(load_only=True)
    updated_at = fields.DateTime(load_only=True)
    name = fields.String()
    poems = fields.List(fields.Nested("PoemSchema"), load_only=True)


class NotificationSchema(BaseModelSchema):
    type = fields.String(validate=OneOf(["Clike", "Plike", "Pcomment", "Ccomment"]))
    user_id = fields.UUID()
    user = fields.String()
    user_avatar = fields.URL(required=False)
    msg = fields.String()
    subject_id = fields.UUID()
    recipent_id = fields.UUID(load_only=True)
    seen = fields.Boolean()
