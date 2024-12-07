import random

def get_promo_code():
    promo_word = ['SAVE', 'PROMO', 'DISCOUNT', 'OFFER', 'DEAL', 'SAVE']

    number = random.randint(1,9)*10
    return random.choice(promo_word) + str(number)