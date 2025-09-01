import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { PortalProvider } from '@gorhom/portal';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '../global.css';
import '../i18n';

import { MqttProvider } from '@/context/MqttContext';
import { NotificationProvider } from '@/context/NotificationContext';
import * as Notifications from 'expo-notifications';
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
    }),
});

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
        'Baloo2-Medium': require('../assets/fonts/Baloo2-Medium.ttf'),
        'Baloo2-SemiBold': require('../assets/fonts/Baloo2-SemiBold.ttf'),
        'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
        'Baloo2-ExtraBold': require('../assets/fonts/Baloo2-ExtraBold.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <ClerkProvider
            tokenCache={tokenCache}
            publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <GestureHandlerRootView className="flex-1">
                <PortalProvider>
                    <NotificationProvider>
                        <MqttProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="index" />
                                <Stack.Screen name="(auth)" />
                                <Stack.Screen name="(root)" />
                            </Stack>
                        </MqttProvider>
                    </NotificationProvider>
                    <StatusBar barStyle={'light-content'} />
                </PortalProvider>
            </GestureHandlerRootView>
        </ClerkProvider>
    );
}
