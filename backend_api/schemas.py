from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field, field_serializer, computed_field, ConfigDict

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
    
class Review(BaseModel):
    rating: int
    comment: str
    user: str
    product_id: int
    created_at: datetime = Field(default_factory=datetime.now)
    
    @field_serializer("created_at")
    def serialize_created_at(self, v: datetime) -> str:
        return v.isoformat()
class CartAddRequest(BaseModel):
    product_name: str
    quantity: int
class CartItem(BaseModel):
    id: str
    title: str
    price: float

    discountPercentage: float
    thumbnail: str
    quantity: int = 0
    @computed_field
    @property
    def total(self) -> float:
        return self.price * self.quantity
    @computed_field
    @property
    def discountedPrice(self) -> float:
        return self.price * (1 - self.discountPercentage / 100)
    @computed_field
    @property
    def discountedTotal(self) -> float:
        return self.discountedPrice * self.quantity
class Cart(BaseModel):
    id: str
    products: list[CartItem] | None = []
    total: float = 0
    discountedTotal: float = 0
    userId: int
    totalProducts: int = 0
    totalQuantity: int = 0
    
class Order(BaseModel):


    id : str
    products: list[CartItem]
    total: float
    promoCode: str = 'NO CODE'
    userId: int
    

    @computed_field
    @property
    def discountedTotal(self) -> float:
        try:
            return self.total * int(self.promoCode[-2:])/100
        except Exception as e:
            return self.total


    model_config = ConfigDict(extra='ignore')
    created_at: str = str(datetime.now())