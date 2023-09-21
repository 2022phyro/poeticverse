from celery import shared_task
from models import store, Notification, User
from datetime import datetime, timedelta

# @shared_task
def cleanup_notifications():
    """Cleans up notifications after every seven days"""
    nots = store.get_many('Notification')
    for n in nots:
        store.delete(n)
    #Purges all revoked or expired tokens
    for u in store.get_many('User'):
        u.purge_tokens()        
    store.save()

# @shared_task
def cleanup_unverified_users():
    """Cleans up unverified users"""
    seven_days_ago = datetime.now() - timedelta(days=7)
    users = store.sess.query(User).filter(
        User.verified==False,
        User.created_at <= seven_days_ago     
    ).all()
    for u in users:
        store.delete(u)
    store.save()
    print("Successfully deleted all unverified users")
    
x = 0
# @shared_task
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

@shared_task
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
