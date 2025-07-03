import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import '../global.css';
import '../i18n';
SplashScreen.preventAutoHideAsync();

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
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
        </Stack>
    );
}
