import BackButton from '@/components/BackButton';
import React from 'react';
import { Text, View } from 'react-native';

const ChangePassword = () => {
    return (
        <View>
            <BackButton />
            <Text className="color-white font-black text-3xl">
                Redefinir Senha
            </Text>
            <Text>A</Text>
        </View>
    );
};

export default ChangePassword;
