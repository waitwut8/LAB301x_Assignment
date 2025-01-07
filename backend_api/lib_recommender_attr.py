import math
import json
from difflib import SequenceMatcher

def calculate_similarity(product1, product2):
    # Assuming product1 and product2 are dictionaries with the same schema
    common_keys = set(product1.keys()).intersection(set(product2.keys()))
    
    # Separate numeric and non-numeric keys
    numeric_keys = {key for key in common_keys if isinstance(product1[key], (int, float)) and isinstance(product2[key], (int, float))}
    non_numeric_keys = common_keys - numeric_keys
    
    # Calculate numeric similarity
    if numeric_keys:
        dot_product = sum(product1[key] * product2[key] for key in numeric_keys)
        magnitude1 = math.sqrt(sum(product1[key] ** 2 for key in numeric_keys))
        magnitude2 = math.sqrt(sum(product2[key] ** 2 for key in numeric_keys))
        
        if magnitude1 == 0 or magnitude2 == 0:
            numeric_similarity = 0.0
        else:
            numeric_similarity = dot_product / (magnitude1 * magnitude2)
    else:
        numeric_similarity = 0.0
    
    # Calculate non-numeric similarity
    if non_numeric_keys:
        string_similarities = [string_similarity(str(product1[key]), str(product2[key])) for key in non_numeric_keys]
        non_numeric_similarity = sum(string_similarities) / len(string_similarities)
    else:
        non_numeric_similarity = 0.0
    
    # Combine numeric and non-numeric similarities
    combined_similarity = (numeric_similarity + non_numeric_similarity) / 2
    return combined_similarity

def string_similarity(str1, str2):
    return SequenceMatcher(None, str1, str2).ratio()

# Load products from products.json
with open('../database/products.json', 'r') as file:
    products = json.load(file)

def get_name(obj):
    return obj.get('similarity_score')

from json_man import JSONManager
def get_similar_products(product_id: str, num_products = 5) -> list[str]:
    # Load similarity scores from JSON file
    sim_table = JSONManager('../database/similarity_scores.json').data
    products_with_id = [i for i in sim_table if i['product1_id'] == product_id or i['product2_id'] == product_id]

    sorted_products = sorted(products_with_id, key=lambda x: x['similarity_score'], reverse=True)
    return sorted_products[:num_products]
print(json.dumps(get_similar_products("Rolex Datejust Women", num_products=25), indent = 1))