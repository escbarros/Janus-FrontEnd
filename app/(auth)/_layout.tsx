import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <View className="w-full h-full bg-slate-950">
            <LinearGradient
                colors={['transparent', '#34D399']}
                className="w-full h-3/4 absolute opacity-[0.2] bottom-0"
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
                    <Stack.Screen name="login" />
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="forgotPassword" />
                    <Stack.Screen name="changePassword" />
                </Stack>
            </SafeAreaProvider>
        </View>
    );
}
