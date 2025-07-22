import { images } from '@/constants';
import React from 'react';
import { Image, Text, View } from 'react-native';

const NoDevices = () => {
    return (
        <View className="w-full h-full flex-1 items-center px-6 justify-center relative">
            <Image
                source={images.noDeviceArrow}
                className="absolute top-28 rotate-12"
            />
            <View className="w-full rounded-lg py-3 border-dashed border-2 border-white items-center gap-3 relative">
                <Text className="color-slate-100 text-2xl font-black">
                    Nenhum Dispositivo
                </Text>
                <Text className="text-base w-3/4 color-slate-300 font-medium text-center">
                    Clique no botão + para adicionar um novo dispositivo a sua
                    conta!
                </Text>
            </View>
        </View>
    );
};

export default NoDevices;
