import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import EmailVerificationBottomSheet from '@/components/EmailVerificationBottomSheet';
import Message from '@/components/Message';
import InputField from '@/components/TextInput';
import { log } from '@/constants';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useSignupForm } from '@/hooks/useSignupForm';
import BottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useRouter } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignUp = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const {
        handleGoogleSignIn,
        handleEmailSignup,
        verifyEmailCode,
        resendVerificationEmail,
        isLoading,
        message,
        fieldErrors,
        clearMessage,
        clearFieldErrors,
    } = useAuthActions();
    const {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        nameError,
        emailError,
        passwordError,
        validateForm,
        resetForm,
    } = useSignupForm(fieldErrors);

    const [, setShowVerificationSheet] = useState(false);
    const verificationBottomSheetRef = useRef<BottomSheet>(null);

    const handleSignup = async () => {
        log.debug('Signup button pressed', { name, email, password });

        // Clear any previous field errors from auth
        clearFieldErrors();

        if (validateForm()) {
            const success = await handleEmailSignup(name, email, password);
            if (success) {
                setShowVerificationSheet(true);
                verificationBottomSheetRef.current?.snapToIndex(0);
            }
        }
    };

    const handleVerifyCode = async (code: string) => {
        const success = await verifyEmailCode(code);
        if (success) {
            setShowVerificationSheet(false);
            verificationBottomSheetRef.current?.close();
            resetForm();
        }
    };

    const handleResendEmail = async () => {
        await resendVerificationEmail();
    };

    const handleCancelVerification = () => {
        setShowVerificationSheet(false);
        verificationBottomSheetRef.current?.close();
        clearMessage();
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
                extraScrollHeight={20}
            >
                <View className="w-full h-full justify-between">
                    <BackButton />
                    <View className="w-full justify-end gap-6">
                        <View className="gap-4">
                            <Text className="color-white font-black text-3xl">
                                {t('signup.createAccount')}
                            </Text>
                            <Text className="text-lg color-slate-300">
                                {t('signup.createAccountDescription')}
                            </Text>
                        </View>

                        {message &&
                            !fieldErrors.name &&
                            !fieldErrors.email &&
                            !fieldErrors.password && (
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
                            label={t('signup.name')}
                            placeholder={t('signup.namePlaceholder')}
                            icon={User}
                            value={name}
                            onChangeText={setName}
                            errorMessage={nameError}
                        />
                        <InputField
                            label={t('signup.email')}
                            placeholder={t('signup.emailPlaceholder')}
                            type="email-address"
                            icon={Mail}
                            value={email}
                            onChangeText={setEmail}
                            errorMessage={emailError}
                        />
                        <InputField
                            label={t('signup.password')}
                            placeholder={t('signup.passwordPlaceholder')}
                            icon={Lock}
                            isPassword
                            value={password}
                            onChangeText={setPassword}
                            errorMessage={passwordError}
                        />
                        <CustomButton
                            text={
                                isLoading
                                    ? 'Carregando...'
                                    : t('signup.register')
                            }
                            mode="primary"
                            onPress={handleSignup}
                        />
                        <View className="w-full relative items-center">
                            <View className="w-2/5 h-[1px] bg-slate-300 absolute top-1/2 left-0" />
                            <Text className="color-white text-xl">
                                {t('login.or')}
                            </Text>
                            <View className="w-2/5 h-[1px] bg-slate-300 absolute top-1/2 right-0" />
                        </View>
                        <CustomButton
                            text={
                                isLoading
                                    ? 'Carregando...'
                                    : t('login.loginWithGoogle')
                            }
                            mode="secondary"
                            appendIcon="google"
                            iconLibrary="antdesign"
                            onPress={handleGoogleSignIn}
                        />
                        <TouchableOpacity
                            className="w-full"
                            onPress={() => router.push('/login')}
                        >
                            <Text className="text-base color-white text-center ">
                                {t('signup.alreadyHaveAnAccount')}{' '}
                                <Text className="color-emerald-400">
                                    {t('signup.login')}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <Portal>
                <EmailVerificationBottomSheet
                    bottomSheetRef={verificationBottomSheetRef}
                    onVerify={handleVerifyCode}
                    onResendEmail={handleResendEmail}
                    onCancel={handleCancelVerification}
                    email={email}
                />
            </Portal>
        </>
    );
};

export default SignUp;
