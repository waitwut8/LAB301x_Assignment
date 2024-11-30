import json
import uuid
from datetime import datetime, timedelta
import jmespath
from fastapi import FastAPI, HTTPException, status, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from lib.lib_jwt import sign_jwt, decode_jwt, ExpiryTime, JWTBearer, get_current_user
from schemas import LoginInfo, LoginResponse

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
def load_json(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


users = load_json("database/users.json")
products = load_json("database/products.json")


# Login endpoint
@app.post("/login")
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
    signed_jstr = sign_jwt(user["username"], ExpiryTime.ONE_HOUR)

    return signed_jstr


# Get all products endpoint
@app.get("/products", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_all_products(response: Response, request: Request):
    return products


# Get product by ID endpoint
@app.get("/product/{product_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_product(product_id: int, response: Response, request: Request):

    if product := next((p for p in products if p["id"] == product_id), None):
        return product
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )


@app.post("/search/{keyword}", status_code=200, dependencies=[Depends(JWTBearer())])
async def search_products(keyword: str, response: Response, request: Request):
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
async def update_product(
    product_id: int, request: Request, current_user=Depends(get_current_user)
):
    print(current_user)
    user_name = current_user.get("user_name", None)
    if not user_name:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user"
        )
    else:
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
