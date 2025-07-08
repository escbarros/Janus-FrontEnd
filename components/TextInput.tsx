import { Eye, EyeClosed, LucideIcon, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface InputFieldProps {
    label: string;
    placeholder: string;
    isPassword?: boolean;
    icon?: LucideIcon | undefined;
    type?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    errorMessage?: string;
    value: string;
    onChangeText: (text: string) => void;
}
export default function InputField({
    label,
    placeholder,
    isPassword = false,
    icon: IconComponent,
    type = 'default',
    errorMessage = '',
    value,
    onChangeText,
}: InputFieldProps) {
    const [secureTextEntry, setSecureTextEntry] = useState(isPassword);
    const [hasError, setHasError] = useState(
        errorMessage.replace(' ', '').length > 0,
    );

    const statusColor = hasError ? 'color-red-400' : 'color-white';
    const borderColor = hasError ? 'border-red-400' : 'border-slate-300';

    useEffect(() => {
        setHasError(errorMessage.replace(' ', '').length > 0);
    }, [errorMessage]);

    return (
        <View className="gap-1.5 flex-start justify-start w-full relative">
            <View className="w-full flex-row items-center justify-between">
                <Text className={`${statusColor} font-medium text-base`}>
                    {label}
                </Text>
                {hasError && (
                    <View className="flex-row items-center gap-1 justify-end">
                        <X color="#dc2626" size={16} />
                        <Text className="color-red-600 text-sm font-bold">
                            {errorMessage}
                        </Text>
                    </View>
                )}
            </View>
            <View
                className={`${borderColor} flex-row gap-2 items-center border-slate-300 border-2 py-3 rounded-xl w-full px-3 relative`}
            >
                {IconComponent && (
                    <IconComponent color="white" className="absolute" />
                )}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={type}
                    placeholder={placeholder}
                    className={`${statusColor} p-0 m-0 text-xl w-full`}
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
