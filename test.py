from lib.lib_jwt import sign_jwt, decode_jwt



def main():
    test = {
        'a': 'a',
        'b': 'b'
    }
    signed_string = (sign_jwt('test', test['a'], test['b']))
    print(decode_jwt(signed_string))

if __name__ == "__main__":
    main()



