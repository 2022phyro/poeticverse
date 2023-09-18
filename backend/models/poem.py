from typing import Any

from apiflask import fields, validators
from bcrypt import checkpw, gensalt, hashpw

from .all_schemas import PoemSchema
from .base import Base, db, store
from .tags import Tag

poem_likes = db.Table(
    "poem_likes",
    db.Column("user_id", db.Uuid, db.ForeignKey("user.id")),
    db.Column("poem_id", db.Uuid, db.ForeignKey("poem.id")),
)


class Poem(Base, db.Model):
    schema = PoemSchema()
    _attrs = Base._attrs + ["author_id", "title", "body", "comments", "likes", "isAI"]
    author_id = db.Column(db.Uuid, db.ForeignKey("user.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    comments = db.relationship("Comment", backref="poem", cascade="all, delete-orphan")
    isAI = db.Column(db.Boolean, default=False)
    likes = db.relationship("User", secondary="poem_likes", back_populates="fav_poems")
    tags = db.relationship("Tag", secondary="poem_tags", back_populates="poems")

    def addTag(self, tag: str):
        _tag = store.get_one("Tag", name=tag)
        if not _tag:
            _tag = Tag.create(name=tag)
        if tag not in self.tags:
            self.tags.append(_tag)
            store.save()

    def removeTag(self, tag):
        if tag in [x.name for x in self.tags]:
            if isinstance(tag, str):
                tag = store.get_one("Tag", name=tag)
            self.tags.remove(tag)
            store.save()
