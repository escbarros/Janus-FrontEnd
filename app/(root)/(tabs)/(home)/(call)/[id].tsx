import BackButton from '@/components/BackButton';
import IconButton from '@/components/IconButton';
import StreamChatMessages from '@/components/StreamChatMessages';
import { callApi, type Call } from '@/utils/api/call';
import { useAuth } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Download } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

const CallDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getToken } = useAuth();
    const [call, setCall] = useState<Call | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const player = useVideoPlayer(
        call?.videoUrl ||
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        (player) => {
            player.loop = false;
            player.play();
        },
    );

    useEffect(() => {
        const fetchCallDetail = async () => {
            try {
                const token = await getToken();
                if (!token) {
                    console.error('No token available');
                    return;
                }

                const callData = await callApi.getCallDetail(id, token);
                setCall(callData);
            } catch (error) {
                console.error('Failed to fetch call details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCallDetail();
    }, []);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#94a3b8" />
            </View>
        );
    }

    if (!call) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="color-slate-300">Chamada não encontrada</Text>
            </View>
        );
    }

    const date = new Date(call.startedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <ScrollView
            className="bg-transparent"
            scrollEnabled
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingTop: 64,
                paddingBottom: 128,
                gap: 32,
            }}
        >
            <View className="w-full px-6 flex-row items-center justify-between">
                <BackButton />
                <View className="text-center items-center justify-center gap-1">
                    <Text className="color-white font-extrabold text-lg">
                        {date}
                    </Text>
                    <Text className="text-xs color-slate-300">
                        {call.deviceSerialNumber}
                    </Text>
                </View>
                <IconButton icon={Download} mode="secondary" iconSize={16} />
            </View>
            <View className="w-full h-80 bg-slate-900 rounded-lg overflow-hidden">
                <VideoView
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    allowsFullscreen
                    allowsPictureInPicture
                    player={player}
                    contentFit="cover"
                />
            </View>
            <View className="w-full px-6 h-auto gap-y-8 relative">
                <View className="w-full">
                    <Text className="color-white text-2xl font-black">
                        Transcrição
                    </Text>
                    <View className="w-full flex-row justify-start items-center gap-x-2">
                        <Text className="color-slate-300 text-base font-light">
                            Abaixo estará a transcrição feita por IA
                        </Text>
                        <Ionicons
                            name="sparkles"
                            size={12}
                            color="#cbd5e1"
                            className="mr-2"
                        />
                    </View>
                </View>
                <View className="w-full h-full">
                    <StreamChatMessages messages={call.messages} />
                </View>
            </View>
        </ScrollView>
    );
};

export default CallDetail;
