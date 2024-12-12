import json

import uuid
import random
from datetime import datetime, timedelta
import jmespath
from datetime import timezone
from fastapi import FastAPI, HTTPException, status, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from .lib_jwt import sign_jwt, decode_jwt, ExpiryTime, JWTBearer, get_current_user
from .codegenerator import get_promo_code
from .schemas import (
    LoginInfo,
    LoginResponse,
    PriceRange,
    CartAddRequest,
    Cart,
    CartItem,
)
from .schemas import KeywordFilter as keywordFilter
from .json_man import JSONManager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

users_manager = JSONManager("database/users.json")
users = users_manager.data
products_manager = JSONManager("database/products.json")
products = products_manager.data
cart_manager = JSONManager("database/carts.json")
carts = cart_manager.data
post_manager = JSONManager("database/posts.json")
print(post_manager)
posts = post_manager.data
@app.post("/validate", status_code=200)
async def validate(token: str):
    return decode_jwt(token)

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
        print(user)
        return sign_jwt(user.get("username"), user.get("id"), ExpiryTime.THIRTY_MINUTES)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

@app.post("/refresh", status_code=200, dependencies=[Depends(JWTBearer())])
async def refresh_token(current_user=Depends(get_current_user)):
    return sign_jwt(current_user.get("user_name"), current_user.get("user_id"), ExpiryTime.ONE_HOUR)
@app.get("/products", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_all_products():
    return products

@app.get("/numberofproducts", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_number_of_products(current_user = Depends(get_current_user)):

    user_id = current_user.get("user_id")
    user_cart = jmespath.search(f"[?userId==`{user_id}`]", carts)
    return sum(i.get('quantity') for i in user_cart.get('products')) if user_cart else 0
        

@app.get("/product/{product_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_product(product_id: str):
    if product := next((p for p in products if p["id"] == product_id), None):
        return product
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )
@app.get("/product_noLogin/{products_needed}", status_code=200)
async def getProduct(products_needed: str):
    return random.sample(products, int(products_needed))



@app.post("/search/{keyword}", status_code=200, dependencies=[Depends(JWTBearer())])
async def search_products(keyword: str, request: Request):
    print(request.headers)
    return jmespath.search(
        f"[?contains(title, '{keyword}') || contains(description, '{keyword}')|| contains(category, '{keyword}')|| contains(brand, '{keyword}') ]",
        products,
    )
    



@app.put("/product/{product_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def update_product(product_id: int, current_user=Depends(get_current_user)):
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
            status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized"
        )
    return {"message": "this is a fake update"}


@app.get("/filter/{keyword}", status_code=200, dependencies=[Depends(JWTBearer())])
async def filter_products(filter: keywordFilter):
    return jmespath.search(
        f"[?contains({filter.search_type}, '{filter.keyword}')]", products
    )


@app.get("/price/{price}", status_code=200, dependencies=[Depends(JWTBearer())])
async def filter_price(price_filter: PriceRange):
    return jmespath.search(
        f"[?price >= {price_filter.minPrice} && price <= {price_filter.maxPrice}]",
        products,
    )


@app.get("/review/{product_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_reviews(product_id: int):
    return jmespath.search(f"[?product_id == {product_id}].review", products)


@app.get("/cart", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_cart(current_user = Depends(get_current_user)):
    print(current_user)
    _id = current_user.get("user_id")
    _cart = jmespath.search(f"[?userId==`{_id}`]", carts)
    if not _cart:
        new_cart = Cart(
            **{
                "id": str(uuid.uuid4()),
                "userId": _id,
                "products": [],
                "totalProducts": 0,
                "totalQuantity": 0,
                "createdAt": datetime.now(timezone.utc).isoformat(),
                "updatedAt": datetime.now(timezone.utc).isoformat(),
            }
        )
        carts.append(new_cart.model_dump())
        # cart_manager.dump_json(carts)
        return new_cart
    return _cart[0]


@app.post("/cart", status_code=200, dependencies=[Depends(JWTBearer())])
async def add_to_cart(cart_request: CartAddRequest, current_user=Depends(get_current_user)):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")

    user_cart = jmespath.search(f"[?userId == `{user_id}`]", carts)
    if not user_cart:
        return {"message": "Cart not found"}

    user_cart = user_cart[0]  # Directly use the first result
    _index = carts.index(user_cart)

    # Use jmespath to find the cart product
    cart_product = jmespath.search(f"[?title=='{cart_request.product_name}']", products)
    if not cart_product:
        return {"message": "Product not found"}
    cart_product = CartItem(**cart_product[0])
    if _products := jmespath.search(
        f"[?title=='{cart_request.product_name}']", user_cart['products']
    ):
        _products[0]['quantity'] += cart_request.quantity

    else:
        cart_product.quantity = cart_request.quantity
        user_cart['products'].append(cart_product.model_dump())  # Store as dict
    carts[_index] = user_cart  # Update the cart in the main list
    cart_manager.dump_json(carts)

@app.delete("/cart", status_code = 200, dependencies = [Depends(JWTBearer())])
async def delete_from_cart(
    cart_request: CartAddRequest, current_user = Depends(get_current_user)
):
    
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code =status.HTTP_401_UNAUTHORIZED, detail ="invalid user"
        )
    user_cart = jmespath.search(f"[?userId == `{user_id}`]", carts)
    if not user_cart:
        return {"message": "Cart not found"}
    user_cart = user_cart[0]
    _index = carts.index(user_cart)
    user_cart = Cart(**user_cart)

    # cart_product = next((product for product in products if product['id'] == cart_request.product_id), None)
    
    cart_product = jmespath.search(f"[?title=='{cart_request.product_name}']", products)
    if not cart_product:
        return {"message": "Product not found"}
    cart_product = CartItem(**cart_product[0])

    if not user_cart.products:
        raise HTTPException(
            status = status.HTTP_404_NOT_FOUND, detail = "Cart is empty"
        )
    if _products := [
        x for x in user_cart.products if x.title == cart_request.product_name
    ]:
        _products = _products[0]
        _products.quantity -= cart_request.quantity
        if _products.quantity <= 0:
            user_cart.products.remove(_products)
        carts[_index] = user_cart.model_dump()
        return {"message": "Product removed"}
    return 
    
@app.get("/posts/{id}", status_code = 200)
async def get_post(id: int):
    return jmespath.search(f"[?id==`{id}`]", posts)    

@app.get("/posts_noLogin/{number}", status_code = 200)
async def get_random_posts(number: int):
    print(type(posts))
    return random.sample(posts, number)

@app.post("/checkout", status_code=200, dependencies=[Depends(JWTBearer())])
async def checkout(current_user=Depends(get_current_user)):
    user_id = current_user.get("user_id")
    cart = jmespath.search(f"[?userId==`{user_id}`]", carts)
    print(user_id)
    print(cart)
    if not cart:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found")
    
    cart = cart[0]  # Get the first matching cart
    cart_index = carts.index(cart)
    
    for item in cart.get('products', []):
        reduce_stock(item.get('title'), item.get('quantity'))
    
    carts[cart_index] = {}  # Clear the cart after checkout
    ##cart_manager.save_data(carts)  # Save the updated carts data
    
    return {"message": "Checkout successful"}

def reduce_stock(product_name, quantity):
    if not isinstance(product_name, str) or not isinstance(quantity, (int, float)):
        raise ValueError("Invalid input types for product_name or quantity")
    
    if quantity < 0:
        raise ValueError("Quantity cannot be negative")
    
    product = jmespath.search(f"[?title=='{product_name}']", products)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    product = product[0]  # Get the first matching product
    product_index = products.index(product)
    
    product['stock'] -= quantity
    if product['stock'] <= 0:
        product['stock'] = 0
        product['availabilityStatus'] = "Out of stock"
        print("out of stock now")
    
    products[product_index] = product  # Update the product in the list
    # products_manager(products)  # Save the updated products data
    
    return product['stock']
    
    
@app.get("/promo", status_code = 200)

async def get_promo():
    """_summary_

    Returns:
        _type_: _description_
    """    
    return get_promo_code()
    
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
