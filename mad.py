from models import store, User
from populate import fake_user

user: User = fake_user(password='asdfg')
# user.update_password('asdfg')
print(user.verifyPassword('asdfg'))
