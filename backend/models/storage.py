"""This file encapsulates our ORM. It holds the methods to getting
information from out database and vice versa. It contains the storage class
This class holds all the methods and functions as well as objects ans sessions we
will use in communicating with the database"""
from datetime import datetime
from random import randint
from types import ModuleType
from typing import (
    TYPE_CHECKING,
    ClassVar,
    Dict,
    List,
    Literal,
    Optional,
    Tuple,
    Type,
    Union,
)
from uuid import UUID

from flask_sqlalchemy import SQLAlchemy
from flask_sqlalchemy.session import Session
from sqlalchemy import desc, or_, text
from sqlalchemy.sql.functions import func

if TYPE_CHECKING:
    """For resolving typing hints that may cause import errors"""
    from models.comment import Comment
    from models.conversation import Conversation
    from models.message import Message
    from models.notification import Notification
    from models.poem import Poem
    from models.tags import Tag
    from models.tokens import Token
    from models.user import User

    Model = Union[User, Poem, Comment, Conversation, Message, Token, Tag, Notification]
    MName = Literal[
        "user",
        "poem",
        "comment",
        "conversation",
        "message",
        "token",
        "tag",
        "notification",
    ]
    MType = Type[Model]
    Model_M = Union[MType, MName]
age = Literal["oldest", "newest"]
CURR = Literal["max", "min"]


class Storage:
    """This class encapsulates our relationship with the database. It holds our engine,
    our sessions and methods in which complicated queries are performed under the hood
    """

    __db: SQLAlchemy
    __session: Session
    __model_file: ClassVar[ModuleType]

    def __init__(self, db) -> None:
        """Initializes the engine, storage and SQLAlchemy instance in the class"""
        self.__engine = db.engine
        self.__session = db.session
        self.__db = db

    @classmethod
    def _get_models(cls) -> Dict[str, "Model"]:
        """This is an utility method. It gets the models
        associated with a particular string
        Returns:
            _type_: _description_
        """
        if not hasattr(cls, "__model_file"):
            cls.__model_file = __import__("models")
        User = cls.__model_file.User
        Poem = cls.__model_file.Poem
        Comment = cls.__model_file.Comment
        Conversation = cls.__model_file.Conversation
        Message = cls.__model_file.Message
        Token = cls.__model_file.Token
        Tag = cls.__model_file.Tag
        Notification = cls.__model_file.Notification

        return {
            "User": User,
            "Poem": Poem,
            "Comment": Comment,
            "Conversation": Conversation,
            "Message": Message,
            "Token": Token,
            "Tag": Tag,
            "Notification": Notification,
        }

    @classmethod
    def _get_model(cls, model: "Model_M") -> "Model":
        """Another utility function. It returns the model
        associated with a particular name
        Args:
            model (Model_M): a string or Model representing what we want
        Returns:
            Model: the model associated with the string
        """
        classes = cls._get_models()
        if isinstance(model, str):
            model = classes[model]
        return model

    @staticmethod
    def _get_id(id: Union[str, UUID]) -> UUID:
        """Gets the id from the string or the UUID"""
        if isinstance(id, str):
            id = UUID(id)
        return id

    def new(self, obj: "Model") -> None:
        """Adds an object to the session
        Args:
            obj (Model): the object instance to be added"""
        self.__session.add(obj)

    def save(self) -> None:
        """Saves or commits the current state of the
        database session
        Args:
            obj (Model): the object instance to be saved"""
        self.__session.commit()

    def delete(self, obj: "Model") -> None:
        """Deletes an object from the database
        Args:
            obj (Model): the object instance to be deleted
        """
        if obj:
            self.__session.delete(obj)
            self.__session.commit()

    def reload(self) -> None:
        """Recreates the database metadata
        It also adds necessary fulltext indexes for
        searching with MATCH ... AGAINST"""
        self.__db.create_all()
        self.__session.close()
        self.__session = self.__db._make_scoped_session(
            dict(expire_on_commit=False, bind=self.__engine)
        )
        i = text("ALTER TABLE poem ADD FULLTEXT(title); ")
        ii = text("ALTER TABLE user ADD FULLTEXT(first_name, last_name, pen_name); ")
        iii = text("ALTER TABLE user ADD FULLTEXT(first_name); ")
        iv = text("ALTER TABLE user ADD FULLTEXT(pen_name); ")
        v = text("ALTER TABLE user ADD FULLTEXT(last_name); ")
        vi = text("ALTER TABLE comment ADD FULLTEXT(body); ")
        for val in [i, ii, iii, iv, v, vi]:
            self.__session.execute(val)

    def close(self) -> None:
        """Closes the database connection"""
        self.__session.close()

    def sess(self):
        """Returns the session in use
        Returns:
            Session: a database session
        """
        return self.__session

    def get_one(self, cls: "Model_M", id: Optional[UUID] = None, **filters) -> "Model":
        """Gets a particular model instance based on a given criteria or
        by id
        Args:
            cls (Model_M): the class or model to search in
            id (Optional[UUID], optional): the model instance id if provided. Defaults to None.
        Returns:
            Model: the given model if found
        """
        cls = self._get_model(cls)
        if not cls:
            return None
        if filters:
            if id:
                id = self._get_id(id)
                return cls.query.filter_by(id=id, **filters).first()
            return cls.query.filter_by(**filters).first()
        if not id:
            return None
        id = self._get_id(id)

        return cls.query.filter_by(id=id, **filters).first()

    def get_many(self, cls: "Model_M", **filters) -> List["Model"]:
        """Gets many items from the database based on given
        filters. If no filter is given, then return all
        Returns:
            List[Model]: A list of the found values
        """
        cls = self._get_model(cls)
        if not cls:
            return []
        return cls.query.filter_by(**filters).all()

    def reset_all(self) -> None:
        """This deletes everything in the database and recreate it"""
        self.__db.drop_all()
        self.reload()

    def flush(self):
        """Flush changes to the database to make it seen"""
        self.__session.flush()

    def count(self, cls: Optional["Model_M"]) -> int:
        return self.__session.query(cls).count()

    def search(
        self, mode: "Model_M", search_string: str, curr, **filters
    ) -> List["Model_M"]:
        """This searches the database, returning queries that reach our
        search threshold
        Args:
            mode (model): The model to search
            search_string (str): The query string
            filters : Extra parameters
        """
        cls = self._get_model(mode)
        if not cls or search_string == "":
            return []
        query = self.__session.query(cls)
        if mode == "User":
            query = (
                self.__session.query(cls)
                .filter(
                    or_(
                        text(
                            "MATCH(pen_name, first_name, last_name) AGAINST (:query IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)"
                        ),
                        text(
                            "MATCH(pen_name) AGAINST (:query IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)"
                        ),
                        text(
                            "MATCH(first_name) AGAINST (:query IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)"
                        ),
                        text(
                            "MATCH(last_name) AGAINST (:query IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)"
                        ),
                        cls.pen_name.ilike(f"%{search_string}%"),
                        cls.first_name.ilike(f"%{search_string}%"),
                        cls.last_name.ilike(f"%{search_string}%"),
                    )
                )
                .params(query=search_string)
                .order_by(
                    desc(
                        text(
                            "MATCH(pen_name, first_name, last_name) AGAINST (:query IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)"
                        )
                    )
                )
            )
        elif mode == "Poem":
            query = (
                query.filter(
                    or_(
                        text("MATCH(title) AGAINST (:query IN NATURAL LANGUAGE MODE)"),
                        cls.title.ilike(f"%{search_string}%"),
                    )
                )
                .params(query=search_string)
                .order_by(
                    desc(
                        text(
                            "MATCH(title) AGAINST (:query IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION)"
                        )
                    )
                )
            )
        elif mode == "Comment":
            query = query.filter(cls.body.ilike(f"%{search_string}%"))
        query = query.filter_by(**filters).distinct()
        val = query.offset(curr * 10).limit(10).all()
        prev = curr - 1 if curr > 1 else None
        next = curr + 1 if len(val) >= 10 else None
        return prev, val, next

    def paginate(
        self,
        cls: "Model_M",
        curr: str = "max",
        query=None,
        page_size: int = 10,
        _age: "age" = "newest",
        **filters,
    ) -> Tuple[Optional[datetime], List["Model_M"], Optional[datetime]]:
        """Paginates a query, Utility tool for paginating a method results
        that will return a list eg the get_many. TO be used for personifying the
        user's feed
        Returns:
            Tuple: A tuple of the previous index, the next index and the list
        """
        cls = self._get_model(cls)
        if not cls:
            return None, None, None
        print(curr)
        prev = next = val = None
        if not query or (query and curr == "max"):
            query = self.__session.query(cls).filter_by(**filters)
            val = query.order_by(desc(cls.sn)).limit(page_size).all()
            if val:
                next = None
                prev = val[-1].sn
                return prev, val, next
        query = query.filter_by(**filters)
        if curr == "min":  # You want the first 10
            _age = "newest"
            curr = 0
        elif _age == "newest":
            query = query.filter(cls.sn > curr)
            val = query.order_by(cls.sn).limit(page_size).all()
        elif _age == "oldest":
            query = query.filter(cls.sn < curr)
            val = query.order_by(desc(cls.sn)).limit(page_size).all()
        if val:
            prev = val[0].sn
            next = val[-1].sn
        if next == prev:
            next = prev = None
        return prev, val, next

    def return_user_preferences(
        self,
        user: "Model",
        curr: int,
        page_size: int = 10,
        _age: "age" = "newest",
        **filters,
    ):
        """This returns all poems with tags that
        match a user preference"""
        to_search = user.preferences
        Po = self._get_model("Poem")
        Ta = self._get_model("Tag")
        poems = (
            self.__session.query(Po)
            .filter(Po.tags.any(Ta.name.in_(to_search)))
            .distinct()
        )
        return self.paginate(Po, curr, poems, page_size, _age, **filters)

    def gen_random_reference_users(self, user) -> List["Model_M"]:
        """generate users that our user may be interested in"""
        to_search = user.preferences
        Po = self._get_model("Poem")
        Ta = self._get_model("Tag")
        Us = self._get_model("User")

        # Import random from the Python standard library
        import random

        # Generate a random seed to ensure different results each time
        random_seed = random.randint(1, 1000000)

        # Subquery to count the number of poems for each user that match the preferences
        subquery = (
            self.__session.query(Us.id, func.count(Po.id).label("count"))
            .join(Po, Po.user_id == Us.id)
            .filter(Po.tags.any(Ta.name.in_(to_search)))
            .group_by(Us.id)
            .subquery()
        )

        # Main query to select users with at least 50% of their poems matching the preferences
        users = (
            self.__session.query(Us)
            .join(subquery, Us.id == subquery.c.id)
            .filter(
                subquery.c.count >= (func.count(Po.id) / 2), Us.id != user.id
            )  # At least 50% match
            .order_by(func.rand(random_seed))  # Random order
            .limit(4)  # Limit the result to four users
        )

        # Execute the query to get random users
        return users.all()

    def gen_random_reference_poems(self) -> List["Model_M"]:
        """Generate random poems that our user may like
        Return:
            (List[Model_M]):  A list of four poems"""
        Po = self._get_model("Poem")
        seed = randint(1, 100000)
        poems = (
            self.__session.query(Po).order_by(func.random(seed)).distinct().limit(10)
        )
        return poems.all()
