import CustomButton from '@/components/CustomButton';
import Message from '@/components/Message';
import InputField from '@/components/TextInput';
import { images, log } from '@/constants';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        handleGoogleSignIn,
        handleEmailLogin,
        isLoading,
        message,
        fieldErrors,
        clearFieldErrors,
    } = useAuthActions();
    const {
        email,
        setEmail,
        password,
        setPassword,
        emailError,
        passwordError,
        validateForm,
    } = useLoginForm(fieldErrors);

    const handleLogin = async () => {
        log.debug('Login button pressed', { email, password });

        // Clear any previous field errors from auth
        clearFieldErrors();

        if (validateForm()) {
            await handleEmailLogin(email, password);
            // Don't reset form here anymore, let the user try again if needed
        }
    };

    return (
        <KeyboardAwareScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
            extraScrollHeight={20}
        >
            <View className="flex-1 items-center justify-between">
                <View className="items-center gap-6 ">
                    <Text className="color-white text-2xl">
                        {t('login.welcomeTo')}
                    </Text>
                    <View className="w-24 h-24">
                        <Image source={images.logo} className="w-full h-full" />
                    </View>
                    <Text className="text-3xl color-white font-bold">
                        JANUS
                    </Text>
                </View>
                <View className="w-full items-center gap-6">
                    <View className="w-full justify-end items-start gap-5">
                        <Text className="text-2xl color-white font-black">
                            Login
                        </Text>

                        {message &&
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
                            label="Email"
                            placeholder={t('login.emailPlaceholder')}
                            type="email-address"
                            icon={Mail}
                            value={email}
                            onChangeText={(newValue) => setEmail(newValue)}
                            errorMessage={emailError}
                        />
                        <View className="w-full items-end gap-[5px]">
                            <InputField
                                value={password}
                                onChangeText={(newValue) =>
                                    setPassword(newValue)
                                }
                                label={t('login.password')}
                                placeholder={t('login.passwordPlaceholder')}
                                icon={Lock}
                                isPassword
                                errorMessage={passwordError}
                            />
                            <TouchableOpacity
                                onPress={() => router.push('/forgotPassword')}
                            >
                                <Text className="text-sm color-emerald-400">
                                    {t('login.forgotPassword')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <CustomButton
                            text={isLoading ? 'Carregando...' : 'Login'}
                            mode="primary"
                            onPress={handleLogin}
                        />
                    </View>
                    <View className="w-full relative items-center">
                        <View className="w-2/5 h-[1px] bg-slate-300 absolute top-1/2 left-0" />
                        <Text className="color-white text-xl">
                            {t('login.or')}
                        </Text>
                        <View className="w-2/5 h-[1px] bg-slate-300 absolute top-1/2 right-0" />
                    </View>
                    <View className="w-full items-center gap-4">
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
                            onPress={() => router.push('/signup')}
                        >
                            <Text className="text-base color-white text-center ">
                                {t('login.dontHaveAnAccount')}{' '}
                                <Text className="color-emerald-400">
                                    {t('login.signUp')}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default Login;
