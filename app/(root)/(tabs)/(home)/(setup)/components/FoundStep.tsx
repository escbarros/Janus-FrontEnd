import CustomButton from '@/components/CustomButton';
import { DoorOpenIcon } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface FoundStepProps {
    onNext: () => void;
    onRetry: () => void;
}

const FoundStep: React.FC<FoundStepProps> = ({ onNext, onRetry }) => {
    return (
        <View className="flex-1 items-center justify-center px-8">
            <View className="w-48 h-48 rounded-full border-2 border-primary items-center justify-center border-emerald-400 ">
                <DoorOpenIcon color="#34d399" size={64} />
            </View>

            <Text className="text-white mt-12 text-2xl font-bold mb-2">
                Dispositivo Encontrado!
            </Text>

            <Text className="text-gray-400 text-sm mb-12">
                # Número de Série
            </Text>

            <View className="w-full gap-4">
                <CustomButton text="Próximo" onPress={onNext} />
                <CustomButton
                    text="Não é esse? Continue procurando!"
                    onPress={onRetry}
                    mode="secondary"
                />
            </View>
        </View>
    );
};

export default FoundStep;
