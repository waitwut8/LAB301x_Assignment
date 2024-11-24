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

@app.post("/login", status_code=200)
async def login(login_info: LoginInfo):
    for user in users:
        if user["username"] == login_info.username and user["password"] == login_info.password:
            print(user)
            _userResponse = LoginResponse(
                **{
                "tokenType" : "Bearer",
                
                "accessToken" : str(uuid.uuid4()),
                
                "tokenExpiry" : datetime.now()+timedelta(minutes=30)
                }
                
                )
            user.update(_userResponse)
            print(user)
            # requests.post('https://dummyjson.com/auth/login', json={'username': login_info.username, 'password': login_info.password})
            return _userResponse
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

@app.get("/products", status_code=200)
async def get_all_products(response: Response, request: Request):
    if not check_token(request):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"detail": "Unauthorized"}
    
    
    
    
    
    return products

def check_token(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        
        return False
    token = token.split(" ")[1]
    user = jmespath.search(f"[?accessToken=='{token}']", users)
    if not user:
        
        return False
    print(user)
    token_expiry = user[0].get("tokenExpiry", None)
    time_now = datetime.now()
    if token_expiry and token_expiry < time_now:
        
        return False
    
@app.get("/product/{product_id}", status_code=200)
async def get_product(product_id: int, response: Response, request: Request):
    if not check_token(request):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"detail": "Unauthorized"}
    
    for product in products:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

if __name__ == "__main__":
    import uvicorn
    import requests
    uvicorn.run(app, host="127.0.0.1", port=8000)