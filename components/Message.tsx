import React from 'react';
import { Text, View } from 'react-native';

interface MessageProps {
    message: string | null;
    type?: 'error' | 'success' | 'info';
}

const Message: React.FC<MessageProps> = ({ message, type = 'info' }) => {
    if (!message) return null;

    const getMessageStyle = () => {
        switch (type) {
            case 'error':
                return 'bg-red-500/20 border-red-500/30 text-red-400';
            case 'success':
                return 'bg-green-500/20 border-green-500/30 text-green-400';
            default:
                return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
        }
    };

    return (
        <View
            className={`p-3 rounded-lg border ${getMessageStyle().split(' ').slice(0, 2).join(' ')}`}
        >
            <Text
                className={`text-sm text-center ${getMessageStyle().split(' ')[2]}`}
            >
                {message}
            </Text>
        </View>
    );
};

export default Message;
