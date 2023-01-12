import axios from 'axios';

const http = axios.create({
    baseURL: 'https://dnsapi.cn',
    timeout: 0,
});

http.defaults.headers.common['Content-Type'] =
    'application/x-www-form-urlencoded';

http.interceptors.request.use((config) => {
    return config;
});
