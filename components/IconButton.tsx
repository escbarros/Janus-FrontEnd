import AntDesign from '@expo/vector-icons/AntDesign';
import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

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

export default IconButton;
