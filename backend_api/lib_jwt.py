import jwt
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from enum import Enum
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta

JWT_ALGORITHM = "HS256"
JWT_SECRET = "be4049f1bef09d33623b03731a9ef84037e65ebca4ff3955e75935482b3347e1"


class ExpiryTime(int, Enum):
    ONE_MINUTE = 60
    FIVE_MINUTES = 5 * 60
    FIFTEEN_MINUTES = 15 * 60
    THIRTY_MINUTES = 30 * 60
    ONE_HOUR = 60 * 60


def decode_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        return {}
    except jwt.InvalidTokenError:
        print("Invalid token " + token)
        return {}


def sign_jwt(user_name: str, user_id: int, expiration: int = ExpiryTime.FIFTEEN_MINUTES) -> dict:

    now_timestamp = datetime.now(timezone.utc).timestamp()
    expiry_time = now_timestamp + expiration
    payload = {
        "user_name": user_name,
        "user_id": user_id,
        "exp": expiry_time,
        "iat": datetime.now(timezone.utc).timestamp(),
    }
    payload_refresh = {
        "user_name": user_name,
        "user_id": user_id,
        "exp": expiry_time + 1,
        "iat": datetime.now(timezone.utc).timestamp(),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    refresh_token = jwt.encode(payload_refresh, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {
        "user_name": user_name,
        
        "user_id": user_id,
        "access_token": token,
        "refresh_token": refresh_token,
        "expiry_time": datetime.fromtimestamp(expiry_time),
        "issued_at": datetime.fromtimestamp(now_timestamp),
    }


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(
            JWTBearer, self
        ).__call__(request)
        if not credentials:
            raise HTTPException(status_code=401, detail="Invalid authorization code.")
        if credentials.scheme != "Bearer":
            raise HTTPException(
                status_code=401, detail="Invalid authentication scheme."
            )
        if not self.verify_jwt(credentials.credentials):
            raise HTTPException(
                status_code=401, detail="Invalid token or expired token."
            )
        return credentials.credentials

    def verify_jwt(self, jwt_token: str) -> bool:
        try:
            payload = decode_jwt(jwt_token)
        except Exception:
            payload = None
        return bool(payload)


def get_current_user(token: str = Depends(JWTBearer())) -> dict:
    return decode_jwt(token)
