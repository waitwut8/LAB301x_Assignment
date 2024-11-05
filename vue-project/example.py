cart = {}

def add(item, quantity):
    if item in cart:
        cart[item] += quantity
    else:
        cart[item] = quantity

