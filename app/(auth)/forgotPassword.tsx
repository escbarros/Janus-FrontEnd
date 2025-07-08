import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/TextInput';
import { images } from '@/constants';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Keyboard, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { OtpInput } from 'react-native-otp-entry';
import { Easing } from 'react-native-reanimated';

export default function ForgotPassword() {
    const { t } = useTranslation();
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const snapPoints = useMemo(() => {
        return isKeyboardVisible ? ['90%'] : ['55%'];
    }, [isKeyboardVisible]);

    useEffect(() => {
        Keyboard.dismiss();
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsKeyboardVisible(true);
            },
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsKeyboardVisible(false);
            },
        );

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    const handleSendEmail = () => {
        bottomSheetRef.current?.expand();
    };

    const handleCloseBottomSheet = () => {
        router.push('/changePassword');
        Keyboard.dismiss();
        setTimeout(() => {
            bottomSheetRef.current?.close();
        }, 100);
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.75}
                style={[props.style, { backgroundColor: '#111827' }]}
                pressBehavior="close"
            />
        ),
        [],
    );

    return (
        <>
            <KeyboardAwareScrollView
                className="flex-1 w-full h-full gap-6"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={120}
            >
                <View className="w-full h-full justify-between">
                    <BackButton />
                    <View className="w-full justify-end gap-6">
                        <View className="gap-4">
                            <Image source={images.forgotPassword} />
                            <Text className="color-white font-black text-3xl">
                                Esqueceu sua senha?
                            </Text>
                            <Text className="text-lg color-slate-300">
                                Informe seu e-mail que utilizou para se
                                cadastrar para receber um código de redefinição
                                de senha.
                            </Text>
                        </View>
                        <InputField
                            label={t('signup.email')}
                            placeholder={t('signup.emailPlaceholder')}
                            icon={Mail}
                        />
                        <CustomButton
                            text="Enviar"
                            mode="primary"
                            onPress={handleSendEmail}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <Portal>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    enableHandlePanningGesture={false}
                    enableContentPanningGesture={false}
                    backdropComponent={renderBackdrop}
                    backgroundStyle={{ backgroundColor: '#1F2937' }}
                    keyboardBehavior="interactive"
                    keyboardBlurBehavior="restore"
                    enableBlurKeyboardOnGesture
                    android_keyboardInputMode="adjustResize"
                    animationConfigs={{
                        duration: 0,
                        easing: Easing.linear,
                    }}
                >
                    <BottomSheetScrollView
                        className="flex-1 p-6"
                        contentContainerStyle={{ flexGrow: 1 }}
                    >
                        <View className="items-center gap-4">
                            <Image source={images.mailSent} />
                            <Text className="text-2xl font-bold text-center color-white">
                                E-mail enviado!
                            </Text>
                            <Text className="text-base text-center color-slate-300">
                                Enviamos um código de redefinição de senha para
                                o seu e-mail. Verifique sua caixa de entrada e
                                spam.
                            </Text>
                            <OtpInput
                                numberOfDigits={6}
                                placeholder="000000"
                                autoFocus={false}
                                focusColor={'#34d399'}
                                onTextChange={(text) => console.log(text)}
                                theme={{
                                    filledPinCodeContainerStyle: {
                                        backgroundColor: '#475569',
                                        borderColor: '#94A3B8',
                                    },
                                    pinCodeTextStyle: { color: 'white' },
                                }}
                            />
                            <CustomButton
                                text="Verificar"
                                mode="primary"
                                onPress={handleCloseBottomSheet}
                            />
                            <Text className="w-full text-center color-white underline">
                                Não recebeu o email? Reenviar
                            </Text>
                        </View>
                    </BottomSheetScrollView>
                </BottomSheet>
            </Portal>
        </>
    );
}
