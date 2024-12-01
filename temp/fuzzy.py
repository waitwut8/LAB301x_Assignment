
from thefuzz import fuzz

import json

def get_Score(str1: str, str2: str):
    return fuzz.partial_ratio(str1, str2) if type(str1)==str and type(str2)==str else -1

def best_of_score(str1: str, list_of_str: list):
    best_of_10 = {}
    scores = {}
    for i in list_of_str:
        if type(i) == str and str1:
            score = get_Score(str1, i)
            scores[i] = score

        sorted_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)

    best_of_1 = sorted_scores[0] if len(sorted_scores) > 0 else {}
    best_of_5 = sorted_scores[:5] if len(sorted_scores) > 4 else {}
    if len(sorted_scores) > 9:
        best_of_10 = sorted_scores[:10]

    return {"best_of_1": best_of_1, "best_of_5": best_of_5, "best_of_10": best_of_10}
    
with open('database/products.json', 'r') as f:
    data = f.read()
data = json.loads(data)
names = []
for i in data:
    names.append(i['title'])
def main():
    print(best_of_score('hello', data))
main()