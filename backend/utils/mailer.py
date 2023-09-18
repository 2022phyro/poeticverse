from os import urandom
from hashlib import sha256
from datetime import datetime, timedelta
from celery import shared_task
import os
# from api import celery
BASE_URL = os.getenv('BASE_SECURITY_URL')
from models import store

def generate_token() -> str:
    """This generates a one time otp for us
    to use to verify the user
    Returns:
        str: the verification code
    """
    return urandom(16).hex()

def create_verify_link(user):
    expire = (datetime.utcnow() + timedelta(minutes=7)).timestamp()
    hexmail = user.email.encode().hex()
    token = generate_token()
    val = user.secret.copy() if user.secret else ["", ""]
    val[0] = token
    user.secret = val
    link = f"{hexmail}-{token}-{expire}"
    return (BASE_URL + f"verify/{link}") # TO change this to whatever we will host from

def create_reset_link(user) -> str:
    expire = (datetime.utcnow() + timedelta(minutes=7)).timestamp()
    hexmail = user.email.encode().hex()
    token = generate_token()
    val = user.secret.copy() if user.secret else ["", ""]
    print(val)
    val[1] = token
    user.secret = val
    link = f"{hexmail}-{token}-{expire}"
    return (BASE_URL + f"reset_password/{link}")

def extract_cred(token: str) -> tuple :
    """Extracts the necessary credentials from
    the token
    Args:
        token (str): The necessary token
    Returns:
        tuple: all the details
    """
    email, key, stamp = token.split("-")
    email = bytes.fromhex(email).decode()
    return email, key, stamp

@shared_task
def send_verification_mail(user_id):
    user = store.get_one("User", user_id)
    print(user)
    expire = (datetime.utcnow() + timedelta(minutes=7)).timestamp()
    hexmail = user.email.encode().hex()
    token = generate_token()
    val = user.secret.copy()
    val[0] = token
    user.secret = val
    link = f"{hexmail}-{token}-{expire}"
    link =  (BASE_URL + f"verify/{link}")
    store.save()
    message = f"""
Hello {user.pen_name}, Thank you for joining Poeticverse
To continue, please click on this button to
verify your account. Here is the link
{link}"""
    print(message)

@shared_task
def send_reset_password_mail(user_id, tochange="email"):
    """This sends a safe point to reset user's password"""
    user = store.get_one("User", user_id)
    expire = (datetime.utcnow() + timedelta(minutes=7)).timestamp()
    hexmail = user.email.encode().hex()
    token = generate_token()
    val = user.secret.copy()
    val[1] = token
    user.secret = val
    link = f"{hexmail}-{token}-{expire}"
    link = (BASE_URL + f"reset_password/{link}")
    store.save()
    message = f"""
Hello {user.pen_name} You requested for a reset link
Click on this link to continue to change your {tochange}
Here it is {link}"""
    print(message)
