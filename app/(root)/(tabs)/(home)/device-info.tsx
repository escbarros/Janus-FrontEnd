import BackButton from '@/components/BackButton';
import IconButton from '@/components/IconButton';
import { images, log } from '@/constants';
import { useUserStore } from '@/store';
import { useDeviceStore } from '@/store/deviceStore';
import { useAuth } from '@clerk/clerk-expo';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronRight, Pencil, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const DeviceInfo = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useUserStore();
    const { getToken } = useAuth();
    const { getThumbnail, fetchThumbnail } = useDeviceStore();
    const [isLoading, setIsLoading] = useState(false);
    const [device, setDevice] = useState(() =>
        user?.devices.find((device) => device.serialNumber === id),
    );

    useEffect(() => {
        setDevice(user?.devices.find((device) => device.serialNumber === id));
    }, [user?.devices, id]);

    useEffect(() => {
        const loadThumbnail = async () => {
            if (!getThumbnail(id)) {
                setIsLoading(true);
                try {
                    const token = await getToken();
                    if (token) {
                        await fetchThumbnail(id, token);
                    }
                } catch (error) {
                    log.error('Error loading thumbnail:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadThumbnail();
    }, [id, getToken, fetchThumbnail, getThumbnail]);

    const thumbnail = getThumbnail(id);

    return (
        <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 160 }}
        >
            <View className="px-6 gap-10 pt-16">
                <View className="flex-row justify-between items-center">
                    <BackButton />
                    <Text className="color-white text-center text-xl font-extrabold">
                        {device?.nickname}
                    </Text>
                    <IconButton icon={Pencil} mode="secondary" iconSize={14} />
                </View>
                <TouchableOpacity
                    onPress={() =>
                        router.push(`/(root)/(tabs)/(home)/device-stream`)
                    }
                    className="w-full h-80 rounded-2xl bg-slate-700 overflow-hidden"
                >
                    {isLoading ? (
                        <View className="w-full h-full items-center justify-center">
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    ) : thumbnail ? (
                        <Image
                            source={{ uri: thumbnail }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : null}
                </TouchableOpacity>
                {/* EVENTS */}
                <View className="w-full gap-3">
                    <View className="w-full flex-row items-center justify-between">
                        <Text className="color-white text-lg font-semibold">
                            Últimos eventos
                        </Text>
                        <TouchableOpacity className="flex-row items-center gap-2 px-[6px] py-[2px] border-white border-[1px] rounded-md">
                            <Text className="color-white">Ver todos</Text>
                            <ChevronRight size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row items-center mt-4 justify-evenly">
                        <View className="items-center flex-1">
                            <Text className="color-slate-200 text-lg font-semibold">
                                Nenhum evento
                            </Text>
                            <Text className="color-slate-300 text-center w-5/6 text-sm">
                                Os eventos de seus dispositivos aparecerão aqui
                                quando forem disparados
                            </Text>
                        </View>
                        <Image
                            source={images.noEvents}
                            className="mb-8 h-20 w-20"
                        />
                    </View>
                </View>
                {/* RECORDINGS */}
                <View className="w-full gap-3">
                    <View className="w-full items-start justify-center">
                        <Text className="color-white text-lg font-semibold">
                            Histórico de Conversas
                        </Text>
                        <Text className="color-slate-300 text-sm font-regular">
                            Todas as conversas serão salvas junto com o áudio,
                            video e transcrição para poderem ser acessadas
                            posteriormente
                        </Text>
                    </View>
                    <View className="flex-row items-center mt-4 justify-evenly">
                        <Image
                            source={images.noRecordings}
                            className="mb-8 h-24 w-24"
                        />
                        <View className="items-center flex-1">
                            <Text className="color-slate-200 text-lg font-semibold">
                                Nenhuma gravação
                            </Text>
                            <Text className="color-slate-300 text-center w-5/6 text-sm">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Corporis, ex.
                            </Text>
                        </View>
                    </View>
                </View>
                {/* USERS */}
                <View className="w-full gap-3">
                    <View className="w-full flex-row items-center justify-between">
                        <Text className="color-white text-lg font-semibold">
                            Pessoas
                        </Text>
                        <TouchableOpacity className="flex-row items-center gap-2 px-[6px] py-[2px] border-white border-[1px] rounded-md">
                            <Text className="color-white">Adicionar</Text>
                            <Plus size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default DeviceInfo;
