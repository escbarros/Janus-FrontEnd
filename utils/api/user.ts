import { log } from '@/constants';
import { apiClient } from './config';

export const userApi = {
    async getUserByClerkId(clerkId: string, token?: string) {
        log.info('Fetching user data for clerkId:', clerkId);
        try {
            const response = await apiClient.get(`/user/auth`, {
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
