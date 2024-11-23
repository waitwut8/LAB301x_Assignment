import json
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from schemas import LoginInfo
import uuid
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

@app.post("/login", status_code=200)
async def login(login_info: LoginInfo):
    for user in users:
        if user["username"] == login_info.username and user["password"] == login_info.password:
            return {"message": "Login successful"}
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

@app.get("/products", status_code=200)
async def get_all_products():
    return products

@app.get("/product/{product_id}", status_code=200)
async def get_product(product_id: int):
    for product in products:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)