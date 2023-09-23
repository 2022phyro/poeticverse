from typing import cast, List
from uuid import UUID
from apiflask import abort
from apiflask.views import MethodView
from flask import jsonify
from flask_jwt_extended import get_current_user, get_jwt
from api.auth import auth_required
from api.examples import expoem as ex
from api.v1 import app_views as app
from utils.notify import like
from api.schemas.poems import (
    PoemCreate,
    PoemGet,
    PoemFeed,
    Search
)
@app.get('/personify')
@auth_required()
@app.input(PoemFeed, location='query')
# @app.output()
def personify_feed(data):
    from models import store, Poem
    user = get_current_user()
    # prev, pages, nex = store.return_user_preferences(user, **data)
    # if not pages:
    prev, pages, nex = store.paginate(Poem, **data)
    response = jsonify({
        'prev': prev,
        'pages': [
                    {
                        'id': poem.id,
                        'title': poem.title,
                        'body': poem.body,
                        'like_count': len(poem.likes),
                        'comment_count': len(poem.comments),
                        'author_id': poem.author_id,
                        'author_pen_name': poem.author.pen_name,
                        'author_avatar': poem.author.profile_picture,
                        'author_rank': poem.author.rank.value,
                        'created_when': poem.created_at,
                        'tags': [_.name for _ in poem.tags],
                        'liked': poem in user.fav_poems
                    } for poem in pages
                ],
        'next': nex
        })
    return response, 200

@app.get('/poems')
@app.input(PoemFeed, location='query')
def get_all_poems(data):
    from models import store, Poem
    prev, pages, nex = store.paginate(Poem, **data)
    response = jsonify(
        {
        'prev': prev,
        'pages': [
                    {
                        'id': poem.id,
                        'title': poem.title,
                        'body': poem.body,
                        'like_count': len(poem.likes),
                        'comment_count': len(poem.comments),
                        'author_id': poem.author_id,
                        'author_pen_name': poem.author.pen_name,
                        'author_avatar': poem.author.profile_picture,
                        'author_rank': poem.author.rank.value,
                        'created_when': poem.created_at,
                        'tags': [_.name for _ in poem.tags],
                    } for poem in pages
                ],
        'next': nex
        })
    return response, 200

#TODO
@app.get('/searchpoem')
@app.input(Search.search_poem, location='query')
def find_poem(data):
    """Looks for a particular poem"""
    from models import store
    data['mode'] = 'Poem'
    prev, pages, nex = store.search(**data)
    response = jsonify(
        {
        'prev': prev,
        'pages': [
                    {
                        'id': poem.id,
                        'title': poem.title,
                        'body': poem.body,
                        'like_count': len(poem.likes),
                        'comment_count': len(poem.comments),
                        'author_id': poem.author_id,
                        'author_pen_name': poem.author.pen_name,
                        'author_avatar': poem.author.profile_picture,
                        'author_rank': poem.author.rank.value,
                        'created_when': poem.created_at,
                        'tags': [_.name for _ in poem.tags],
                    } for poem in pages
                ],
        'next': nex
        })
    return response, 200


@app.get('/tags')
def get_all_tags():
    """Gets all tags"""
    from models import store
    return sorted(
            [{"name": _.name,"id": _.id} for _ in store.get_many('Tag')],
            key=lambda x: x["name"]
            )


@app.get('poem/like')
@auth_required()
@app.input(PoemGet.poem_get_In, location='query')
def toggle_like(data):
    """"Toggles the like for poems"""
    from models import store, Poem, User
    user: User = get_current_user()
    poem: Poem = store.get_one(Poem, data['poem_id'])
    x = False
    if not poem:
        abort(404, "Poem not found")
    if poem in user.fav_poems:
        user.fav_poems.remove(poem)
    else:
        x = True
        user.extendpreference([_.name for _ in poem.tags])
        user.fav_poems.append(poem)
        like.delay('Plike',poem.author_id, user.pen_name, user.id, user.profile_picture, poem.title, poem.id)
    store.save()
    return jsonify({'liked': x})

@app.get('/poem/likes')
@app.input(PoemGet.poem_get_In, location='query')
def get_poem_likes(data):
    """"Gets all users that likes a poem"""
    from models import store
    poem = store.get_one('Poem', data['poem_id'])
    if not poem:
        abort(404, "Poem not found")
    return jsonify([
        {
            'profile_photo': _.profile_picture,
            'pen_name': _.pen_name,
            'id': _.id,
            'rank': _.rank.value
        }
        for _ in poem.likes
    ])


class PoemView(MethodView):
    """Poems view"""
    @app.input(PoemGet.poem_get_In, location='query')
    @auth_required()
    # @app.output(PoemCreate.poem_create_Out, 201, example=ex.PoemGet.Out)
    def get(self, data):
        """get poem details"""
        user = get_current_user()
        from models import Poem, store
        poem = store.get_one('Poem', data['poem_id'])
        if not poem:
            abort(404, "Not found. The poem you requested\
                may have been deleted")
        # print(poem)
        response = jsonify(
        {
            'id': poem.id,
            'title': poem.title,
            'body': poem.body,
            'like_count': len(poem.likes),
            'comment_count': len(poem.comments),
            'author_id': poem.author_id,
            'author_pen_name': poem.author.pen_name,
            'author_avatar': poem.author.profile_picture,
            'author_rank': poem.author.rank.value,
            'created_when': poem.created_at,
            'tags': [_.name for _ in poem.tags],
            'liked': poem in user.fav_poems

        })
        return response, 200

    @auth_required()
    @app.input(PoemCreate.Update, example=ex.PoemGet.Update)
    # @app.output(PoemCreate.Out, example=ex.PoemGet.Out)
    def patch(self, data):
        """update poem details"""
        from models import User, Poem, store
        user: User = get_current_user()  # type: ignore
        poem: Poem = store.get_one('Poem', data.pop('poem_id'))
        if not poem:
            abort(404, "Not found. The poem you requested\
                may have been deleted")
        if poem.author != user:
            abort(403, "You're not the owner of this poem")
        poem.update(**data)
        response = jsonify(
        {
            'id': poem.id,
            'title': poem.title,
            'body': poem.body,
            'like_count': len(poem.likes),
            'comment_count': len(poem.comments),
            'author_id': poem.author_id,
            'author_avatar': poem.author.profile_picture,
            'author_rank': poem.author.rank.value,
            'created_when': poem.created_at,
            'tags': [_.name for _ in poem.tags],
            'liked': poem in user.fav_poems
        })
        return response, 200

    @app.input(PoemGet.poem_get_In)
    @auth_required()
    def delete(self, data):
        """delete poem"""
        from models import User, Poem, store
        user: User = get_current_user()  # type: ignore
        poem: Poem = store.get_one('Poem', data.pop('poem_id'))
        if not poem:
            abort(404, "Not found. The poem you requested\
                may have been deleted")
        if poem.author != user:
            abort(403, "You're not the owner of this poem")
        poem.delete()  # type: ignore
        return {"message": "poem deleted"}

    @auth_required()
    @app.input(PoemCreate.poem_create_In, example=ex.PoemCreate.In)
    # @app.output(PoemCreate.Out, 201, example=ex.PoemGet.Out)
    def post(self, json_data):
        """Creates a new poem"""
        from models import Poem, Tag, store
        user = get_current_user()
        json_data['author_id'] = user.id
        tags = json_data.pop('tags', None)
        poem = Poem.create(**json_data)
        if tags:
            for tag in tags:
                x = store.get_one(Tag, name=tag) 
                if not x:
                    x = Tag(name=tag.lower())
                x.poems.append(poem)
                x.save()
        # send notifications to relevant people

        response = jsonify(
            {
                'id': poem.id,
                'title': poem.title,
                'body': poem.body,
                'like_count': len(poem.likes),
                'comment_count': len(poem.comments),
                'author_id': poem.author_id,
                'author_pen_name': user.pen_name,
                'author_avatar': user.profile_picture,
                'author_rank': user.rank.value,
                'created_when': poem.created_at,
                'tags': [_.name for _ in poem.tags],
                'liked': poem in user.fav_poems
            })
        return response, 201
app.add_url_rule("/poem", view_func=PoemView.as_view("poem"))  # type: ignore

@app.get('/explorepoems')
def gen_random_poems():
    from models import store
    poems = store.gen_random_reference_poems()
    return jsonify([
        {
            'id': poem.id,
            'title': poem.title,
            'author_rank': poem.author.rank.value,
            'author_pen_name': poem.author.pen_name            
        } for poem in poems
    ])

