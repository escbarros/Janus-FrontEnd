import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    LinkIcon,
    LucideIcon,
    UserPlus,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import CustomButton from './CustomButton';
import InputField from './TextInput';

interface DeviceUsersBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    onPress: () => void;
    isLoading?: boolean;
}

enum Stages {
    MAIN,
    PERMISSION,
    INVITE,
}
enum Permission {
    ADMIN,
    VIEWER,
}

const MainContent = ({
    goTo,
    permission,
}: {
    goTo: (stage: Stages) => void;
    permission: Permission;
}) => {
    return (
        <View className="items-center w-full">
            <Text className="text-center color-white text-2xl font-extrabold">
                Adicionar Pessoas
            </Text>
            <View className="w-full gap-6 mt-6">
                <ListItem
                    icon={UserPlus}
                    name="Convidar"
                    onPress={() => goTo(Stages.INVITE)}
                />
                <ListItem
                    icon={LinkIcon}
                    name="Copiar Link"
                    showChevron={false}
                />
                <ListItem
                    name="Permissões do usuário"
                    chevronText={
                        permission === Permission.ADMIN
                            ? 'Administrador'
                            : 'Visualizador'
                    }
                    onPress={() => goTo(Stages.PERMISSION)}
                />
            </View>
        </View>
    );
};

const PermissionContent = ({
    goTo,
    onCheck,
    checked,
}: {
    goTo: (stage: Stages) => void;
    onCheck: (type: Permission) => void;
    checked: Permission;
}) => {
    return (
        <View className="items-center w-full">
            <View className="w-full relative flex-row items-center justify-center">
                <TouchableOpacity
                    className="absolute left-0"
                    onPress={() => goTo(Stages.MAIN)}
                >
                    <ChevronLeft color={'white'} size={20} />
                </TouchableOpacity>
                <Text className="text-center color-white text-2xl font-extrabold">
                    Permissões do usuário
                </Text>
            </View>
            <View className="w-full gap-6 mt-8 mb-3">
                <PermissionItem
                    name="Administrador"
                    isChecked={checked === Permission.ADMIN}
                    onPress={() => onCheck(Permission.ADMIN)}
                />
                <PermissionItem
                    name="Visualizador"
                    isChecked={checked === Permission.VIEWER}
                    onPress={() => onCheck(Permission.VIEWER)}
                />
            </View>
        </View>
    );
};

const InviteContent = ({ goTo }: { goTo: (stage: Stages) => void }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const checkIfEmailIsValid = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('E-mail inválido');
            return false;
        }
        setError('');
        return true;
    };
    return (
        <View className="items-center w-full">
            <View className="w-full relative flex-row items-start justify-center">
                <TouchableOpacity
                    className="absolute left-0"
                    onPress={() => goTo(Stages.MAIN)}
                >
                    <ChevronLeft color={'white'} size={20} />
                </TouchableOpacity>
                <View className="w-full items-center">
                    <Text className="text-center color-white text-2xl font-extrabold">
                        Convidar
                    </Text>
                    <Text className="text-slate-300 text-sm">
                        Digite o e-mail do usuário que quer convidar
                    </Text>
                </View>
            </View>
            <View className="w-full gap-4 mt-8 mb-3">
                <InputField
                    isBottomSheet
                    label="E-mail"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChangeText={setEmail}
                    onBlur={checkIfEmailIsValid}
                    errorMessage={error}
                />
                <CustomButton
                    text="Enviar Convite"
                    isDisabled={email.length === 0 || error.length !== 0}
                    onPress={() => {}}
                />
            </View>
        </View>
    );
};

const PermissionItem = ({
    name,
    isChecked = false,
    onPress,
}: {
    name: string;
    isChecked?: boolean;
    onPress: () => void;
}) => {
    return (
        <TouchableOpacity
            className="w-full flex-row items-center justify-between"
            onPress={onPress}
        >
            <Text className="color-white font-medium text-lg">{name}</Text>
            {isChecked && <Check size={16} color={'white'} />}
        </TouchableOpacity>
    );
};

const ListItem = ({
    showChevron = true,
    chevronText = '',
    icon = undefined,
    name,
    onPress,
}: {
    showChevron?: boolean;
    chevronText?: string;
    icon?: LucideIcon;
    name: string;
    onPress?: () => void;
}) => {
    return (
        <TouchableOpacity
            className="w-full flex-row items-center justify-between"
            onPress={onPress}
        >
            <View className="flex-row items-center gap-4">
                {icon &&
                    React.createElement(icon as LucideIcon, {
                        size: 24,
                        color: '#ffffff',
                    })}
                <Text className="color-white">{name}</Text>
            </View>
            {showChevron && (
                <View className="flex-row items-center">
                    <Text className="text-sm color-slate-300">
                        {chevronText}
                    </Text>
                    <ChevronRight size={24} color={'white'} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const DeviceUsersBottomSheet = ({
    bottomSheetRef,
    onPress,
    isLoading = false,
}: DeviceUsersBottomSheetProps) => {
    const [stage, setStage] = useState(Stages.MAIN);
    const [permission, setPermission] = useState(Permission.VIEWER);
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.75}
                style={[props.style, { backgroundColor: '#111827' }]}
                pressBehavior={isLoading ? 'none' : 'close'}
            />
        ),
        [isLoading],
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            enablePanDownToClose={!isLoading}
            enableHandlePanningGesture={!isLoading}
            enableContentPanningGesture={false}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: '#1F2937' }}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore"
            enableBlurKeyboardOnGesture
            android_keyboardInputMode="adjustResize"
            enableDynamicSizing={true}
            animationConfigs={{
                duration: 0,
                easing: Easing.linear,
            }}
        >
            <BottomSheetScrollView
                className="flex-1 p-6 pb-0"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <SafeAreaView
                    style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: 72,
                    }}
                >
                    {stage === Stages.MAIN && (
                        <MainContent goTo={setStage} permission={permission} />
                    )}
                    {stage === Stages.INVITE && (
                        <InviteContent goTo={setStage} />
                    )}
                    {stage === Stages.PERMISSION && (
                        <PermissionContent
                            goTo={setStage}
                            checked={permission}
                            onCheck={(permission: Permission) => {
                                setPermission(permission);
                                setStage(Stages.MAIN);
                            }}
                        />
                    )}
                </SafeAreaView>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default DeviceUsersBottomSheet;
