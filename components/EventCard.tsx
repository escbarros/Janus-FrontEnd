import { EventType } from '@/types/event';
import { formatDateTime } from '@/utils';
import { api } from '@/utils/api/index';
import { useAuth } from '@clerk/clerk-expo';
import BottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import {
    BellElectric,
    ChevronRight,
    DoorClosedLocked,
    DoorOpen,
    Link,
    MailPlus,
    SendHorizontal,
    UserPlus,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DoorbellBottomSheet from './DoorbellBottomSheet';
import InviteReceivedBottomSheet from './InviteReceivedBottomSheet';

export interface EventCardProps {
    id: string;
    type?: EventType;
    datetime?: string;
    deviceName?: string;
    deviceId: string | undefined;
    isNewNotification?: boolean;
    showUserEventEmitter?: boolean;
    showDeviceName?: boolean;
    showBackground?: boolean;
}

const EVENT_CONFIG = {
    DOOR_UNLOCKED: {
        color: 'bg-green-600',
        bgColor: 'bg-green-600/25',
        icon: <DoorOpen size={24} color="#fff" />,
        text: 'Porta destrancada',
        openBottomSheet: false,
    },
    DOOR_LOCKED: {
        color: 'bg-violet-700',
        bgColor: 'bg-violet-700/25',
        icon: <DoorClosedLocked size={24} color="#fff" />,
        text: 'Porta trancada',
        openBottomSheet: false,
    },
    DOORBELL: {
        color: 'bg-sky-400',
        bgColor: 'bg-sky-400/25',
        icon: <BellElectric size={24} color="#fff" />,
        text: 'Alguém está na porta',
        openBottomSheet: true,
    },
    INVITE_RECEIVED: {
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-500/25',
        icon: <MailPlus size={24} color="#fff" />,
        text: 'Convite recebido',
        openBottomSheet: true,
    },
    INVITE_SENT: {
        color: 'bg-orange-400',
        bgColor: 'bg-orange-400/25',
        icon: <SendHorizontal size={24} color="#fff" />,
        text: 'Convite enviado',
        openBottomSheet: false,
    },
    INVITE_ACCEPTED: {
        color: 'bg-teal-500',
        bgColor: 'bg-teal-500/25',
        icon: <UserPlus size={24} color="#fff" />,
        text: 'Convite aceito',
        openBottomSheet: false,
    },
    LINK_INVITE: {
        color: 'bg-pink-500',
        bgColor: 'bg-pink-500/25',
        icon: <Link size={24} color="#fff" />,
        text: 'Link de convite criado',
        openBottomSheet: false,
    },
};

const EventCard = ({
    id,
    type = 'DOOR_UNLOCKED',
    datetime = Date.now().toString(),
    deviceName,
    deviceId,
    isNewNotification = false,
    showUserEventEmitter = true,
    showDeviceName = true,
    showBackground = false,
}: EventCardProps) => {
    const config = EVENT_CONFIG[type];
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { getToken } = useAuth();
    const cardBg =
        isNewNotification || showBackground ? config.bgColor : 'bg-transparent';
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const onPressEvent = () => {
        if (config.openBottomSheet) {
            bottomSheetRef.current?.expand();
        }
    };

    const fetchEventImage = useCallback(async () => {
        try {
            setImageUrl(null);
            const token = await getToken();
            if (token) {
                const thumbnailUri = await api.getEventImage(id, token);
                setImageUrl(thumbnailUri);
            }
        } catch (error) {
            console.error('Error fetching device thumbnail:', error);
        }
    }, [id, getToken]);

    useEffect(() => {
        if (type === 'DOORBELL') {
            fetchEventImage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TouchableOpacity
                activeOpacity={config.openBottomSheet ? 0.5 : 1}
                onPress={onPressEvent}
                className={`w-full rounded-xl flex-row px-4 py-3 ${cardBg} items-center justify-start h-[87px] gap-3`}
            >
                <View
                    className={`h-12 w-12 rounded-lg ${config.color} relative items-center justify-center`}
                >
                    {isNewNotification && (
                        <View className="absolute rounded-full bg-red-400 w-4 h-4 -right-2 -top-1 border-slate-950 border-2"></View>
                    )}
                    {config.icon}
                </View>
                <View className="justify-between flex-1 gap-2">
                    {showDeviceName ? (
                        <Text className="color-white font-light text-xs">
                            {deviceName || 'Dispositivo'}
                        </Text>
                    ) : (
                        <View className="h-3" />
                    )}
                    <Text className="color-white font-semibold text-xl">
                        {config.text}
                    </Text>
                    {showUserEventEmitter && type !== 'DOORBELL' ? (
                        <View className="w-full flex-row items-center gap-1">
                            <View className="w-4 h-4 rounded-full bg-slate-700 overflow-hidden">
                                <Image
                                    source={{
                                        uri: 'https://img.freepik.com/fotos-gratis/retrato-de-homem-branco-isolado_53876-40306.jpg?semt=ais_hybrid&w=740',
                                    }}
                                    className="w-full h-full"
                                />
                            </View>
                            <Text className="color-white text-xs font-light">
                                Por Nome da pessoa
                            </Text>
                        </View>
                    ) : (
                        <View className="h-3" />
                    )}
                </View>
                <View className="h-full items-end justify-between">
                    <Text className="color-white/50 text-xs">
                        {formatDateTime(datetime)}
                    </Text>
                    {config.openBottomSheet ? (
                        <ChevronRight size={20} color="white" />
                    ) : (
                        <View className="h-5" />
                    )}
                    <View className="h-4" />
                </View>
            </TouchableOpacity>
            <Portal>
                {type === 'DOORBELL' && (
                    <DoorbellBottomSheet
                        bottomSheetRef={bottomSheetRef}
                        datetime={formatDateTime(datetime) || ''}
                        deviceName={deviceName}
                        deviceId={deviceId}
                        imageUrl={imageUrl}
                    />
                )}
                {type === 'INVITE_RECEIVED' && (
                    <InviteReceivedBottomSheet
                        bottomSheetRef={bottomSheetRef}
                        datetime={formatDateTime(datetime) || ''}
                        deviceName={deviceName}
                        deviceId={deviceId}
                    />
                )}
            </Portal>
        </>
    );
};

export default EventCard;
