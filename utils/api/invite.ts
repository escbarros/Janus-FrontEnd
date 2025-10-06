import { log } from '@/constants';
import { InviteDetails } from '@/types/invite';
import { apiClient } from './config';

export const inviteApi = {
    async acceptInvite(inviteId: string, token: string) {
        try {
            const response = await apiClient.post(
                `/invite/${inviteId}/accept`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            log.error('Failed to accept invite', error);
            throw error;
        }
    },

    async rejectInvite(inviteId: string, token: string) {
        try {
            const response = await apiClient.post(
                `/invite/${inviteId}/reject`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            log.error('Failed to reject invite', error);
            throw error;
        }
    },

    async getInvite(inviteId: string, token: string): Promise<InviteDetails> {
        try {
            const response = await apiClient.get(`/invite/${inviteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            log.error('Failed to get invite', error);
            throw error;
        }
    },
};
