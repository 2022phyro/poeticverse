from typing import Any

from bcrypt import checkpw, gensalt, hashpw
from sqlalchemy.exc import IntegrityError

from .all_schemas import UserSchema
from .base import Base, db, store
from .rank import Rank
from .tokens import TokenMixin


class User(Base, db.Model, TokenMixin):
    schema = UserSchema()
    _attrs = Base._attrs + [
        "first_name",
        "last_name",
        "pen_name",
        "email",
        "phone_number",
        "bio",
        "profile_picture",
        "rank",
        "secret",
        "preferences",
        "poems",
        "password",
        "verified",
        "comments",
        "fav_poems",
        "fav_comments",
        "messages",
        "conversations",
        "group_admin",
        "tokens",
        "notifications",
    ]
    first_name = db.Column(db.String(128), nullable=False)
    verified = db.Column(db.Boolean, default=False)
    last_name = db.Column(db.String(128), nullable=False)
    pen_name = db.Column(db.String(60), nullable=False, unique=True)
    email = db.Column(db.String(60), nullable=False, unique=True)
    phone_number = db.Column(db.String(16))
    password = db.Column(db.String(60), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    rank = db.Column(db.Enum(Rank), default=Rank.A)
    preferences = db.Column(db.JSON, default=[])
    secret = db.Column(db.JSON, default=["", ""])
    profile_picture = db.Column(db.String(128), nullable=True)
    poems = db.relationship("Poem", backref="author", cascade="all, delete-orphan")
    fav_poems = db.relationship("Poem", secondary="poem_likes", back_populates="likes")
    fav_comments = db.relationship(
        "Comment", secondary="comment_likes", back_populates="likes"
    )
    comments = db.relationship(
        "Comment", backref="author", cascade="all, delete-orphan"
    )
    notifications = db.relationship(
        "Notification", backref="recipent", cascade="all, delete-orphan"
    )
    conversations = db.relationship(
        "Conversation", secondary="conversation_members", back_populates="members"
    )
    messages = db.relationship(
        "Message", backref="sender", cascade="all, delete-orphan"
    )
    group_admin = db.relationship(
        "Conversation", backref="admin", cascade="all, delete-orphan"
    )
    tokens = db.relationship(  # type: ignore
        "Token",
        backref=db.backref("user"),
        lazy=True,
        cascade="all, delete-orphan",
    )

    def verifyPassword(self, password):
        converted = self.password.encode()
        tocheck = password.encode()
        return checkpw(tocheck, converted)

    def update_password(self, password, save=True):
        encoded = hashpw(password.encode(), gensalt())
        self.password = encoded
        if save:
            store.save()

    def likepoem(self, poem):
        if poem in self.fav_poems:
            return False
        self.fav_poems.append(poem)
        store.save()
        return True

    def unlikepoem(self, poem):
        if poem not in self.fav_poems:
            return False
        self.fav_poems.remove(poem)
        store.save()
        return True

    def delete(self):
        for _ in self.conversations:
            _.delete()
        super().delete()

    def likecomment(self, comment):
        if comment in self.fav_comments:
            return False
        self.fav_comments.append(comment)
        store.save()
        return True

    def unlikecomment(self, comment):
        if comment not in self.fav_comments:
            return False
        self.fav_comments.remove(comment)
        store.save()
        return True

    def converse(self, user):
        from .conversation import Conversation

        for i in self.conversations:
            if i.name(self.id) == user.pen_name:
                return i
        conv = Conversation()
        conv.members.append(self)
        conv.members.append(user)
        conv.save()
        return conv

    def update(self, **kwargs):
        if "password" in kwargs:
            self.update_password(kwargs.pop("password"), False)
        try:
            super().update(**kwargs)
        except IntegrityError as e:
            if "pen_name" in e:
                raise ValueError("Pen name already exists")
            if "email" in e:
                raise ValueError("Email already exists")

    def addpreference(self, item):
        """Add a preference"""
        curr = self.preferences.copy() if self.preferences else []
        if item not in curr:
            curr.append(item)
            # print(curr)
            # self.preferences = curr
            _new = list(set(curr))
            self.preferences = curr
            store.save()

    def delpreference(self, item):
        """Add a preference"""
        curr = self.preferences.copy()
        if item in curr:
            curr.remove(item)
            # print("*", self.preferences)
            # _new = list(set(curr))
            self.preferences = curr
            store.save()

    def extendpreference(self, l_item: list):
        """Extends preferences by a list"""
        curr = self.preferences.copy()
        curr.extend(l_item)
        _new = list(set(curr))
        self.preferences = _new
        store.save()

    # @property
    # def email(self):
    #     return self.email

    # @email.setter
    # def email(self, value):
    #     """Attempting to enforce integrity for pen_name"""
    #     temp = self.email
    #     try:
    #         self.email = value
    #         store.save()
    #     except IntegrityError as e:
    #         self.email = temp
    #         self.integrity(e.args[0])

    # @property
    # def pen_name(self):
    #     return self.pen_name

    # @pen_name.setter
    # def pen_name(self, value):
    #     """Attempting to enforce integrity for pen_name"""
    #     temp = self.pen_name
    #     try:
    #         self.email = value
    #         store.save()
    #     except IntegrityError as e:
    #         self.pen_name = temp
    #         self.integrity(e.args[0])
