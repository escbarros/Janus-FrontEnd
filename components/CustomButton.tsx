import AntDesign from '@expo/vector-icons/AntDesign';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface CustomButtonProps {
    text: string;
    mode?: 'primary' | 'secondary' | 'reject';
    appendIcon?: LucideIcon | any;
    iconLibrary?: 'lucide' | 'antdesign';
    isDisabled?: boolean;
    onPress?: () => void;
}

export default function CustomButton({
    text,
    isDisabled = false,
    mode = 'primary',
    appendIcon,
    iconLibrary = 'lucide',
    onPress,
}: CustomButtonProps) {
    const containerStyle =
        mode === 'primary'
            ? 'bg-emerald-400'
            : mode === 'secondary'
              ? 'border-emerald-200 border-2 bg-transparent'
              : 'bg-pink-800';

    const textStyle =
        mode !== 'secondary' ? 'color-white' : 'color-emerald-200';

    return (
        <TouchableOpacity
            className={`w-full justify-center items-center flex-row gap-1.5 py-2 rounded-xl ${containerStyle} ${isDisabled ? 'opacity-50' : ''}`}
            onPress={isDisabled ? () => {} : onPress}
            disabled={isDisabled}
        >
            {appendIcon && iconLibrary === 'antdesign' && (
                <AntDesign
                    name={appendIcon}
                    size={20}
                    color={mode === 'primary' ? '#ffffff' : '#a7f3d0'}
                />
            )}
            {appendIcon &&
                iconLibrary === 'lucide' &&
                React.createElement(appendIcon as LucideIcon, {
                    size: 20,
                    color: mode === 'primary' ? '#ffffff' : '#10b981',
                })}
            <Text className={`text-xl font-medium ${textStyle}`}>{text}</Text>
        </TouchableOpacity>
    );
}
