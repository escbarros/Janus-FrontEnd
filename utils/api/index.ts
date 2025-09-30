import { callApi } from './call';
import { deviceApi } from './device';
import { eventApi } from './event';
import { healthApi } from './health';
import { userApi } from './user';

export * from './call';
export * from './config';
export * from './device';
export * from './event';
export * from './health';
export * from './types';
export * from './user';

export const api = {
    ...healthApi,
    ...userApi,
    ...deviceApi,
    ...eventApi,
    ...callApi,
};
