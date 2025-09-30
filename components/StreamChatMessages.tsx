import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const SentMessageBubble = ({ text, time }: { text: string; time: string }) => {
    return (
        <View className="w-full flex-row items-end gap-x-4 relative">
            <View className="flex-1 bg-gray-600 px-3.5 py-2 min-h-12 ml-24 rounded-xl rounded-br-none relative">
                <Text className="color-black font-semibold">{text}</Text>
                <View className="items-end">
                    <Text className="color-black font-light">{time}</Text>
                </View>
            </View>
        </View>
    );
};

const ReceivedMessageBubble = ({
    text,
    time,
}: {
    text: string;
    time: string;
}) => {
    return (
        <View className="w-full flex-row items-end gap-x-4 relative">
            <View className="left-0 flex-1 bg-emerald-800 px-3.5 py-2 min-h-12 mr-24 rounded-xl rounded-bl-none">
                <Text className="color-black font-semibold">{text}</Text>
                <View className="items-end">
                    <Text className="color-black font-light">{time}</Text>
                </View>
            </View>
        </View>
    );
};

const StreamChatMessages = ({ messages }: { messages: any[] }) => {
    return (
        <ScrollView
            className="w-full"
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
        >
            <View className="flex flex-col gap-y-2 px-4 pb-12">
                {messages.map((msg) =>
                    msg.origin === 'USER' ? (
                        <SentMessageBubble
                            key={msg.id}
                            text={msg.text}
                            time={msg.createdAt}
                        />
                    ) : (
                        <ReceivedMessageBubble
                            key={msg.id}
                            text={msg.text}
                            time={msg.createdAt}
                        />
                    ),
                )}
            </View>
        </ScrollView>
    );
};

export default StreamChatMessages;
