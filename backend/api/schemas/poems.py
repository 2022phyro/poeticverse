from apiflask import Schema, fields
from apiflask.schemas import EmptySchema
from models.rank import Rank
from api.examples import expoem as ex

def Body(**attrs):
    return fields.String(
        metadata={'description': "poem's body", 'example': ex.Body},
        multiline=True,
        **attrs
    )

def Title(**attrs):
    return fields.String(
        metadata={'description': "poem's title", 'example': ex.Title},
        **attrs
    )
class PoemCreate:
    class poem_create_In(Schema):
        title = Title()
        body = Body()
        tags = fields.List(fields.String())

    class Update(Schema):
        poem_id = fields.UUID()
        title = Title()
        body = Body()

    class poem_create_Out(Schema):
        id = fields.UUID()
        title = Title()
        body = Body()
        like_count = fields.Integer()
        comment_count = fields.Integer()
        author_id = fields.UUID()
        author_pen_name = fields.String()
        author_avatar = fields.URL()
        author_rank = fields.String()
        created_when = fields.DateTime()
        tags = fields.List(fields.String())


class PoemGet:
    class poem_get_In(Schema):
        poem_id = fields.UUID()
    class poem_get_Out(PoemCreate.poem_create_Out):
        pass

class PoemDelete:
    class poem_delete_Out(Schema):
        message = fields.String(metadata={'description': 'poem deleted'})
class PoemAll(Schema):
    fields.List(fields.Nested(PoemCreate.poem_create_In))

class Search:
    class search_poem(Schema):
        search_string = fields.String(metadata = {'description': 'the search string', 'example': 'Serenade'})
        curr = fields.Integer(metadata = {'description': 'The page to search from'})
        author_id = fields.UUID(required=False, metadata={'description': "The author's id not required"})
class PoemFeed(Schema):
    _age = fields.String(metadata = {'description': 'direction', 'example': 'newest'})
    curr = fields.Integer()
    page_size = fields.Integer()
    author_id = fields.UUID(required=False, metadata={'description': "The author's id not required"})
    
