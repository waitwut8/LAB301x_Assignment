from imagekitio import ImageKit
from dotenv import load_dotenv
from os import getenv
from pathlib import Path
load_dotenv()
# SDK initialization
private_key = getenv('IMGKITIO_PRIVKEY')

from imagekitio import ImageKit
imagekit = ImageKit(
    private_key=private_key,
    public_key='public_L9//JkW+LtC/4zR+2vz9oQb+y44=',
    url_endpoint='https://ik.imagekit.io/lab301x'
)

def auth_params():
    return imagekit.get_authentication_parameters()