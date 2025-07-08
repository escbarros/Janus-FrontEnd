import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <View className="w-full h-full bg-slate-950">
            <LinearGradient
                colors={['transparent', '#047857']}
                start={{ x: -0.1, y: 0.6 }}
                locations={[0.1, 0.95]}
                className="w-full h-3/4 absolute opacity-[0.2] bottom-0"
            />
            <LinearGradient
                colors={['#047857', 'transparent']}
                locations={[0.1, 0.8]}
                start={{ x: -0.5, y: -0.9 }}
                className="w-full h-3/4 absolute opacity-[0.2] top-0"
            />
            <SafeAreaProvider className="w-full h-full bg-transparent">
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: 'transparent',
                            paddingVertical: 64,
                            paddingHorizontal: 24,
                        },
                    }}
                >
                    <Stack.Screen name="(tabs)" />
                </Stack>
            </SafeAreaProvider>
        </View>
    );
}
