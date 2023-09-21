from .all_schemas import TagSchema
from .base import Base, db

poem_tags = db.Table(
    "poem_tags",
    db.Column("tag_id", db.Uuid, db.ForeignKey("tag.id")),
    db.Column("poem_id", db.Uuid, db.ForeignKey("poem.id")),
)


class Tag(Base, db.Model):
    """Tag class for genres of poems"""

    schema = TagSchema()
    _attrs = Base._attrs + ["name"]
    name = db.Column(db.String(200), nullable=False)
    poems = db.relationship("Poem", secondary="poem_tags", back_populates="tags")
