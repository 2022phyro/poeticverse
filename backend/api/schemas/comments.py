from apiflask import Schema, fields
from apiflask.schemas import EmptySchema
from models.rank import Rank

def Body(**attrs):
    return fields.String(
        metadata={'description': "comments's body", 
                  'example': """I really found it invigorating and 
                  fun, thanks for sharing"""},
        multiline=True,
        **attrs
    )

class CommentCreate:
    class C_In(Schema):
        body = Body()
        poem_id = fields.UUID(required=False)
        parent_id = fields.UUID(required=False)

    class C_Update(Schema):
        id = fields.UUID()
        body = Body()

    class C_Out(Schema):
        id = fields.UUID()
        body = Body()
        like_count = fields.Integer()
        comment_count = fields.Integer()
        author_id = fields.UUID()
        author_pen_name = fields.String()
        author_avatar = fields.URL()
        author_rank = fields.Enum(Rank)
        created_when = fields.DateTime()
        tags = fields.List(fields.String())


class CommentGet:
    class C_get_In(Schema):
        id = fields.UUID()
        
    class C_get_Out(Schema):
        message = fields.String(metadata={'description': 'comment deleted'})
