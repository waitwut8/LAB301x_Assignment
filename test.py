import requests
r = (requests.post('https://dummyjson.com/auth/login', json={'username': 'emilys', 'password': 'emilyspass'}).json()['accessToken'])
print(r)
t = requests.get('https://dummyjson.com/auth/me', headers={'Authorization': f'Bearer {r}'})
print(t.json())