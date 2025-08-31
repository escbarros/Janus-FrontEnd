import AntDesign from '@expo/vector-icons/AntDesign';
import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

interface IconButtonProps {
    mode?: 'primary' | 'secondary' | 'tertiary';
    iconSize?: number;
    icon: LucideIcon | any;
    iconLibrary?: 'lucide' | 'antdesign';
    onPress?: () => void;
}

const IconButton = ({
    icon,
    iconSize = 20,
    mode = 'primary',
    iconLibrary = 'lucide',
    onPress = undefined,
}: IconButtonProps) => {
    const theme =
        mode === 'primary'
            ? 'bg-emerald-500/25 border-[1px] border-emerald-500'
            : mode === 'secondary'
              ? 'border-[1px] border-white'
              : 'transparent';
    const beforeOnPress = () => {
        if (onPress) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };
    return (
        <TouchableOpacity
            className={`h-9 w-9 rounded-full ${theme} justify-center items-center`}
            onPress={beforeOnPress}
        >
            {icon && iconLibrary === 'antdesign' && (
                <AntDesign name={icon} size={iconSize} color={'#ffffff'} />
            )}
            {icon &&
                iconLibrary === 'lucide' &&
                React.createElement(icon as LucideIcon, {
                    size: iconSize,
                    color: '#ffffff',
                })}
        </TouchableOpacity>
    );
};

export default IconButton;
