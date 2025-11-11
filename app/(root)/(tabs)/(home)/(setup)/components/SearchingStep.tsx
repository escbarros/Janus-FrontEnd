import { Wifi } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SearchingStepProps {
    onNext: () => void;
}

const SearchingStep: React.FC<SearchingStepProps> = ({ onNext }) => {
    return (
        <TouchableOpacity
            className="flex-1 items-center justify-center px-8"
            onPress={onNext}
            activeOpacity={0.7}
        >
            <View className="mb-8">
                <Wifi size={80} color="#14b8a6" strokeWidth={1.5} />
            </View>

            <Text className="text-white text-xl font-bold mb-4">
                Procurando dispositivo
            </Text>
            <Text className="text-gray-400 text-center">
                Isso não deve demorar muito...
            </Text>
        </TouchableOpacity>
    );
};

export default SearchingStep;
