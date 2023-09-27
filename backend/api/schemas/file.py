from apiflask.fields import File
from apiflask import Schema
from marshmallow import ValidationError
from imagekitio import ImageKit
from imagekitio.models.UploadFileRequestOptions import UploadFileRequestOptions
import os
from api import app
from apiflask import abort
from models import store
import tempfile
from werkzeug.utils import secure_filename
imagekit = ImageKit(**app.config['IMAGE_KIT'])


def validate_file_size(file):
    """Validates the file size making sure it's at most 8mb"""
    max_size_in_bytes = 8 * 1024 * 1024  # 8MB in bytes
    if file and len(file.read()) > max_size_in_bytes:
        raise ValidationError("File size must be at most 8MB.")
    file.seek(0)
    

def validate_file_type(file):
    """Validates the file type"""
    if file and file.mimetype not in ['image/jpeg', 'image/png', 'image/gif']:
        raise ValidationError("File must either be a jpeg, gif or png")

class UpdateAvatar(Schema):
    profile_picture = File(
        required=True,
        metadata={'description': 'The file you want to use. It must be a picture below 8mb'},
        validate=[
            validate_file_type,
            validate_file_size
        ]

    )

def upload_image(user, file):
    # temp_dir = tempfile.mkdtemp()
    # temp_file_path = os.path.join(temp_dir, secure_filename(file.filename))
    # file.save(temp_file_path)
    unique = user.get_id
    val = imagekit.upload_file(
        file=file.stream,
        file_name=unique,
        options = UploadFileRequestOptions(
            use_unique_file_name=False,
            overwrite_file=True,
            )
    )
    print(val.response_metadata.raw)
    # os.remove(temp_file_path)
    # os.rmdir(temp_dir)
    # user.profile_picture = val.response_metadata.raw['url']
    # temp = user.secret.copy()
    # if len(temp) == 2:
    #     temp.append(val.response_metadata.raw['fileId'])
    # elif len(temp) == 3:
    #     temp[2] = val.response_metadata.raw['fileId']
    # user.secret = temp
    # store.save()

def delete_image(user):
    val = user.secret.copy()
    if len(val) == 3:
        fId = val[-1]
        val = imagekit.delete_file(fId)
        print(val.response_metadata.raw)
