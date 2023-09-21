from .all_schemas import ConversationSchema
from .base import Base, db

conversation_members = db.Table(
    "conversation_members",
    db.Column("user_id", db.Uuid, db.ForeignKey("user.id")),
    db.Column("conversation_id", db.Uuid, db.ForeignKey("conversation.id")),
)


class Conversation(Base, db.Model):
    schema = ConversationSchema()
    _attrs = Base._attrs + ["members", "messages", "admin_id", "group", "name"]
    members = db.relationship(
        "User", secondary="conversation_members", back_populates="conversations"
    )
    messages = db.relationship(
        "Message", backref="conversations", cascade="all, delete-orphan"
    )
    admin_id = db.Column(db.Uuid, db.ForeignKey("user.id"))
    group = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(256))

    def name(self, requester_id):
        if self.group:
            return self.name
        for mem in self.members:
            if mem.id != requester_id:
                return mem.pen_name
