import {login, getProducts, logout} from './api.js'
import 'regenerator-runtime/runtime';

// document.getElementById('button').addEventListener('click', async () => {

//     console.log('Button clicked');
//     getProducts()
// })

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('user').value;
    const password = document.getElementById('password').value;
    console.log(username)
    login(username, password).then((res) => {
        console.log(res.data)
        localStorage.setItem('token', res.data['access_token'])
    }).catch((err) => {
        console.log(err)
    })
    getProducts().then((res) => {
        console.log(res.data)
        logout()
    }).catch((err) => {
        console.log(err)
    })
    
})