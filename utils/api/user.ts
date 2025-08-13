import { log } from '@/constants';
import { apiClient } from './config';
import { CreateUserData } from './types';

export const userApi = {
    async createUser(userData: CreateUserData) {
        log.info('Creating user with data:', userData);
        try {
            const response = await apiClient.post('/users', userData);
            return response.data;
        } catch (error: any) {
            log.error('Failed to create user', error);
            throw error;
        }
    },

    async getUserByClerkId(clerkId: string, token?: string) {
        log.info('Fetching user data for clerkId:', clerkId);
        try {
            const response = await apiClient.get(`/users/auth/${clerkId}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            return response.data;
        } catch (error: any) {
            log.error('Failed to fetch user data', error);
            throw error;
        }
    },
};
