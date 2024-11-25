import json
import uuid
from datetime import datetime, timedelta
import jmespath
from fastapi import FastAPI, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware

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


# Helper function to check token
def check_token(request: Request) -> bool:
    token = request.headers.get("Authorization", None)
    if not token or not token.startswith("Bearer "):
        return False

    token = token.split(" ")[1]

    user = jmespath.search(f"[?accessToken=='{token}']", users)
    if not user:
        return False

   

    token_expiry = user[0].get("tokenExpiry", None)
    return bool(token_expiry and token_expiry >= datetime.now())

    # return token_expiry and token_expiry > datetime.now()


# Login endpoint
@app.post("/login", response_model=LoginResponse)
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
    user.update(response)
    return response


# Get all products endpoint
@app.get("/products", status_code=200)
async def get_all_products(response: Response, request: Request):
    if not check_token(request):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"detail": "Unauthorized"}

    return products


# Get product by ID endpoint
@app.get("/product/{product_id}", status_code=200)
async def get_product(product_id: int, response: Response, request: Request):
    if not check_token(request):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"detail": "Unauthorized"}

    if product := next((p for p in products if p["id"] == product_id), None):
        return product
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )


@app.post("/search/{keyword}", status_code=200)
async def search_products(keyword: str, response: Response, request: Request):
    if check_token(request):
        bearer_token = request.headers.get("Authorization")
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"message": "Unauthorized"}

    return jmespath.search(
        f"[?contains(title, '{keyword}') || contains(description, '{keyword}')]",
        products,
    )




if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
