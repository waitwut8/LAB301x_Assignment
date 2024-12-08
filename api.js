import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    } // our API base URL
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
    (config) => {
        // const token = document.cookie.split("=")[1];
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API endpoints
export const getProducts = () => {
    return api.get('/products');
};
export const login = (user, pass) => {
    console.log("login")
    return api.post('/login', { username: user, password: pass });
}

export const logout = () => {
    localStorage.removeItem('token');
}
export default api;