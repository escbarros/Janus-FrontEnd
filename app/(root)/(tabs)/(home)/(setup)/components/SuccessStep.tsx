import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const SuccessStep: React.FC = () => {
    const handleBackToHome = () => {
        router.push('/(root)/(tabs)/(home)');
    };

    return (
        <View className="flex-1 items-center justify-center px-8">
            <Text className="text-7xl mb-8">🎉</Text>
            <Text className="text-white text-2xl font-bold mb-2">
                Dispositivo adicionado com
            </Text>
            <Text className="text-emerald-400 text-2xl font-bold mb-6">
                SUCESSO
            </Text>
            <Text className="text-gray-400 text-center mb-12">
                Você já pode acessá-lo, editar ou compartilhar com outros
                usuários!
            </Text>

            <View className="w-full">
                <CustomButton
                    text="Voltar para tela inicial"
                    onPress={handleBackToHome}
                />
            </View>
        </View>
    );
};

export default SuccessStep;
