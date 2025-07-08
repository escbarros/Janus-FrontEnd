import { useUser } from '@clerk/clerk-expo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LayoutPanelTop, LucideIcon, Plus } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface IconButtonProps {
    mode?: 'primary' | 'secondary';
    icon: LucideIcon | any;
    iconLibrary?: 'lucide' | 'antdesign';
}
const IconButton = ({
    icon,
    mode = 'primary',
    iconLibrary = 'lucide',
}: IconButtonProps) => {
    const theme =
        mode === 'primary'
            ? 'bg-emerald-500/25 border-[1px] border-emerald-500'
            : 'transparent';
    return (
        <TouchableOpacity
            className={`h-9 w-9 rounded-full ${theme} justify-center items-center`}
        >
            {icon && iconLibrary === 'antdesign' && (
                <AntDesign name={icon} size={20} color={'#ffffff'} />
            )}
            {icon &&
                iconLibrary === 'lucide' &&
                React.createElement(icon as LucideIcon, {
                    size: 20,
                    color: '#ffffff',
                })}
        </TouchableOpacity>
    );
};

const Homepage = () => {
    const { user } = useUser();

    return (
        <View className="w-100 flex-row items-center space-between">
            <View className="flex-row items-center gap-4 flex-1">
                {user?.imageUrl ? (
                    <Image
                        source={{ uri: user.imageUrl }}
                        className="h-12 w-12 rounded-full"
                    />
                ) : (
                    <View className="h-12 w-12 rounded-full bg-gray-400" />
                )}
                <Text className="color-white text-2xl">
                    Olá,{' '}
                    <Text className="font-bold">
                        {user?.firstName?.split(' ')[0] || 'User'}
                    </Text>
                </Text>
            </View>
            <View className="flex-row items-center gap-4 justify-end">
                <IconButton icon={Plus}></IconButton>
                <IconButton mode="secondary" icon={LayoutPanelTop}></IconButton>
            </View>
        </View>
    );
};

export default Homepage;
