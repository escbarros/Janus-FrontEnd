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
import React from 'react';
import { Image, Text, View } from 'react-native';

export type EventType =
    | 'door-locked'
    | 'door-unlocked'
    | 'doorbell'
    | 'invite-sent'
    | 'invite-received'
    | 'invite-accepted'
    | 'link-invite';

export interface EventCardProps {
    type?: EventType;
    isNewNotification?: boolean;
    showUserEventEmitter?: boolean;
    showDeviceName?: boolean;
    showBackground?: boolean;
}

const EVENT_CONFIG = {
    'door-unlocked': {
        color: 'bg-green-600',
        bgColor: 'bg-green-600/25',
        icon: <DoorOpen size={24} color="#fff" />,
        text: 'Porta destrancada',
    },
    'door-locked': {
        color: 'bg-violet-700',
        bgColor: 'bg-violet-700/25',
        icon: <DoorClosedLocked size={24} color="#fff" />,
        text: 'Porta trancada',
    },
    doorbell: {
        color: 'bg-sky-400',
        bgColor: 'bg-sky-400/25',
        icon: <BellElectric size={24} color="#fff" />,
        text: 'Alguém está na porta',
    },
    'invite-received': {
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-500/25',
        icon: <MailPlus size={24} color="#fff" />,
        text: 'Convite recebido',
    },
    'invite-sent': {
        color: 'bg-orange-400',
        bgColor: 'bg-orange-400/25',
        icon: <SendHorizontal size={24} color="#fff" />,
        text: 'Convite enviado',
    },
    'invite-accepted': {
        color: 'bg-teal-500',
        bgColor: 'bg-teal-500/25',
        icon: <UserPlus size={24} color="#fff" />,
        text: 'Convite aceito',
    },
    'link-invite': {
        color: 'bg-pink-500',
        bgColor: 'bg-pink-500/25',
        icon: <Link size={24} color="#fff" />,
        text: 'Link de convite criado',
    },
};

const EventCard = ({
    type = 'door-unlocked',
    isNewNotification = false,
    showUserEventEmitter = true,
    showDeviceName = true,
    showBackground = false,
}: EventCardProps) => {
    const config = EVENT_CONFIG[type];
    const cardBg =
        isNewNotification || showBackground ? config.bgColor : 'bg-transparent';

    return (
        <View
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
                        Nome do dispositivo
                    </Text>
                ) : (
                    <View className="h-3" />
                )}
                <Text className="color-white font-semibold text-xl">
                    {config.text}
                </Text>
                {showUserEventEmitter && type !== 'doorbell' ? (
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
                    25/07/2025 às 17:00
                </Text>
                <ChevronRight size={20} color="white" />
                <View className="h-4" />
            </View>
        </View>
    );
};

export default EventCard;
