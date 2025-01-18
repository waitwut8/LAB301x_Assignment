from urllib.parse import urlparse

def make_relative(url):
    url = url.replace("%20", "_")
    img_url = url.split("/")[-2:]
    return (f"assets/images/{img_url[0]}_{img_url[1]}")

from backend_api.json_man import JSONManager
prod_man = JSONManager("database/products.json")
products = prod_man.data
for i in products:
    index = products.index(i)
    i["thumbnail"] = make_relative(i["thumbnail"])
    for j in i["images"]:
        i["images"][i["images"].index(j)] = make_relative(j)
    products[index] = i

prod_man.data = products
print("saving")
prod_man.dump_json()



# print(relative_images)