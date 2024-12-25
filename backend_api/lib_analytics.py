import json
import numpy as np
from datetime import datetime, timedelta
from .json_man import JSONManager
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker


def top_products(orders):
    product_quantities = {}
    for order in orders:
        for product in order['products']:
            title = product['title']
            quantity = product['quantity']
            if title in product_quantities:
                product_quantities[title] += quantity
            else:
                product_quantities[title] = quantity
    sorted_products = sorted(product_quantities.items(), key=lambda x: x[1], reverse=True)
    top_products = sorted_products[:20]
    titles, quantities = zip(*top_products)
    return [titles, quantities]


def rev_over_time(orders):
    
    revenue_over_time = {}
    for order in orders:
        order_date = datetime.strptime(order['created_at'], '%Y-%m-%d %H:%M:%S.%f').date()
        order_total = sum(product['price'] * product['quantity'] for product in order['products'])
        if order_date in revenue_over_time:
            revenue_over_time[order_date] += order_total
        else:
            revenue_over_time[order_date] = order_total
    sorted_revenue = sorted(revenue_over_time.items())
    dates, revenues = zip(*sorted_revenue)
    all_dates = [dates[0] + timedelta(days=i) for i in range((dates[-1] - dates[0]).days + 1)]
    revenues = [revenue_over_time.get(date, 0) for date in all_dates]
    dates = all_dates
    past_24_hours = datetime.now() - timedelta(days=2)
    recent_revenue = sum(revenue for date, revenue in zip(dates, revenues) if date >= past_24_hours.date())
    return [dates, revenues, recent_revenue]


def plot_orders_over_time(orders):
    orders_over_time = {}
    for order in orders:
        order_date = datetime.strptime(order['created_at'], '%Y-%m-%d %H:%M:%S.%f').date()
        if order_date in orders_over_time:
            orders_over_time[order_date] += 1
        else:
            orders_over_time[order_date] = 1
    sorted_orders = sorted(orders_over_time.items())
    dates, order_counts = zip(*sorted_orders)
    all_dates = [dates[0] + timedelta(days=i) for i in range((dates[-1] - dates[0]).days + 1)]
    order_counts = [orders_over_time.get(date, 0) for date in all_dates]
    dates = all_dates
    past_24_hours = datetime.now() - timedelta(days=2)
    recent_orders = sum(order for date, order in zip(dates, order_counts) if date >= past_24_hours.date())
    return [dates, order_counts, recent_orders]

def prod_over_time(orders):
    products_over_time = {}
    for order in orders:
        order_date = datetime.strptime(order['created_at'], '%Y-%m-%d %H:%M:%S.%f').date()
        for product in order['products']:
            if order_date in products_over_time:
                products_over_time[order_date] += product['quantity']
            else:
                products_over_time[order_date] = product['quantity']
    sorted_products = sorted(products_over_time.items())
    dates, product_counts = zip(*sorted_products)
    all_dates = [dates[0] + timedelta(days=i) for i in range((dates[-1] - dates[0]).days + 1)]
    product_counts = [products_over_time.get(date, 0) for date in all_dates]
    dates = all_dates
    past_24_hours = datetime.now() - timedelta(days=2)
    recent_product_counts = sum(product for date, product in zip(dates, product_counts) if date >= past_24_hours.date())
    return [dates, product_counts, recent_product_counts]