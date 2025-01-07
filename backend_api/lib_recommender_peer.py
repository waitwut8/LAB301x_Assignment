from .json_man import JSONManager
import math
from .lib_search import search

products = JSONManager("database/products.json").data
orders = JSONManager("database/orders.json").data
number_to_uuid = {i: p["id"] for i, p in enumerate(products)}

def user_item_table(orders):
    users = sorted({o["userId"] for o in orders})
    products = sorted({p["id"] for o in orders for p in o["products"]})
    u_idx, p_idx = {u: i for i, u in enumerate(users)}, {p: i for i, p in enumerate(products)}
    table = [[0] * len(users) for _ in products]
    for o in orders:
        for p in o["products"]:
            table[p_idx[p["id"]]][u_idx[o["userId"]]] += p["quantity"]
    return table

table = user_item_table(orders)

def calculate_similarity(t, i, j):
    p1, p2 = t[i], t[j]
    dot = sum(a * b for a, b in zip(p1, p2))
    mag1, mag2 = math.sqrt(sum(a**2 for a in p1)), math.sqrt(sum(b**2 for b in p2))
    return dot / (mag1 * mag2) if mag1 and mag2 else 0

def get_product_recommendation(t, i, n=5):
    return [number_to_uuid[x[0]] for x in sorted(((j, calculate_similarity(t, i, j)) for j in range(len(t)) if i != j), key=lambda x: x[1], reverse=True)[:n]]

def recommend_for_user(user_id, orders, t, n=5):
    user_orders = [o for o in orders if o["userId"] == user_id]
    if not user_orders:
        return f"No orders found for user {user_id}"
    user_products = {p["id"] for o in user_orders for p in o["products"]}
    recs = {pid: get_product_recommendation(t, [k for k, v in number_to_uuid.items() if v == pid][0], n) for pid in user_products}
    _recs = {k: [search(f"$[id = '{i}']", products) for i in v] for k, v in recs.items()}
    _ = []
    for i in sum(_recs.values(), []):
        if i not in _:
            _.append(i)


   

    return _
    return 


