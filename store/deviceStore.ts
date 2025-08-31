import { api } from '@/utils/api';
import { create } from 'zustand';

interface DeviceStore {
    thumbnails: Record<string, string>;
    setThumbnail: (serialNumber: string, uri: string) => void;
    getThumbnail: (serialNumber: string) => string | undefined;
    fetchThumbnail: (serialNumber: string, token: string) => Promise<string>;
}

export const useDeviceStore = create<DeviceStore>((set, get) => ({
    thumbnails: {},
    setThumbnail: (serialNumber, uri) => {
        set((state) => ({
            thumbnails: {
                ...state.thumbnails,
                [serialNumber]: uri,
            },
        }));
    },
    getThumbnail: (serialNumber) => {
        return get().thumbnails[serialNumber];
    },
    fetchThumbnail: async (serialNumber: string, token: string) => {
        const cached = get().thumbnails[serialNumber];
        if (cached) return cached;

        const thumbnailUri = await api.getDeviceThumbnail(serialNumber, token);
        get().setThumbnail(serialNumber, thumbnailUri);
        return thumbnailUri;
    },
}));
