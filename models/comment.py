"""This houses the comment class for comments repling poems
as well as other comments"""
from uuid import uuid4

from .all_schemas import CommentSchema
from .base import Base, db

# Define association table for likes relationship
comment_likes = db.Table(
    "comment_likes",
    db.Column("user_id", db.Uuid, db.ForeignKey("user.id")),
    db.Column("comment_id", db.Uuid, db.ForeignKey("comment.id")),
)


class Comment(Base, db.Model):
    schema = CommentSchema()
    _attrs = Base._attrs + ["author_id", "poem_id", "parent_id", "body"]
    id = db.Column(db.Uuid, default=uuid4, unique=True)
    author_id = db.Column(db.Uuid, db.ForeignKey("user.id"), nullable=False)
    poem_id = db.Column(db.Uuid, db.ForeignKey("poem.id"))
    parent_id = db.Column(db.Uuid, db.ForeignKey("comment.id"))
    body = db.Column(db.Text, nullable=False)
    likes = db.relationship(
        "User", secondary="comment_likes", back_populates="fav_comments"
    )
    parent = db.relationship("Comment", remote_side=[id], backref="replies")
