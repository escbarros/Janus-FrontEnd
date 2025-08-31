import axios from 'axios';
import * as Device from 'expo-device';

export const API_BASE_URL = __DEV__
    ? Device.isDevice
        ? 'http://192.168.0.117:3000/api/v1'
        : 'http://10.0.2.2:3000/api/v1'
    : 'https://your-production-api.com';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        throw new Error(errorMessage);
    },
);
