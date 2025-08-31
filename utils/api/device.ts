import { log } from '@/constants';
import { apiClient } from './config';

export const deviceApi = {
    async getDeviceThumbnail(
        serialNumber: string,
        token: string,
    ): Promise<string> {
        try {
            const response = await apiClient.get(
                `/device/thumbnail/${serialNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data.url;
        } catch (error: any) {
            log.error('Failed to fetch device thumbnail', error);
            throw error;
        }
    },
};
