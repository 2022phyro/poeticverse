from typing import cast, List
from uuid import UUID
from apiflask import abort
from apiflask.views import MethodView
from flask import jsonify
from flask_jwt_extended import get_current_user
from api.auth import auth_required
from api.schemas.comments import (
    CommentCreate,
    CommentGet
)
from utils.notify import like, comment
from api.v1 import app_views as app

@app.get('/poem/comments')
@app.input(CommentGet.C_get_In, location='query')
def get_comments_for_poem(data):
    from models import store, Comment
    comments = store.get_many(Comment, poem_id=data['id'])
    response =  jsonify([{
        'id': cmm.id,
        'body': cmm.body,
        'like_count': len(cmm.likes),
        'comment_count': len(cmm.replies),
        'author_id': cmm.author_id,
        'author_pen_name': cmm.author.pen_name,
        'author_avatar': cmm.author.profile_picture,
        'author_rank': cmm.author.rank.value,
        'created_when': cmm.created_at,
        } for cmm in comments ])
    return response, 200

@app.get('/comment/comments')
@app.input(CommentGet.C_get_In, location='query')
def get_comments_for_comment(data):
    from models import store, Comment
    comments : List[Comment] = store.get_many(Comment, parent_id=data['id'])
    response =  jsonify([{
        'id': cmm.id,
        'body': cmm.body,
        'like_count': len(cmm.likes),
        'comment_count': len(cmm.replies),
        'author_id': cmm.author_id,
        'author_pen_name': cmm.author.pen_name,
        'author_avatar': cmm.author.profile_picture,
        'author_rank': cmm.author.rank.value,
        'created_when': cmm.created_at,
        } for cmm in comments ])
    return response, 200

@app.get('comment/like')
@auth_required()
@app.input(CommentGet.C_get_In, location='query')
def toggle_lime_for_comment(data):
    """Toggles the like for comments"""
    from models import store, Comment, User
    user: User = get_current_user()
    cmm: Comment = store.get_one(Comment, data['id'])
    x = False
    if not cmm:
        abort(404, "Poem not found")
    if cmm in user.fav_comments:
        user.fav_comments.remove(cmm)
    else:
        x = True
        user.fav_comments.append(cmm)
        msg = cmm.body[::10] + "..." if len(cmm.body) > 10 else cmm.body,
        like.delay('Clike', cmm.author_id, user.pen_name, user.id, user.profile_picture, msg, cmm.id)
    store.save()
    return jsonify({'liked': x})

@app.get('/comment/likes')
@app.input(CommentGet.C_get_In, location='query')
def get_comment_likes(data):
    """"Gets all users that likes a poem"""
    from models import store
    comment = store.get_one('Comment', data['poem_id'])
    if not comment:
        abort(404, "Comment not found")
    return jsonify([
        {
            'profile_photo': _.profile_picture,
            'pen_name': _.pen_name,
            'id': _.id,
            'rank': _.rank.value
        }
        for _ in comment.likes
    ])


class CommentView(MethodView):
    """Comment view"""
    
    @app.input(CommentGet.C_get_In, location='query')
    def get(self, data):
        """get the comment details"""
        from models import Comment, store
        cmm: Comment = store.get_one(Comment, data['id'])
        if not cmm:
            abort(404, "Not found the comment you requested may have\
                been deleted")
        response = jsonify({
            'id': cmm.id,
            'body': cmm.body,
            'like_count': len(cmm.likes),
            'comment_count': len(cmm.replies),
            'author_id': cmm.author_id,
            'author_pen_name': cmm.author.pen_name,
            'author_avatar': cmm.author.profile_picture,
            'author_rank': cmm.author.rank.value,
            'created_when': cmm.created_at,
        })
        return response, 200

    @auth_required()
    @app.input(CommentCreate.C_In)
    def patch(self, data):
        """Update comment details"""
        from models import User, Comment, store
        user: User = get_current_user()  # type: ignore
        cmm: Comment = store.get_one(Comment, data.pop('comment_id'))
        if not cmm:
            abort(404, "Not found, The poem you requested\
                may have been deleted ")
        if cmm.author != user:
            abort(403, "You're not the one who made this comment")
        cmm.update(**data)
        response = jsonify({
            'id': cmm.id,
            'body': cmm.body,
            'like_count': len(cmm.likes),
            'comment_count': len(cmm.replies),
            'author_id': cmm.author_id,
            'author_pen_name': cmm.author.pen_name,
            'author_avatar': cmm.author.profile_picture,
            'author_rank': cmm.author.rank.value,
            'created_when': cmm.created_at,
        })
        return response, 200
    
    @app.input(CommentGet.C_get_In)
    @auth_required()
    def delete(self, data):
        """Deletes a comment"""
        from models import User, Comment, store
        user: User = get_current_user()  # type: ignore
        cmm: Comment = store.get_one(Comment, data.pop('comment_id'))
        if not cmm:
            abort(404, "Not found, The poem you requested\
                may have been deleted ")
        if cmm.author != user:
            abort(403, "You're not the one who made this comment")
        cmm.delete()
        return {"message": "poem deleted"}
    
    @app.input(CommentCreate.C_In)
    @auth_required()
    def post(self, json_data):
        """Creates a new comment"""
        from models import User, Comment, store
        user: User = get_current_user()
        json_data['author_id'] = user.id
        x = y = msg = poem = None
        if (('poem_id' in json_data and 'parent_id' in json_data) or 
            not ('poem_id' in json_data or 'parent_id' in json_data)) :
            abort(403, 'Comment must reply either a \
                poem or another comment')
        if 'poem_id' in json_data.keys():
            poem = store.get_one("Poem", json_data['poem_id'])
            if not poem:
                abort(403, "Parent poem not found")
            x, y, msg = 'Pcomment', poem.id, poem.title,
        if 'parent_id' in json_data.keys():
            poem = store.get_one("Comment", json_data['parent_id'])
            if not poem:
                abort(403, "Parent comment not found")
            x, y, msg = 'Ccomment', poem.id, poem.body[::10] + '...' if len(poem.body) > 10 else poem.body
        if 'poem_id' in json_data.keys() or 'parent_id' in json_data.keys():
            cmm = Comment.create(**json_data)
            comment.delay(x, poem.author.id, user.pen_name, user.id, user.profile_picture, msg, y )
            # notify.commentpoem()
            
            response = jsonify({
                'id': cmm.id,
                'body': cmm.body,
                'like_count': len(cmm.likes),
                # 'comment_count': len(cmm.replies),
                'author_id': cmm.author_id,
                'author_pen_name': user.pen_name,
                'author_avatar': user.profile_picture,
                'author_rank': user.rank.value,
                'created_when': cmm.created_at,
            })
            return response, 201
        else:
            abort(403, "Comment must reply either a \
                poem or another comment")
app.add_url_rule("/comment", view_func=CommentView.as_view("comment"))  # type: ignore

@app.get('/notifications')
@auth_required()
def get_all_notifications():
    user = get_current_user()
    return jsonify([
        n.toDict()
        for n in user.notifications
    ])
