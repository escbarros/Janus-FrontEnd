import { log } from '@/constants';
import axios from 'axios';

const API_BASE_URL = __DEV__
    ? 'http://192.168.0.225:3000'
    : 'https://your-production-api.com';

export const api = {
    async createUser(userData: {
        clerkId: string;
        name: string;
        email: string;
    }) {
        log.info('Creating user with data:', userData);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/users`,
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            log.error('Failed to create user', error);
            throw new Error(
                error.response?.data?.error || 'Failed to create user',
            );
        }
    },
    async getDeviceThumbnail(serialNumber: string, token: string) {
        log.info('Fetching device thumbnail for serial number:', serialNumber);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/devices/thumbnail/${serialNumber}/url`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            return response.data.data.imageUrl;
        } catch (error: any) {
            log.error('Failed to fetch device thumbnail', error);
            throw new Error(
                error.response?.data?.error ||
                    'Failed to fetch device thumbnail',
            );
        }
    },
    async getUserByClerkId(clerkId: string, token?: string) {
        log.info('Fetching user data for clerkId:', clerkId);
        try {
            const response = await axios.get(
                `${API_BASE_URL}/users/auth/${clerkId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            log.error('Failed to fetch user data', error);
            throw new Error(
                error.response?.data?.error || 'Failed to fetch user data',
            );
        }
    },
    async healthCheck() {
        try {
            const response = await axios.get(`${API_BASE_URL}/health`);
            return response.data;
        } catch (error: any) {
            log.error('Health check failed', error);
            throw new Error('API health check failed');
        }
    },
};

export { API_BASE_URL };
