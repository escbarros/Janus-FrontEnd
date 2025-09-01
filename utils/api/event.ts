import { log } from '@/constants';
import { apiClient } from './config';
import { EventResponse } from './types';

export const eventApi = {
    async getUserEvents(
        userId: string,
        token: string,
    ): Promise<EventResponse[]> {
        console.log('Fetching user events for userId:', userId);
        try {
            const response = await apiClient.get(`/events/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            log.error('Failed to fetch user events', error);
            throw error;
        }
    },

    async getEventImage(id: string, token: string): Promise<string> {
        try {
            const response = await apiClient.get(`/events/thumbnail/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.url;
        } catch (error: any) {
            log.error('Failed to fetch event image', error);
            throw error;
        }
    },

    async markEventAsRead(eventId: string) {
        console.log('Marking event as read:', eventId);
        try {
            const response = await apiClient.patch(
                `/events/${eventId}/read`,
                {},
            );
            return response;
        } catch (error: any) {
            log.error('Failed to mark event as read', error);
            throw error;
        }
    },
};
