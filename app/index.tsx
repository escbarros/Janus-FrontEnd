import { useMqtt } from '@/context/MqttContext';
import { useUserData } from '@/hooks';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const { isSignedIn, isLoaded } = useAuth();
    const { isLoading: isLoadingUserData } = useUserData();
    const { connect, disconnect } = useMqtt();

    useEffect(() => {
        if (isSignedIn) {
            connect('usuario', 'Senha@123');
        } else {
            disconnect();
        }
    }, [isSignedIn]);

    if (!isLoaded || (isSignedIn && isLoadingUserData)) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#34d399" />
            </View>
        );
    }

    if (isSignedIn) {
        return <Redirect href="/(root)/(tabs)/(home)" />;
    }

    return <Redirect href="/(auth)/login" />;
}
