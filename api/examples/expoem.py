"""schema and fields examples"""

Rank = "Verse Apprentice"
FirstName = "John"
LastName = "Doe"
PenName = "johndoe"
Email = "johndoe@example.com"
Password = "Password123!"
PP = 'https://picsum/12345e'
Bio = """I am very determined to raising storms
        in the enclave of the abyss where something is
        lies beyond my reach"""
AuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
Uuid = "36b51f8a-c9fa-43f8-92fa-ff6927736c10"
DateTime = "2021-01-01 00:00:00"
Title = "Jabberwocky on a Cross"
Body = "Twas brilig and the slithy coves\n\
Did gyre and jimble in the wabe\n\
All mimsy were the borogroves\n\
And the mome_rats did outgabe"
Likes = 57
Comments = 46
Tags = ['humor', 'belloc', 'acrostic']
class PoemGet:
    In = {
        'poem_id': Uuid
    }
    Out = {
        'id': Uuid,
        'title': Title,
        'body': Body,
        'like_count': Likes,
        'comment_count': Comments,
        'author_id': Uuid,
        'author_avatar': PP,
        'author_rank': Rank,
        'created_when': DateTime,
        'tags': Tags
    }
    Update = {
        'poem_id': Uuid,
        'title': Title,
        'body': Body
    }
class PoemCreate:
    In = {
        'title': Title,
        'body': Body
    }
