import { log } from '@/constants';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { api } from '../utils/api';

export const useUserData = () => {
    const { userId, isSignedIn, getToken, isLoaded } = useAuth();
    const { user, isLoading, error, setUser, setLoading, setError, clearUser } =
        useUserStore();
    const { expoPushToken } = useNotification();
    const fetchUserData = useCallback(async () => {
        log.debug('Fetching user data');
        log.error('Expo push token: ', expoPushToken);
        if (!isLoaded) {
            log.warn('Auth is not loaded yet, skipping user data fetch');
            return;
        }
        if (isSignedIn && userId && !user && !isLoading) {
            setLoading(true);
            setError(null);

            try {
                const token = await getToken();
                log.info('User token: ', token);
                const userData = await api.getUserByClerkId(
                    userId,
                    token as string,
                );
                setUser(userData);
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Erro ao buscar dados do usuário';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        } else if (!isSignedIn) {
            clearUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, isSignedIn, isLoaded, getToken]);

    useEffect(() => {
        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn, userId]);

    return {
        user,
        isLoading,
        error,
        isSignedIn,
        fetchUserData,
    };
};
