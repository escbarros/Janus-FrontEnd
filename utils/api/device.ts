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

    async changeDeviceNickname(
        serialNumber: string,
        token: string,
        nickname: string,
    ): Promise<any> {
        try {
            const response = await apiClient.patch(
                `/device/nickname/${serialNumber}`,
                { nickname },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            log.error('Failed to patch device nickname', error);
            throw error;
        }
    },

    async getAccesses(deviceId: string, token: string): Promise<any[]> {
        try {
            const response = await apiClient.get(`/device/access/${deviceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            log.error('Failed to fetch device accesses', error);
            throw error;
        }
    },
};
