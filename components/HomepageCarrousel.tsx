import { api } from '@/utils/api/index';
import { useAuth } from '@clerk/clerk-expo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BatteryFull, Cog, Wifi } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
const width = Dimensions.get('screen').width;
interface Device {
    serialNumber: string;
    name: string;
}

interface HomepageCarrouselProps {
    items: Device[];
    refreshKey?: number;
}

const HomepageCarrouselItem = ({
    item,
    refreshKey,
}: {
    item: Device;
    refreshKey?: number;
}) => {
    const { getToken } = useAuth();
    const [imageUri, setImageUri] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchThumbnail = useCallback(async () => {
        try {
            setIsLoading(true);
            setImageUri('');
            const token = await getToken();
            if (token) {
                const thumbnailUri = await api.getDeviceThumbnail(
                    item.serialNumber,
                    token,
                );
                setImageUri(thumbnailUri);
            }
        } catch (error) {
            console.error('Error fetching device thumbnail:', error);
        } finally {
            setIsLoading(false);
        }
    }, [item.serialNumber, getToken]);

    useEffect(() => {
        fetchThumbnail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (refreshKey && refreshKey > 0) {
            fetchThumbnail();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshKey]);

    const handleDevicePress = () => {
        router.push(
            `/(root)/(tabs)/(home)/device-info?id=${item.serialNumber}`,
        );
    };

    return (
        <View
            style={{ width: width - 48 }}
            className="h-[300px] bg-slate-700 rounded-3xl overflow-hidden"
        >
            {isLoading ? (
                <View className="w-full h-full items-center justify-center ">
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : imageUri ? (
                <TouchableOpacity
                    className="w-full h-full border-slate-800 border-2 rounded-3xl overflow-hidden relative"
                    onPress={handleDevicePress}
                >
                    <Image
                        key={item.serialNumber}
                        source={{ uri: imageUri }}
                        className="w-full h-full"
                    />
                    <View className="w-full absolute bottom-0 left-0 h-[100px] ">
                        <LinearGradient
                            colors={['transparent', '#000000']}
                            locations={[0.1, 0.95]}
                            className="w-full h-full absolute bottom-0"
                        />
                        <View className="w-full h-[100px] justify-between items-end p-3 pt-0 flex-row">
                            <View className="flex-row items-center gap-2">
                                <View className="p-1 rounded-full bg-slate-700">
                                    <MaterialCommunityIcons
                                        name="doorbell-video"
                                        size={24}
                                        color="white"
                                    />
                                </View>
                                <View className="items-start justify-between">
                                    <Text className="text-white font-bold text-lg">
                                        {item.name}
                                    </Text>
                                    <View className="flex-row gap-1 items-start">
                                        <BatteryFull
                                            color={'white'}
                                            size={12}
                                        />
                                        <Wifi color={'white'} size={12} />
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity className="bg-emerald-400 h-9 w-9 items-center justify-center rounded-full">
                                <Cog color="white" size={16} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            ) : (
                <View className="w-full h-full items-center justify-center">
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            )}
        </View>
    );
};

const HomepageCarrousel = ({ items, refreshKey }: HomepageCarrouselProps) => {
    return (
        <View className="w-100 items-center justify-center gap-3">
            {items.length > 0 && (
                <HomepageCarrouselItem
                    item={items[0]}
                    refreshKey={refreshKey}
                />
            )}
        </View>
    );
};

export default HomepageCarrousel;
