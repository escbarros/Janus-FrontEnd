import { log } from '@/constants';
import { apiClient } from './config';

export const healthApi = {
    async healthCheck() {
        try {
            const response = await apiClient.get('/health');
            return response.data;
        } catch (error: any) {
            log.error('Health check failed', error);
            throw new Error('API health check failed');
        }
    },
};
