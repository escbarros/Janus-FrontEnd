import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import ForgotPasswordBottomSheet from '@/components/ForgotPasswordBottomSheet';
import Message from '@/components/Message';
import InputField from '@/components/TextInput';
import { images } from '@/constants';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import BottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { Mail } from 'lucide-react-native';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function ForgotPassword() {
    const { t } = useTranslation();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const {
        email,
        setEmail,
        emailError,
        isLoading,
        message,
        sendResetEmail,
        verifyResetCode,
        resendResetEmail,
    } = useForgotPassword();

    const handleSendEmail = async () => {
        const success = await sendResetEmail();
        if (success) {
            bottomSheetRef.current?.expand();
        }
    };

    const handleVerifyCode = async (code: string) => {
        await verifyResetCode(code);
        bottomSheetRef.current?.close();
    };

    const handleResendEmail = async () => {
        await resendResetEmail();
    };

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

                        {message && (
                            <Message
                                message={message}
                                type={
                                    message.includes('sucesso')
                                        ? 'success'
                                        : 'error'
                                }
                            />
                        )}

                        <InputField
                            label={t('signup.email')}
                            placeholder={t('signup.emailPlaceholder')}
                            icon={Mail}
                            value={email}
                            onChangeText={setEmail}
                            errorMessage={emailError}
                        />
                        <CustomButton
                            text={isLoading ? 'Enviando...' : 'Enviar'}
                            mode="primary"
                            onPress={handleSendEmail}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <Portal>
                <ForgotPasswordBottomSheet
                    bottomSheetRef={bottomSheetRef}
                    onVerifyCode={handleVerifyCode}
                    onResendEmail={handleResendEmail}
                    email={email}
                />
            </Portal>
        </>
    );
}
