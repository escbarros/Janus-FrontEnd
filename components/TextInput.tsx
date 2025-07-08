import { Eye, EyeClosed, LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InputFieldProps {
    label: string;
    placeholder: string;
    isPassword?: boolean;
    icon?: LucideIcon | undefined;
    type?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}
export default function InputField({
    label,
    placeholder,
    isPassword = false,
    icon: IconComponent,
    type = 'default',
}: InputFieldProps) {
    const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
    return (
        <View className="gap-1.5 flex-start justify-start w-full">
            <Text className="color-white font-medium text-base">{label}</Text>
            <View className="flex-row gap-2 items-center border-slate-300 border-2 py-3 rounded-xl w-full px-3 relative">
                {IconComponent && (
                    <IconComponent color="white" className="absolute" />
                )}
                <TextInput
                    keyboardType={type}
                    placeholder={placeholder}
                    className="p-0 m-0 text-xl w-full color-white"
                    placeholderTextColor="#cbd5e1"
                    secureTextEntry={secureTextEntry}
                />
                {isPassword && (
                    <TouchableOpacity
                        className="absolute right-3"
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                    >
                        {!secureTextEntry ? (
                            <Eye color="white" size={20} />
                        ) : (
                            <EyeClosed color="white" size={20} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
