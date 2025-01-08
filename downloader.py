from backend_api.json_man import JSONManager
from backend_api.lib_search import search
import requests
# from alive_progress import alive_bar
products = JSONManager("database/products.json").data
images = search("$.images", products)
folders = []
session = requests.Session()
# note: very large list

# for product in products:
#     for idx,image in enumerate(product["images"]):
#         image_name = product["title"].replace(" ", "_")

for image in images:
    org_image = image
    image = image.replace("%20", "_").split("/")
    file_name = f"{image[-2]}_{image[-1]}"
    try:
        resp = session.get(org_image)
        print(f"Downloading {file_name}")
        open(f"images/{file_name}", "wb").write(resp.content)
    except Exception as e:
        print(e)
#     folder_array = i.split("/")[6:8]
    
# for i in images:
#     folder_array = i.split("/")[6:8]
#     folder_array[0] = folder_array[0].replace("%20", "_")
#     folder = f"{folder_array[0]}_{folder_array[1]}"
#     folders.append(folder)

# with alive_bar(len(images)) as bar:
#     for i in range(len(images)):
#         image = images[i]
#         folder = folders[i]
#         response = session.get(image)
#         with open(f"images/{folder}", "wb") as file:
#             file.write(response.content)
        
#         bar()

# {
#         "id": "97d22b8b-b724-4ce1-bf92-b4125a5966be",
#         "title": "Essence Mascara Lash Princess",
#         "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
#         "category": "beauty",
#         "price": 9.99,
#         "discountPercentage": 7.17,
#         "stock": 5,
#         "tags": [
#             "beauty",
#             "mascara"
#         ],
#         "brand": "Essence",
#         "weight": 2,
#         "dimensions": {
#             "width": 23.17,
#             "height": 14.43,
#             "depth": 28.01
#         },
#         "warrantyInformation": "1 month warranty",
#         "shippingInformation": "Ships in 1 month",
#         "availabilityStatus": "Low Stock",
#         "returnPolicy": "30 days return policy",
#         "minimumOrderQuantity": 24,
#         "images": [
#             "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"
#         ],
#         "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
#     },