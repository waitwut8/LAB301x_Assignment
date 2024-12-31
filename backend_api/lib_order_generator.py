import alive_progress
import random
from datetime import datetime, timedelta
from schemas import Order, CartItem
import uuid

# Load the products data from the JSON file
from json_man import JSONManager
prod_man = JSONManager('../database/products.json')
products = prod_man.data
user_man = JSONManager('../database/users.json')
users = user_man.data

def generate_random_order(user_id: int) -> Order:
    # Randomly select products for the order
    num_products = random.randint(1, 5)
    
    selected_products = random.sample(products, num_products)

    # Create order products with random quantities
    order_products = []
    for product in selected_products:
        quantity = random.randint(1, 5)
        # order_product = Product(
        #     title=product['title'],
        #     price=product['price'],
        #     quantity=quantity
        # )
    #     id: str
    # title: str
    # price: float

    # discountPercentage: float
    # thumbnail: str
    # quantity: int = 0

        order_product = CartItem(**{
            "id": product['id'],
            "title": product['title'],
            "price": product['price'],
            "discountPercentage": product['discountPercentage'],
            "thumbnail": product['thumbnail'],
            "quantity": quantity
        })  
        order_products.append(order_product)

    # Calculate total price
    total_price = sum(p.price * p.quantity for p in order_products)

    # Create the order
    order = Order( 
        id = str(uuid.uuid4()),
        userId=user_id,
        products=order_products,
        total=total_price,
        promoCode="",
        created_at=(datetime.now() - timedelta(seconds=random.randint(0, 86400*31))).strftime('%Y-%m-%d %H:%M:%S.%f')
    )


    return order

# Example usage
if __name__ == "__main__":
    order_data = []
    orders = JSONManager('../database/orders.json')
    order_data = orders.data
    with alive_progress.alive_bar(100) as bar:
        for i in range(100):
                user = random.choice(users)
                
                try:
                    user_id = user['id']
                except:
                    user_id = random.randint(1, 208)  # Example user ID
                random_order = generate_random_order(user_id)
                
                order_data.append(random_order.model_dump())
                bar()
                
                
                
    orders.data = order_data

    orders.dump_json()
    
