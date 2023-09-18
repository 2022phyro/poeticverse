from models import Tag
from models import base, store, User, Poem
from populate import fake_user, fake_poem, fake_comment
from random import choice, choices
from datetime import datetime
poetry_genres = [
    "Acrostic",
    "Ballad",
    "Blank Verse",
    "Cinquain",
    "Confessional",
    "Death Poetry",
    "Despair",
    "Didactic",
    "Elegy",
    "Ekphrastic",
    "Epic",
    "Epigram",
    "Faith",
    "Free Verse",
    "Ghazal",
    "Haiku",
    "History",
    "Horror",
    "Humor",
    "Indigenous poetry",
    "Limerick",
    "Love",
    "Lyric",
    "Metaphysics",
    "Narrative",
    "Nature",
    "Nursery Rhymes",
    "Ode",
    "Pastoral",
    "Prose",
    "Romantic",
    "Satire",
    "Sestina",
    "Social Commentary",
    "Sonnet",
    "Spoken Word",
    "Surrealism",
    "Symbolism",
    "Tanka",
    "Tragedy",
    "War",
    "Western",
    "Women",
    "World",
    "Zen",
]

for name in poetry_genres:
    print(f"Created tag - {name} - {Tag.create(name=name.lower()).id}")
store.save()
# user: User = store.get_one(User, email='adam@dan.com')
user = fake_user(email="adam@dan.com", password='asdfg')
user.addpreference('humor')
user.addpreference('zen')
user.addpreference('women')
user.addpreference('war')
poems = [
    {
        "author_id": user.id,
        "title": "The Silent Night",
        "body": "The silent night, a moon so bright,\nStars twinkle in the sky.\nA peaceful scene, so calm and clean,\nAs nighttime passes by."
    },
    {
        "author_id": user.id,
        "title": "Dancing in the Rain",
        "body": "Dancing in the rain, I feel no pain,\nAs drops fall from the sky.\nA joyful sound, on the wet ground,\nWith every step, I fly."
    },
    {
        "author_id": user.id,
        "title": "Winter's Embrace",
        "body": "Winter's embrace, a frosty lace,\nOn trees and fields it lies.\nA cold delight, a snowy white,\nBeneath the clear blue skies."
    },
    {
        "author_id": user.id,
        "title": "Sunset Serenade",
        "body": "Sunset serenade, colors cascade,\nThe day bids us goodbye.\nA fiery hue, in the evening's view,\nAs twilight paints the sky."
    },
    {
        "author_id": user.id,
        "title": "Whispers in the Woods",
        "body": "Whispers in the woods, where mystery broods,\nAmong the ancient trees.\nA hidden lore, as the leaves gently soar,\nIn the forest's gentle breeze."
    },
    {
        "author_id": user.id,
        "title": "Ocean's Symphony",
        "body": "Ocean's symphony, a boundless sea,\nWaves crash upon the shore.\nA timeless dance, in a salty expanse,\nForever it will roar."
    },
    {
        "author_id": user.id,
        "title": "Fields of Dreams",
        "body": "Fields of dreams, where the sunlight gleams,\nAmidst the golden grain.\nA tranquil space, in nature's embrace,\nWhere peace shall ever reign."
    },
    {
        "author_id": user.id,
        "title": "A Winter's Tale",
        "body": "A winter's tale, a snowy trail,\nFootprints in the snow.\nA cozy night, by the firelight,\nWhere memories gently flow."
    },
    {
        "author_id": user.id,
        "title": "Rainbow's End",
        "body": "Rainbow's end, where dreams ascend,\nOver the distant hill.\nA vibrant sight, in the soft twilight,\nWhere wishes are fulfilled."
    },
    {
        "author_id": user.id,
        "title": "Autumn Whispers",
        "body": "Autumn whispers, the leaves' soft twisters,\nIn shades of red and gold.\nA tranquil scene, where the air is clean,\nAs nature's story is told."
    },
    # Add more poems to reach a total of twenty
]

# Add more poems to reach a total of twenty
for attrs in poems:
    attrs.pop('author_id', None)
    poem = fake_poem(user=user.id, **attrs)
    # poem.delete()
    store.save()
    for ch in choices(['humor', 'war', 'poetry', 'zen', 'belloc', 'satire', 'women'], k=4):
        poem.addTag(ch)
next = True
# curr: int =  0
curr = 0
count = 0
while next:
    prev, pages, next = store.paginate("Poem", page_size=7)
    if pages:
        print(f'----Starts at page {curr}------\n')
    else: 
        print(f"The pages are not up to {curr}")
    for x in pages:
        print(f"{x.title}")
        # for t in x.tags:
        #     print(f"\t{t.name}")
        count += 1
    curr = next
    print(curr)
    break
else:
    print("End of pages there's no more page to be fetched")
print(f"Total count = {count}")
# print(user.get_id)
# for poem in store.all(Poem):
#     poem.append
# print(user.preferences)
# for x in store.gen_random_reference_poems(user):
#     print(f"{x.title}")
