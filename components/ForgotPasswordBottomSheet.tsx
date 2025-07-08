import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Keyboard, Text, View } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { Easing } from 'react-native-reanimated';

interface ForgotPasswordBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    onVerifyCode: (code: string) => void;
    onResendEmail: () => void;
    email?: string;
}

const ForgotPasswordBottomSheet = ({
    bottomSheetRef,
    onVerifyCode,
    onResendEmail,
    email,
}: ForgotPasswordBottomSheetProps) => {
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    const snapPoints = useMemo(() => {
        return isKeyboardVisible ? ['90%'] : ['55%'];
    }, [isKeyboardVisible]);

    useEffect(() => {
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

    const handleVerifyCode = () => {
        if (otpCode.length === 6) {
            onVerifyCode(otpCode);
        }
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
                        Código de verificação
                    </Text>
                    <Text className="text-base text-center color-slate-300">
                        {email
                            ? `Enviamos um código de 6 dígitos para ${email}. Digite o código abaixo para redefinir sua senha.`
                            : 'Enviamos um código de 6 dígitos para seu e-mail. Digite o código abaixo para redefinir sua senha.'}
                    </Text>
                    <OtpInput
                        numberOfDigits={6}
                        placeholder="000000"
                        autoFocus={false}
                        focusColor={'#34d399'}
                        onTextChange={(text) => setOtpCode(text)}
                        onFilled={(text) => setOtpCode(text)}
                        theme={{
                            containerStyle: {
                                marginVertical: 16,
                            },
                            pinCodeContainerStyle: {
                                backgroundColor: '#374151',
                                borderColor: '#6B7280',
                                borderWidth: 1,
                                borderRadius: 8,
                                width: 45,
                                height: 55,
                            },
                            filledPinCodeContainerStyle: {
                                backgroundColor: '#475569',
                                borderColor: '#34d399',
                                borderWidth: 2,
                            },
                            pinCodeTextStyle: {
                                color: 'white',
                                fontSize: 18,
                                fontWeight: '600',
                            },
                            focusStickStyle: {
                                backgroundColor: '#34d399',
                            },
                        }}
                    />
                    <CustomButton
                        text="Verificar código"
                        mode="primary"
                        onPress={handleVerifyCode}
                    />
                    <Text
                        className="w-full text-center color-emerald-400 underline"
                        onPress={onResendEmail}
                    >
                        Não recebeu o código? Reenviar
                    </Text>
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default ForgotPasswordBottomSheet;
