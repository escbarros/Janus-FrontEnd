import BackButton from '@/components/BackButton';
import EventCard from '@/components/EventCard';
import IconButton from '@/components/IconButton';
import { useUserStore } from '@/store';
import { useLocalSearchParams } from 'expo-router';
import { ChevronRight, Pencil } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const DeviceInfo = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useUserStore();
    const [device] = useState(() =>
        user?.devices.find((device) => device.serialNumber === id),
    );

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
                        {device?.name}
                    </Text>
                    <IconButton icon={Pencil} mode="secondary"></IconButton>
                </View>
                <View className="w-full h-80 rounded-2xl bg-slate-700"></View>
                <View className="w-full gap-3">
                    <View className="w-full flex-row items-center justify-between">
                        <Text className="color-white text-lg font-semibold">
                            Últimos eventos:
                        </Text>
                        <TouchableOpacity className="flex-row items-center gap-2 px-[6px] py-[2px] border-white border-[1px] rounded-md">
                            <Text className="color-white">Ver todos</Text>
                            <ChevronRight size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View className="gap-1">
                        <EventCard showDeviceName={false} showBackground />
                        <EventCard
                            showDeviceName={false}
                            showBackground
                            type="door-locked"
                        />
                        <EventCard
                            showDeviceName={false}
                            showBackground
                            type="doorbell"
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default DeviceInfo;
