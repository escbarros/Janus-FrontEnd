import { log } from '@/constants';
import { apiClient } from './config';

export interface Message {
    id: string;
    callId: string;
    text: string;
    origin: 'USER' | 'DEVICE';
    createdAt: string;
}

export interface Call {
    id: string;
    deviceSerialNumber: string;
    startedAt: string;
    endedAt: string | null;
    status: 'ACTIVE' | 'FINISHED';
    messages: Message[];
    videoUrl?: string;
}

export const callApi = {
    async startCall(serialNumber: string, token: string): Promise<any> {
        try {
            const response = await apiClient.post(
                `/call/${serialNumber}/start`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data.id;
        } catch (error: any) {
            log.error('Failed to start call', error);
            throw error;
        }
    },

    async endCall(serialNumber: string, token: string): Promise<any> {
        try {
            const response = await apiClient.post(
                `/call/${serialNumber}/stop`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data.id;
        } catch (error: any) {
            log.error('Failed to end call', error);
            throw error;
        }
    },

    async getDeviceCall(serialNumber: string, token: string): Promise<Call[]> {
        try {
            const response = await apiClient.get(
                `/call/device/${serialNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return response.data;
        } catch (error: any) {
            log.error('Failed to start call', error);
            throw error;
        }
    },

    async getCallDetail(callId: string, token: string): Promise<Call> {
        try {
            const response = await apiClient.get(`/call/${callId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            log.error('Failed to start call', error);
            throw error;
        }
    },
};
