import { log } from '@/constants';
import { api } from '@/utils/api';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { LogOut, Pencil } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const Settings = () => {
    const { user } = useUser();
    const { signOut, getToken } = useAuth();

    const handleSignOut = async () => {
        try {
            log.debug('Signing out...');
            const token = await getToken();
            if (!token) return;

            await api.removeUserNotificationToken(token);

            await signOut();
            router.replace('/(auth)/login');
        } catch (error) {
            log.error('Error signing out:', error);
        }
    };
    return (
        <View className="w-full h-full bg-transparent gap-6">
            <Text className="color-white w-100 text-center text-2xl font-bold">
                Settings
            </Text>
            <View className="w-full flex-row space-between items-center bg-emerald-400/15 border-2 border-emerald-400 p-6 rounded-xl">
                <View className="flex-row flex-1 items-center gap-3">
                    <Image
                        className="w-16 h-16 rounded-full "
                        source={{ uri: user?.imageUrl }}
                    ></Image>
                    <Text className="color-white font-bold text-2xl">
                        {user?.fullName}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        router.push('/(root)/(tabs)/(settings)/edit-profile')
                    }
                >
                    <Pencil color={'white'} size={16} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                className="flex-row items-center gap-3 w-full"
                onPress={handleSignOut}
            >
                <View className="w-10 h-10 rounded-lg bg-red-500/15 border-[1px] border-red-500 items-center justify-center">
                    <LogOut size={16} color={'#ef4444'} />
                </View>
                <Text className="font-semibold color-red-500 text-xl">
                    Sair
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Settings;
