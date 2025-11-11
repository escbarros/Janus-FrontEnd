import HomepageCarrousel from '@/components/HomepageCarrousel';
import IconButton from '@/components/IconButton';
import NoDevices from '@/components/NoDevices';
import { useUserStore } from '@/store';
import { useUser } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { LayoutPanelTop, Plus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';

interface Devices {
    serialNumber: string;
    nickname: string;
}

const Homepage = () => {
    const { user: clerkUser } = useUser();
    const { user } = useUserStore();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            setRefreshKey((prev) => prev + 1);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    };

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#34d399" />
            </View>
        );
    }
    return (
        <ScrollView
            className="w-full h-full"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerClassName="flex-1"
            contentContainerStyle={{ paddingBottom: 160 }}
        >
            <View className="w-full h-full gap-5 pt-16">
                <View className="w-100 flex-row items-center space-between px-6">
                    <View className="flex-row items-center gap-4 flex-1">
                        {clerkUser?.imageUrl ? (
                            <Image
                                source={{ uri: clerkUser.imageUrl }}
                                className="h-12 w-12 rounded-full"
                            />
                        ) : (
                            <View className="h-12 w-12 rounded-full bg-gray-400" />
                        )}
                        <Text className="color-white text-2xl">
                            Olá,{' '}
                            <Text className="font-bold">
                                {user?.name.split(' ')[0] || 'User'}
                            </Text>
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-4 justify-end">
                        <IconButton
                            icon={Plus}
                            onPress={() =>
                                router.push(`/(root)/(tabs)/(home)/(setup)`)
                            }
                        ></IconButton>
                        <IconButton
                            mode="tertiary"
                            icon={LayoutPanelTop}
                        ></IconButton>
                    </View>
                </View>
                {user?.devices.length === 0 ? (
                    <NoDevices />
                ) : (
                    <View className="w-full h-full">
                        <HomepageCarrousel
                            items={user?.devices as Devices[]}
                            refreshKey={refreshKey > 0 ? refreshKey : undefined}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default Homepage;
