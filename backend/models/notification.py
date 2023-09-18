"""This is a format for noticifications. I created a class for this but will
remove this in the future. The notifications are sent when someonle likes a post or
comment or when someone comments on it"""
from .all_schemas import NotificationSchema
from .base import Base, db


class Notification(Base, db.Model):
    schema = NotificationSchema()
    _attrs = Base._attrs + [
        "type",
        "user_id",
        "user",
        "user_avatar",
        "msg",
        "subject_id",
        "seen",
        "recipent_id",
    ]
    type = db.Column(db.String(128))
    user_id = db.Column(db.Uuid)
    user = db.Column(db.String(128))
    user_avatar = db.Column(db.String(128))
    subject_id = db.Column(db.Uuid)
    msg = db.Column(db.String(700))
    recipent_id = db.Column(db.Uuid, db.ForeignKey("user.id"))
    seen = db.Column(db.Boolean)
