import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return (
            <View className="flex-1 justify-center items-center bg-black">
                <ActivityIndicator size="large" color="#34d399" />
            </View>
        );
    }

    if (isSignedIn) {
        return <Redirect href="/(root)" />;
    }

    return <Redirect href="/(auth)/login" />;
}
