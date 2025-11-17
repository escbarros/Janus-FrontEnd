import CustomButton from '@/components/CustomButton';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface PairingStepProps {
    onNext: () => void;
}

const PairingStep: React.FC<PairingStepProps> = ({ onNext }) => {
    return (
        <View className="flex-1 items-center justify-center gap-8">
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                <LottieView
                    source={require('@/assets/pulse.json')}
                    autoPlay
                    loop
                    style={{ width: 96, height: 96 }}
                />
            </View>
            <Text className="text-gray-400 text-center px-8">
                Pressione o botão por{' '}
                <Text className="color-emerald-400">5 segundos</Text> ou até o
                led começar a piscar com a cor{' '}
                <Text className="color-emerald-400">verde</Text>
            </Text>
            <CustomButton text="Próximo" onPress={onNext} />
        </View>
    );
};

export default PairingStep;
