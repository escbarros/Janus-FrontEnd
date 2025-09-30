import { images } from '@/constants';
import { api, Call } from '@/utils/api';
import { useAuth } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const NoRecordings = () => {
    return (
        <View className="flex-row items-center mt-4 justify-evenly">
            <Image source={images.noRecordings} className="mb-8 h-24 w-24" />
            <View className="items-center flex-1">
                <Text className="color-slate-200 text-lg font-semibold">
                    Nenhuma gravação
                </Text>
                <Text className="color-slate-300 text-center w-5/6 text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Corporis, ex.
                </Text>
            </View>
        </View>
    );
};

const RecordingItem = ({ item }: { item: Call }) => {
    const date = new Date(item.startedAt);
    const formattedDate = date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const start = new Date(item.startedAt);
    const end = new Date(item.endedAt || '');
    const durationInSeconds = Math.round(
        (end.getTime() - start.getTime()) / 1000,
    );

    const handlePress = () => {
        router.push(`/(root)/(tabs)/(home)/(call)/${item.id}`);
    };

    return (
        <TouchableOpacity
            className="px-3 py-4 flex-row items-center gap-2 relative w-full"
            onPress={handlePress}
        >
            <View className="w-12 h-12 rounded-lg bg-red-200"></View>
            <View className="flex-col items-start align-start gap-1">
                <Text className="color-slate-300 font-medium text-base">
                    {formattedDate}
                </Text>
                <Text className="color-slate-400 font-light">
                    {durationInSeconds} segundos
                </Text>
            </View>
            <View className="absolute right-2">
                <ChevronRight color="#94a3b8" size={14} />
            </View>
        </TouchableOpacity>
    );
};

const RecordingList = () => {
    const [calls, setCalls] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchCalls = async () => {
            try {
                setIsLoading(true);
                const token = await getToken();

                if (!token) {
                    console.error('No token available');
                    return;
                }

                const response = await api.getDeviceCall(
                    '0fa98c5e-aaa0-427a-89e0-283cbb47a25f',
                    token,
                );
                setCalls(response.filter((r) => r.endedAt != null));
            } catch (error) {
                console.error('Failed to fetch calls:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCalls();
    }, [getToken]);
    if (calls.length === 0) return <NoRecordings />;
    return (
        <FlatList
            data={calls}
            renderItem={({ item }) => <RecordingItem item={item} />}
            keyExtractor={(item) => item.id}
            className="w-full bg-slate-900 rounded-xl max-h-72"
            contentContainerStyle={{ paddingBottom: 32, maxHeight: 288 }}
            ListEmptyComponent={NoRecordings}
            nestedScrollEnabled
        />
    );
};

export default RecordingList;
