import { log } from '@/constants';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api';

export async function registerForPushNotificationsAsync(
    getToken: () => Promise<string | null>,
) {
    log.debug('registering for notifications');
    if (Platform.OS === 'android') {
        Notifications.setNotificationCategoryAsync('invite', [
            {
                identifier: 'ACCEPT',
                buttonTitle: 'Aceitar',
                options: { opensAppToForeground: true },
            },
            {
                identifier: 'DECLINE',
                buttonTitle: 'Recusar',
                options: { opensAppToForeground: false },
            },
        ]);

        Notifications.addNotificationResponseReceivedListener(
            async (response) => {
                const actionId = response.actionIdentifier;
                const notificationId = response.notification.request.identifier;
                const inviteId = response.notification.request.content.data
                    ?.inviteId as string;

                const token = await getToken();
                if (!token) return;
                try {
                    if (actionId === 'ACCEPT') {
                        await api.acceptInvite(inviteId, token);
                    } else if (actionId === 'DECLINE') {
                        await api.rejectInvite(inviteId, token);
                    }

                    await Notifications.dismissNotificationAsync(
                        notificationId,
                    );
                } catch (error) {
                    console.error('Error dismissing notification:', error);
                }
            },
        );
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    log.info('isDevice:', Device.isDevice);
    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        log.info('existingStatus:', existingStatus);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            throw new Error(
                'Permission not granted to get push token for push notification!',
            );
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
        if (!projectId) {
            log.error('Project ID not found');
            throw new Error('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            return pushTokenString;
        } catch (e: unknown) {
            throw new Error(`${e}`);
        }
    } else {
        throw new Error('Must use physical device for push notifications');
    }
}
