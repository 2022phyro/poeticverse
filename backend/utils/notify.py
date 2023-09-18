from celery import shared_task
from models import store, Notification

@shared_task
def cleanup_notifications():
    nots = store.get_many('Notification', seen=True)
    for n in nots:
        store.delete(n)
        
    store.save()
    print("Sucessfully deleted all unread notifications")

@shared_task
def cleanup_unverified_users():
    users = store.get_many('User', verified=False)
    for u in users:
        store.delete(u)
    store.save()
    print("Successfully deleted all unverified users")
    
x = 0
@shared_task
def test():
    global x
    """Test celery beats"""
    print(f"Testing success {x}")
    x += 1
@shared_task
def like(_type, recipent_id, user, user_id, user_avatar, msg, poem_id):
    user = store.get_one(recipent_id)
    if not user: return
    if user.id == user_id: return
    for n in user.notifications:
        if n.user_id == user_id: return
    data = {
        'type': _type, 
        'user': user,
        'user_id': user_id,
        'msg': msg,
        'subject_id': poem_id,
        'recipent_id': recipent_id
    }
    if user_avatar:
        data['user_avatar'] = user_avatar
    notified = Notification(**data)
    notified.save()
    print(f"Successfully notified user {user_id}  with  notification {notified.id}")

# @shared_task
def comment(_type, recipent_id, user, user_id, user_avatar, msg, cmm_id):
    user = store.get_one(recipent_id)
    if not user: return
    if user.id == user_id: return
    data = {
        'type': _type, 
        'user': user,
        'user_id': user_id,
        'msg': msg,
        'subject_id': cmm_id,
        'recipent_id': recipent_id
    }
    if user_avatar:
        data['user_avatar'] = user_avatar
    notified = Notification(**data)
    notified.save()
    print(f"Successfully notified user {user_id}  with  notification {notified.id}")
