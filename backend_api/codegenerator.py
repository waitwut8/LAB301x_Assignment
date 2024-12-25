import random

def get_promo_code():
    promo_word = ['SAVE', 'PROMO', 'DISCOUNT', 'OFFER', 'DEAL']

    number = random.randint(1,5)*random.randint(1,5)
    return random.choice(promo_word) + str(number)