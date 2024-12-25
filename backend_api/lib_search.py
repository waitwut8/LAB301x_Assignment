from jsonata import Jsonata
def search(query, data):
    expr = Jsonata(query)
    return expr.evaluate(data)

