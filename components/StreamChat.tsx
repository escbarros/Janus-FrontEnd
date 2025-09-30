import StreamChatMessages from '@/components/StreamChatMessages';
import { useMqtt } from '@/context/MqttContext';
import { useUser } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SendHorizonal } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
const { height } = Dimensions.get('window');
const StreamChat = ({ callId }: { callId: string | null }) => {
    const [id, setId] = useState(callId);
    const [message, setMessage] = useState('');
    const { subscribe, publishMessage } = useMqtt();
    const { user } = useUser();
    const [messages, setMessages] = useState<
        {
            id: string;
            text: string;
            origin: 'DEVICE' | 'USER';
            createdAt: string;
        }[]
    >([]);

    useEffect(() => {
        setId(callId);
    }, [callId]);

    useEffect(() => {
        subscribe(`call/${id}/stt`, (message) => {
            const parsedMessage = JSON.parse(message);
            console.log(parsedMessage.text);
            const newMessage = {
                id: Date.now().toString(),
                text: parsedMessage.text,
                origin: 'DEVICE' as 'DEVICE',
                createdAt: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };

            setMessages((prev) => [...prev, newMessage]);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callId]);

    const sendMessage = () => {
        if (message.trim() === '') return;

        const newMessage = {
            id: Date.now().toString(),
            text: message,
            origin: 'USER' as 'USER',
            createdAt: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        setMessages((prev) => [...prev, newMessage]);

        publishMessage(
            `device/status/0fa98c5e-aaa0-427a-89e0-283cbb47a25f/${callId}/tts`,
            JSON.stringify({
                userId: user?.id || 'unknown',
                message,
                datetime: new Date().toISOString(),
            }),
        );

        setMessage('');
    };

    return (
        <View
            className="w-full flex-col justify-start items-start relative "
            style={{ height: height * 0.5 }}
        >
            <View className="w-full px-2 h-4/6 gap-y-8 relative">
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
                    <StreamChatMessages messages={messages} />
                </View>
            </View>
            <View className="bg-slate-950 absolute r-0 l-0 bottom-0 w-full h-16 items-center justify-between p-2 pt-4 flex-row gap-x-2">
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    className=" w-5/6 h-full bg-[#020617]/10 border border-slate-300 rounded-md px-2 color-zinc-100"
                    placeholder="O que você quer falar?"
                    placeholderClassName="font-bold"
                    placeholderTextColor="#cbd5e1"
                />
                <TouchableOpacity
                    onPress={sendMessage}
                    className="bg-emerald-600 w-8 h-full rounded-lg justify-center items-center p-6 py-0"
                >
                    <SendHorizonal size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default StreamChat;
