import axios from 'axios';
import {useAuthStore} from '@/stores/authStore';

// const baseUrl = 'https://api.takasimo.com/api/';
 const baseUrl = 'https://ap1.takasimo.com/api'

const api = axios.create({
    baseURL: baseUrl
})

api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default api;