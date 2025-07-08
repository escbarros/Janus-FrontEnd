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

interface EmailVerificationBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    onVerify: (code: string) => void;
    onResendEmail: () => void;
    onCancel?: () => void;
    email?: string;
}

const EmailVerificationBottomSheet = ({
    bottomSheetRef,
    onVerify,
    onResendEmail,
    onCancel,
    email,
}: EmailVerificationBottomSheetProps) => {
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

    const handleVerify = () => {
        onVerify(otpCode);
    };

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.75}
                style={[props.style, { backgroundColor: '#111827' }]}
                pressBehavior="none"
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
                        Verificação de E-mail
                    </Text>
                    <Text className="text-base text-center color-slate-300">
                        {email
                            ? `Enviamos um código de verificação para ${email}. Verifique sua caixa de entrada e spam.`
                            : 'Enviamos um código de verificação para o seu e-mail. Verifique sua caixa de entrada e spam.'}
                    </Text>
                    <OtpInput
                        numberOfDigits={6}
                        placeholder="000000"
                        autoFocus={false}
                        focusColor={'#34d399'}
                        onTextChange={(text) => setOtpCode(text)}
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
                        onPress={handleVerify}
                    />
                    <Text
                        className="w-full text-center color-white underline"
                        onPress={onResendEmail}
                    >
                        Não recebeu o email? Reenviar
                    </Text>
                    {onCancel && (
                        <CustomButton
                            text="Cancelar"
                            mode="secondary"
                            onPress={onCancel}
                        />
                    )}
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default EmailVerificationBottomSheet;
