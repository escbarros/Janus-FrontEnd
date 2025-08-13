export interface ApiError {
    message: string;
    statusCode?: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface CreateUserData {
    clerkId: string;
    name: string;
    email: string;
}

export type { EventResponse } from '@/types/event';

export interface DeviceThumbnailResponse {
    data: {
        imageUrl: string;
    };
}

export interface EventImageResponse {
    data: {
        imageUrl: string;
    };
}
