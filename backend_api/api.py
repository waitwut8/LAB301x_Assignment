import json
from .lib_search import search
import uuid
import random
from datetime import datetime, timedelta
import jmespath
from .lib_search import search
from datetime import timezone
from fastapi import FastAPI, HTTPException, status, Response, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from .lib_jwt import sign_jwt, decode_jwt, ExpiryTime, JWTBearer, get_current_user
from .lib_sender import send_email, get_email_from_cart
from .codegenerator import get_promo_code
from .schemas import (
    LoginInfo,
    LoginResponse,
    PriceRange,
    CartAddRequest,
    Cart,
    CartItem,
    Order,
)
from .schemas import KeywordFilter as keywordFilter
from .json_man import JSONManager
import jinja2
from .lib_analytics import top_products, rev_over_time, plot_orders_over_time, prod_over_time
from dotenv import load_dotenv
from os import getenv
load_dotenv()

app = FastAPI()
alg_appid = getenv("ALGOLIA_APPID")
alg_searchkey = getenv("ALGOLIA_SEARCHKEY")
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

posts = post_manager.data

order_manager = JSONManager("database/orders.json")
orders = order_manager.data


@app.post("/validate", status_code=200)
async def validate(token: str):
    return decode_jwt(token)


@app.post("/login")
async def login(login_info: LoginInfo):

    
    if user := check_login(login_info.username, login_info.password):
        print(f"User {login_info.username} logged in")
        return sign_jwt(user.get("username"), user.get("id"), ExpiryTime.FIFTEEN_MINUTES)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )

def check_login(username, password):
    return search(f"$[username='{username}' and password='{password}']", users)


@app.post("/refresh", status_code=200, dependencies=[Depends(JWTBearer())])
async def refresh_token(current_user=Depends(get_current_user)):
    return sign_jwt(
        current_user.get("user_name"), current_user.get("user_id"), ExpiryTime.THIRTY_MINUTES
    )


@app.get("/products", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_all_products():
    return products

@app.get("/products_name", status_code=200)
async def get_product_names():
    return search("$[].title", products)


@app.get("/numberofproducts", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_number_of_products(current_user=Depends(get_current_user)):

    user_id = current_user.get("user_id")
    user_cart = jmespath.search(f"[?userId==`{user_id}`]", carts)
    if user_cart:
        return search("$sum(products.quantity)", user_cart[0])


@app.get("/product/{product_id}", status_code=200, dependencies=[Depends(JWTBearer())])
async def get_product(product_id: str):
    p = search(f"$[id='{product_id}']", products)
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
    
    print(keyword)
    data = search(
        f"$append($[$contains(title, /{keyword}/i) or $contains(description, /{keyword}/i) or $contains(category, /{keyword}/i) or $contains(brand, /{keyword}/i)], [])", products
    )
    print(data)
    return data


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
async def get_cart(current_user=Depends(get_current_user)):
    print(current_user)
    _id = current_user.get("user_id")
    # _cart = jmespath.search(f"[?userId==`{_id}`]", carts)
    _cart = search(f"$[userId={_id}]", carts)
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
        cart_manager.dump_json()
        return new_cart
    return _cart


@app.post("/cart", status_code=200, dependencies=[Depends(JWTBearer())])
async def add_to_cart(
    cart_request: CartAddRequest, current_user=Depends(get_current_user)
):
    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user"
        )

    # user_cart = jmespath.searchf"[?userId == `{user_id}`]", carts)
    user_cart = search(f"$[userId={user_id}]", carts)
    if not user_cart:
        return {"message": "Cart not found"}

    #user_cart = user_cart[0]  # Directly use the first result
    _index = carts.index(user_cart)

    # Use jmespath to find the cart product
   
    cart_product = search(f"$[title='{cart_request.product_name}']", products)
    print(cart_product)
    # jmespath.search(
    #    f"[?title=='{cart_request.product_name}']", user_cart["products"]
    #)
    if not cart_product:
        return {"message": "Product not found"}
    cart_product = CartItem(**cart_product)
    if _products := search(f"$[title='{cart_request.product_name}']", user_cart["products"]):
        _products["quantity"] += cart_request.quantity

    else:
        cart_product.quantity = cart_request.quantity
        user_cart["products"].append(cart_product.model_dump())  # Store as dict
    carts[_index] = user_cart  # Update the cart in the main list
    cart_manager.dump_json()


@app.delete("/cart", status_code=200, dependencies=[Depends(JWTBearer())])
async def delete_from_cart(
    cart_request: CartAddRequest, current_user=Depends(get_current_user)
):

    user_id = current_user.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid user"
        )
    if not isinstance(product_name, str) or not isinstance(quantity, (int, float)):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid input types for product_name or quantity"
        )

    if quantity < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity cannot be negative"
        )
    user_cart = search(f"$[userId={user_id}]", carts)
    if not user_cart:
        return {"message": "Cart not found"}
    user_cart = user_cart
    _index = carts.index(user_cart)
    user_cart = Cart(**user_cart)

    # cart_product = next((product for product in products if product['id'] == cart_request.product_id), None)

    # cart_product = jmespath.search(f"[?title=='{cart_request.product_name}']", products)
    cart_product = search(f"$[title = '{cart_request.product_name}']", products)
    if not cart_product:
        return {"message": "Product not found"}
    cart_product = CartItem(**cart_product)

    if not user_cart.products:
        raise HTTPException(status=status.HTTP_404_NOT_FOUND, detail="Cart is empty")
    if _products := [
        x for x in user_cart.products if x.title == cart_request.product_name
    ]:
        _products = _products[0]
        print(_products)
        _products.quantity -= cart_request.quantity
        if _products.quantity <= 0:
            user_cart.products.remove(_products)
        carts[_index] = user_cart.model_dump()
        return {"message": "Product removed"}
    return


@app.get("/posts/{id}", status_code=200)
async def get_post(id: int):
    return search(f"id='{id}'", posts)


@app.get("/posts_noLogin/{number}", status_code=200)
async def get_random_posts(number: int):
    print(type(posts))
    return random.sample(posts, number)


@app.post("/checkout", status_code=200, dependencies=[Depends(JWTBearer())])
async def checkout(promo: str, current_user=Depends(get_current_user)):
    user_id = current_user.get("user_id")
    user_name = current_user.get("user_name")
    # cart = jmespath.search(f"[?userId==`{user_id}`]", carts)
    cart = search(f"$[userId={user_id}]", carts)
    try:
        int(promo[-2:])
    except:
        promo = ""
    order = Order(
        **{
            "id": cart.get("id"),
            "products": cart.get("products"),
            "total": cart.get("total"),
            "promoCode": promo,
            "userId": user_id,
        }
    )
    orders.append(order.model_dump())
    order_manager.dump_json()
    print(user_id)
    print(cart)
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cart not found, try creating one?"
        )

      # Get the first matching cart
    cart_index = carts.index(cart)
    message = get_message(cart)
    for item in cart.get("products", []):
        reduce_stock(item.get("title"), item.get("quantity"))


    
    # carts[cart_index] = {}
    carts.pop(cart_index)
    cart_manager.dump_json()
    ## TODO: write an email with the cart and saying it will be delivered shortly
    # Clear the cart after checkout
    ##cart_manager.save_data(carts)  # Save the updated carts data
    send_email(
        "waitwut8@gmail.com",
        "waitwut8@gmail.com",
        "Order Confirmation",
        get_email_from_cart(cart, user_name),
    )
    return {"message": "Checkout successful"}


def reduce_stock(product_name, quantity):
    if not isinstance(product_name, str) or not isinstance(quantity, (int, float)):
        raise ValueError("Invalid input types for product_name or quantity")

    if quantity < 0:
        raise ValueError("Quantity cannot be negative")

    # product = jmespath.search(f"[?title=='{product_name}']", products)
    product = search(f"$[title='{product_name}']", products)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Product not found"
        )

  # Get the first matching product
    product_index = products.index(product)

    product["stock"] -= quantity
    if product["stock"] <= 0:
        product["stock"] = 0
        product["availabilityStatus"] = "Out of stock"
        print("out of stock now")

    products[product_index] = product  # Update the product in the list
    # products_manager(products)  # Save the updated products data

    return product["stock"]


def personalize_message(name, message):
    return f"""
        <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cart Checkout</title>
        <style>

        </style>
    </head>
    <body>
        <div class="checkout-message">
            <h1>Dear, {name}</h1>
            <h2>Thank you for your purchase!</h2>
            <p>Your order of {message} has been successfully placed.</p>
        </div>
    </body>
    </html>
    """


def get_message(cart):
    msg = ""
    count = 1
    for i in cart.get("products"):
        msg += f"{count}. {i.get('quantity')} x {i.get('title')}\n "
        count += 1
    return msg


@app.get("/promo", status_code=200)
async def get_promo():

    return get_promo_code()


@app.get("/username", status_code=200)
async def get_random_username():
    user = random.choice(users)
    return [
        user.get("firstName") + " " + user.get("lastName"),
        f"{user.get('company').get('title')} at {user.get('company').get('name')}",
    ]

@app.get("/top_products", status_code=200)
async def get_top_products():
    var = top_products(orders)
    
    return var

@app.get("/revenue_over_time", status_code=200)
async def get_rev_over_time():
    var = rev_over_time(orders)
    print(var)
    return var

@app.get("/orders_over_time", status_code=200)
async def get_ord_over_time():
    return plot_orders_over_time(orders)

@app.get("/products_over_time", status_code=200)
async def get_prod_over_time():
    return prod_over_time(orders)
@app.get("/get_algolia_keys", status_code=200)
async def get_search_keys():
    return [alg_appid, alg_searchkey]
    
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
