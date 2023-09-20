from .all_schemas import MessageSchema
from .base import Base, db


class Message(Base, db.Model):
    schema = MessageSchema()
    _attrs = Base._attrs + ["sender_id", "conversation_id", "body"]
    sender_id = db.Column(db.Uuid, db.ForeignKey("user.id"), nullable=False)
    conversation_id = db.Column(
        db.Uuid, db.ForeignKey("conversation.id"), nullable=False
    )
    sn = db.Column(db.Integer, primary_key=True, autoincrement=True)
    body = db.Column(db.Text, nullable=False)

    def __init__(self, *args, **kwargs):
        body = kwargs.pop("body", "")
        encrypted = encrypt(key, body)
        kwargs["body"] = encrypted
        super().__init__(*args, **kwargs)
