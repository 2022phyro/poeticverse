import phonenumbers
import models
from models import User, Poem, Comment
from faker import Faker
from phonenumbers import country_code_for_region

store = models.store
fake = Faker()



def fake_phone_no():
    """Generates a fake phone number"""
    from random import choice, randint

    regions = tuple(phonenumbers.SUPPORTED_REGIONS)
    country_code = country_code_for_region(choice(regions))
    phone_no = "+{}{}".format(country_code, randint(100000000, 999999999))
    return phone_no

def fake_user(store = store, **attrs):
    """Creates a fake student and saves it to the database"""
    attrs.setdefault("first_name", fake.first_name())
    attrs.setdefault("last_name", fake.last_name())
    attrs.setdefault("pen_name", fake.user_name())
    attrs.setdefault("email", fake.email())
    attrs.setdefault("bio", fake.text(300))
    attrs.setdefault("profile_picture", fake.url())
    attrs.setdefault("password", fake.password())
    attrs.setdefault("phone_number", fake_phone_no())
    # attrs.setdefault("photo_url")
    user = User(**attrs)
    user.save()
    return user

def fake_poem(user, **attrs):
    attrs.setdefault('author_id', user)
    attrs.setdefault('title', fake.text(10))
    attrs.setdefault('body', fake.text(300))
    attrs.setdefault('isAI', False)
    poem = Poem(**attrs)
    poem.save()
    return poem

def fake_comment(user, **attrs):
    attrs.setdefault('author_id', user)
    attrs.setdefault('body', fake.text(300))
    comm = Comment(**attrs)
    comm.save()
    return comm

if __name__ == '__main__':
    store.reset_all()
    # for i in range(3):
    #     user = fake_user()
    #     print(f"Creating user {user.pen_name}")
    #     for i in range(4):
    #         poem = fake_poem(user.id)
    #         print(f"\tCreating poem {poem.title} for {user.pen_name}")
    #         for i in range(2):
    #             comment = fake_comment(user.id, poem_id=poem.id)
    #             print(f"\t\tCreating comment {comment.body[:6]} for {poem.title} by {user.pen_name}")
    store.save()
    print("[+]Done")
