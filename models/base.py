from datetime import datetime
from uuid import uuid4

from api import app, db
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError

from models.storage import Storage

from .all_schemas import BaseModelSchema

with app.app_context():
    store = Storage(db=db)


class Base:
    """Base class"""
    id = db.Column(db.Uuid, default=uuid4, unique=True)
    sn = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    _attrs = ["id", "created_at", "updated_at", "sn"]

    schema = BaseModelSchema()

    def __init__(self, *args, **kwargs) -> None:
        """Initializes a model. This class holds columns that are
        found across all models as well as functions associated with it
        Raises:
            ValidationError: when the input data doesn't pass our validators
            IntegrityError: When one tries to input a value that is marked as
            unique and it exists in the database
        """
        try:
            attrs = self.schema.load(kwargs)  # type: ignore
        except ValidationError as e:
            raise e
        try:
            super().__init__(*args, **attrs)
        except IntegrityError as e:
            self.integrity(e.args[0])

    def __str__(self) -> str:
        return f"{type(self).__name__} - {self.id.hex}"

    def __repr__(self) -> str:
        return self.__str__

    def toDict(self):
        """Generates a dict representation of the model
        This does not include relationships
        Returns:
            dict: the model
        """
        _dict = {attr: getattr(self, attr) for attr in self._attrs}
        return self.schema.dump(_dict)

    @staticmethod
    def integrity(str):
        """Utility function to raise a ValueError when some tries to enter a duplicate value
        for a unique column"""
        args = str.strip("'").split("'")
        column = args[-1].split(".")[-1].title().replace("_", " ")
        value = args[1]
        msg = f"{column} {value} already exists. Please choose another"
        raise ValueError(msg)

    def save(self):
        """Saves a model to the database"""
        try:
            store.new(self)
            store.save()
        except IntegrityError as e:
            self.integrity(e.args[0])

    def delete(self):
        """deletes a model from the database"""
        store.delete(self)

    @property
    def get_id(self):
        """Returns the id of the user in hex form"""
        return self.id.hex

    def update(self, **kwargs):
        """Updates the model instance with a dict"""
        kwargs.pop("sn", None)
        kwargs.pop("id", None)
        for k, v in kwargs.items():
            if hasattr(self, k):
                setattr(self, k, v)
        self.save()
        return self

    @classmethod
    def create(cls, commit=True, **kwargs):
        """Creates model"""
        instance = cls(**kwargs)
        # if commit:
        instance.save()  # pragma: no cover
        return instance

    # @property
    # def id(self):
    #     return self.id

    # @id.setter
    # def id(self, value):
    #     """Strictly enforcing readonly behavior for id"""
    #     pass

    # @property
    # def sn(self):
    #     return self.sn

    # @sn.setter
    # def sn(self, value):
    #     """Strictly enforcing readonly behavior for sn"""
    #     pass
