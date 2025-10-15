import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    name: string;
    devices: any[];
    events: any[];
}

interface UserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: User) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearUser: () => void;
    updateDeviceNickname: (serialNumber: string, nickname: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    setUser: (user) => set({ user, error: null }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearUser: () => set({ user: null, error: null, isLoading: false }),
    updateDeviceNickname: (serialNumber: string, nickname: string) => {
        set((state) => {
            if (!state.user) return state;

            const updatedDevices = state.user.devices.map((device) =>
                device.serialNumber === serialNumber
                    ? { ...device, nickname }
                    : device,
            );

            return {
                ...state,
                user: {
                    ...state.user,
                    devices: updatedDevices,
                },
            };
        });
    },
}));
