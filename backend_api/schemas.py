from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field, field_serializer

class LoginInfo(BaseModel):
    username: str
    password: str
class LoginResponse(BaseModel):
    tokenType: str
    accessToken: str
    createdAt: datetime = Field(default_factory=datetime.now)
    tokenExpiry: datetime
    
    @field_serializer("tokenExpiry")
    def serialize_token_expiry(self, v: datetime) -> str:
        return v.isoformat()
    @field_serializer("createdAt")
    def serialize_created_at(self, v: datetime) -> str:
        return v.isoformat()
    
class PriceRange(BaseModel):
    minPrice: float
    maxPrice: float
    
class KeywordFilter(BaseModel):
    keyword: str | int
    search_type: Literal["title", "description", "tags", "brand"]