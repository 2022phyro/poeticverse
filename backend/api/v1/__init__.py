from apiflask import APIBlueprint

app_views = APIBlueprint("app_views", __name__, url_prefix="/v1")

from api.v1.auth import *
from api.v1.poems import *
from api.v1.comments import *
