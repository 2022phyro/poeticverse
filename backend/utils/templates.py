import requests
from requests import Response
import os

API_KEY = os.environ['MAIL_GUN_KEY']
POST_URL = os.environ['MAIL_GUN_POST_URL']
MY_USER = os.environ['MY_USER']
MAIL_TO = os.environ['MAIL_TO']
def send_email(user_email, title, message_html, message_text):
    val: Response = requests.post(POST_URL,
		auth=("api", API_KEY),
		data={"from": f"{MY_USER} <{MAIL_TO}>",
			"to": [user_email],
			"subject": title,
			"html": message_html,
            'text': message_text}
    )
    if val.status_code == 200:
        print("Successfully sent email")
    return val.status_code


def welcome_email_msg(reset_link, validity, pen_name):
    """Email templates to welcome the user"""
    html = f"""<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet'>
    <title>Greetings from the Bards</title>
    <style>
        main {{
            width: 100%;
            display: flex;
            justify-content: center;
        }}
        .main {{
            font-family: 'Roboto', sans-serif;
            font-weight: 400;
            text-align: left;
            padding: 20px 40px;
            max-width: 700px;
            color: #000;
        }}
        .button {{
            margin-right: 0;
        }}
        a, a:hover, a:focus {{
            text-decoration: none;
        }}
        .btn:active {{
            background-color: grey;
        }}
        .btn {{
            color:#FFF;
            cursor:pointer;
            padding: 15px 20px;
            background-color:#0C0F15;
            margin: auto;
        }}
        .verify, .pen {{
            font-weight: 600;
            color:#0C0F15;

        }}
    </style>
</head>
<body>
    <main>
        <div class='main'>
        Dear <span class='pen'>{pen_name},</span>
        <p>In the world of literary chaos, we warmly welcome you to Poetic Verse, 
            where words weave melodies and stories take flight like birds on the wind.
        </p>
        <p>
            With quill in hand, you've embarked on a poetic journey. To set your verses aglow, 
            we invite you to breathe life into your account. The first step is to harmonize your
            chakra by verifying your email with us.
        </p>
        <a href='{reset_link}'>
            <table class='button'>
                <tr><td class='btn' >
                    Verify your account
                    </td>
                </tr>
            </table>
        </a>
        <p>
            This link shall remain enchanted for {validity} minutes. Afterwards you may request a new key by 
            visiting your settings and invoking the <span class='verify'>Verify your account</span> incantation.            
        </p>
        <p>
        With quills at the ready and parchment poised, we await your poetic 
        revelations. Welcome to the world of Poetic Verse, where every word 
        is a verse, and every soul, a poet.
        </p>
        <p class='cls1'>Yours in poetic resonance,</p>
        <p>The Poetic Verse Team</p>
        </div>
        </main>
    </body>
</html>
"""
    text = f"""Dear {pen_name},

In the world of literary chaos, we warmly welcome you to Poetic Verse, where words weave melodies and stories take flight like birds on the wind.

With quill in hand, you've embarked on a poetic journey. To set your verses aglow, we invite you to breathe life into your account. The first step is to harmonize your chakra by verifying your email with us.
Verify your account with this {reset_link}

This link shall remain enchanted for {validity} minutes. Afterwards you may request a new key by visiting your settings and invoking the Verify your account incantation.
With quills at the ready and parchment poised, we await your poetic revelations. Welcome to the world of Poetic Verse, where every word is a verse, and every soul, a poet.

Yours in poetic resonance,

The Poetic Verse Team
"""
    return html, text

def reset_email_msg(reset_link, validity, pen_name, toChange):
    html = f"""<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,700' rel='stylesheet'>
    <title>Greetings from the Bards</title>
    <style>
        main {{
            width: 100%;
            display: flex;
            justify-content: center;
        }}
        .main {{
            font-family: 'Roboto', sans-serif;
            font-weight: 400;
            text-align: left;
            padding: 20px 40px;
            max-width: 700px;
            color: #000;
        }}
        .button {{
            margin-right: 0;
        }}
        a, a:hover, a:focus {{
            text-decoration: none;
        }}
        .btn:active {{
            background-color: grey;
        }}
        .btn {{
            color:#FFF;
            cursor:pointer;
            padding: 15px 20px;
            background-color:#0C0F15;
            margin: auto;
        }}
        .verify, .pen {{
            font-weight: 600;
            color:#0C0F15;

        }}
    </style>
</head>
<body>
    <main>
        <div class='main'>
        Dear <span class='pen'>{pen_name},</span>
        <p>In the ever-evolving tapestry of your poetic journey, we understand 
            that sometimes, even the most eloquent verses need a gentle rewrite.
             Fear not, for the quill of renewal is within your grasp.
        </p>
        <p>
            To reset your details and craft a fresh chapter,
            please follow the sacred link below:
        </p>
        <a href='{reset_link}'>
            <table class='button'>
                <tr><td class='btn' >
                    Safely reset your {toChange.lower()}
                    </td>
                </tr>
            </table>
        </a>
        <p>This link shall remain enchanted for {validity} hours. Afterward,
            should your poetic spirit yearn for another refresh, simply
             visit our settinggs page and invoke the 'Change {toChange.title()}'.
        </p>
        <p>
            With each reset, you unfold a new stanza in your poetic
 tale, where every word has the potential to spark a masterpiece.

May your verses flow freely and your poetic spirit soar!
        </p>
        <p class='cls1'>Yours in poetic resonance,</p>
        <p>The Poetic Verse Team</p>
        </div>
        </main>
    </body>
</html>
"""
    text = f"""Dear {pen_name},

In the ever-evolving tapestry of your poetic journey, we understand that sometimes, even the most eloquent verses need a gentle rewrite. Fear not, for the quill of renewal is within your grasp.

To reset your details and craft a fresh chapter, please follow the sacred link below:
Safely reset your {toChange.lower()}

This link shall remain enchanted for {validity} hours. Afterward, should your poetic spirit yearn for another refresh, simply visit our settinggs page and invoke the 'Change {toChange.title()}'.

With each reset, you unfold a new stanza in your poetic tale, where every word has the potential to spark a masterpiece. May your verses flow freely and your poetic spirit soar!

Yours in poetic resonance,

The Poetic Verse Team"""
    return html, text
