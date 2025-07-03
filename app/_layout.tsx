import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { useEffect } from 'react';
import '../global.css';
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        'Baloo2-Regular': require('../assets/fonts/Baloo2-Regular.ttf'),
        'Baloo2-Medium': require('../assets/fonts/Baloo2-Medium.ttf'),
        'Baloo2-SemiBold': require('../assets/fonts/Baloo2-SemiBold.ttf'),
        'Baloo2-Bold': require('../assets/fonts/Baloo2-Bold.ttf'),
        'Baloo2-ExtraBold': require('../assets/fonts/Baloo2-ExtraBold.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }
    return <Stack />;
}
