import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import CustomButton from './CustomButton';
import InputField from './TextInput';

interface ChangeDeviceNicknameBottomSheetProps {
    currentNickname: string;
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    newNickname: string;
    setNewNickname: (nickname: string) => void;
    onPress: () => void;
    isLoading?: boolean;
}

const ChangeDeviceNicknameBottomSheet = ({
    bottomSheetRef,
    currentNickname,
    newNickname,
    setNewNickname,
    onPress,
    isLoading = false,
}: ChangeDeviceNicknameBottomSheetProps) => {
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
    const [error, setError] = useState('');
    useEffect(() => {
        if (newNickname.replaceAll(' ', '').length < 1) {
            setError('Nome deve ter ao menos 1 caractere');
        } else {
            setError('');
        }
    }, [newNickname]);

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
                    <View className="items-center w-full">
                        {isLoading ? (
                            <>
                                <ActivityIndicator
                                    size="large"
                                    color="#34d399"
                                />
                                <Text className="text-center color-white text-xl font-semibold mt-4">
                                    Alterando nome...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text className="text-center color-white text-2xl font-extrabold">
                                    Alterar nome
                                </Text>
                                <Text className="font-regular text-sm color-slate-300 mb-4">
                                    Digite abaixo o novo nome para o interfone
                                </Text>
                                <InputField
                                    isBottomSheet
                                    label="Nome"
                                    value={newNickname}
                                    onChangeText={setNewNickname}
                                    placeholder={currentNickname || 'Novo nome'}
                                    errorMessage={error}
                                />
                                <View className="w-full mt-4">
                                    <CustomButton
                                        text="Alterar"
                                        onPress={onPress}
                                        isDisabled={
                                            error.length !== 0 ||
                                            newNickname === currentNickname
                                        }
                                    />
                                </View>
                            </>
                        )}
                    </View>
                </SafeAreaView>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default ChangeDeviceNicknameBottomSheet;
