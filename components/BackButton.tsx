import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

const BackButton = () => {
    const router = useRouter();
    const onPress = () => {
        router.back();
    };
    return (
        <TouchableOpacity
            onPress={onPress}
            className="rounded-lg px-2 py-2.5 justify-center w-[40px] items-center border-2 border-emerald-400 bg-emerald-400/25 color-emerald-400"
        >
            <ChevronLeft size={24} color="#34d399" />
        </TouchableOpacity>
    );
};

export default BackButton;
