import axios from 'axios';

const http = axios.create({
    baseURL: 'https://dnsapi.cn',
    timeout: 0,
});

http.interceptors.request.use((config) => {
    config.headers = {
        ...config.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    return config;
});

export default http;
