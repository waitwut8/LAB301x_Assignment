import json
import uuid
from datetime import datetime, timedelta
import jmespath
from fastapi import FastAPI, HTTPException, status, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from .lib_jwt import sign_jwt, decode_jwt, ExpiryTime, JWTBearer, get_current_user
from .schemas import LoginInfo, LoginResponse, PriceRange
from .schemas import KeywordFilter as keywordFilter
from .json_man import JSONManager

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Load data from JSON files
# def load_json(file_path, mode="r"):
#     with open(file_path, mode) as file:
#         return json.load(file)

users_manager = JSONManager("database/users.json")
users = users_manager.data
products_manager = JSONManager("database/products.json")
products = products_manager.data
cart_manager = JSONManager("database/carts.json")
carts = cart_manager.data

# users = load_json("database/users.json")
# products = load_json("database/products.json", mode="r+")


# Login endpoint
@app.post("/login")
async def login(login_info: LoginInfo):
    if user := next(
        (
            u
            for u in users
            if u["username"] == login_info.username
            and u["password"] == login_info.password
        ),
        None,
    ):
        return sign_jwt(user.get("username"),user.get("id"), ExpiryTime.ONE_HOUR)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )


# Get all products endpoint
@app.get("/products", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_all_products():
    return products


# Get product by ID endpoint
@app.get("/product/{product_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_product(product_id: str):

    if product := next((p for p in products if p["id"] == product_id), None):
        return product
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )


@app.post("/search/{keyword}", status_code=200, dependencies=[Depends(JWTBearer())])
async def search_products(keyword: str):
    try:
        product_id = int(keyword)
        return jmespath.search(
            f"[?id == {product_id} || contains(description, '{keyword}')]",
            products,
        )
    except Exception as e:
        return jmespath.search(
            f"[?contains(title, '{keyword}') || contains(description, '{keyword}')]",
            products,
        )


@app.put("/product/{product_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def update_product(product_id: int, current_user=Depends(get_current_user)):
    print(current_user)
    if not (user_name := current_user.get("user_name", None)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user"
        )
    role = jmespath.search(f"[?username=='{user_name}'].role | [0]", users)
    if not role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid role"
        )
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized"
        )

    ### do later

    return {"message": "this is a fake update"}


# get product items via tags, names, prices or anything else
@app.get("/filter/{keyword}", status_code=200, dependencies=[Depends(JWTBearer())])
async def filter_products(filter: keywordFilter):

    return jmespath.search(f"[?contains({filter.search_type}, '{filter.keyword}')]")


@app.get("/price/{price}", status_code=200, dependencies=[Depends(JWTBearer())])
async def filter_price(price_filter: PriceRange):

    return jmespath.search(
        f"[?price >= {price_filter.minPrice} && price <= {price_filter.maxPrice}]",
        products,
    )

@app.get("/review/{product_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_reviews(product_id: int):

    return jmespath.search(f"[?product_id == {product_id}].review", products)

@app.get("/cart/{user_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_cart(user_id: int):
    return jmespath.search(f"[?owner_id=={user_id}]", carts)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
