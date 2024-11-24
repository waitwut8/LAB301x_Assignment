import json
from fastapi import FastAPI, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from schemas import LoginInfo, LoginResponse
from datetime import datetime, timedelta
import uuid
import jmespath

app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load users from the JSON file
with open("database/users.json", "r") as file:
    users = json.load(file)

# Load products from the JSON file
with open("database/products.json", "r") as file:
    products = json.load(file)


async def login(login_info: LoginInfo):
    user = next(
        (
            u
            for u in users
            if u["username"] == login_info.username
            and u["password"] == login_info.password
        ),
        None,
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

    response = LoginResponse(
        tokenType="Bearer",
        accessToken=str(uuid.uuid4()),
        tokenExpiry=datetime.now() + timedelta(minutes=30),
    )
    user.update(response.dict())
    return response


@app.get("/products", status_code=200)
async def get_all_products(response: Response, request: Request):
    if not check_token(request):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"detail": "Unauthorized"}

    return products


def check_token(request: Request) -> bool:
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        return False

    token = token.split(" ")[1]
    user = next((u for u in users if u["accessToken"] == token), None)
    if not user:
        return False

    token_expiry = user.get("tokenExpiry")
    return token_expiry and token_expiry > datetime.now()


@app.get("/product/{product_id}", status_code=200)
async def get_product(product_id: int, response: Response, request: Request):
    if not check_token(request):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"detail": "Unauthorized"}

    for product in products:
        if product["id"] == product_id:
            return product
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
    )


if __name__ == "__main__":
    import uvicorn
    import requests

    uvicorn.run(app, host="127.0.0.1", port=8000)
