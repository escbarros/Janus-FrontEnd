import CustomButton from '@/components/CustomButton';
import InputField from '@/components/TextInput';
import { images } from '@/constants';
import { Lock, Mail } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
    const { t } = useTranslation();
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
                        <InputField
                            label="Email"
                            placeholder={t('login.emailPlaceholder')}
                            type="email-address"
                            icon={Mail}
                        />
                        <View className="w-full items-end gap-[5px]">
                            <InputField
                                label={t('login.password')}
                                placeholder={t('login.passwordPlaceholder')}
                                icon={Lock}
                                isPassword
                            />
                            <TouchableOpacity>
                                <Text className="text-sm color-emerald-400">
                                    {t('login.forgotPassword')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <CustomButton text="Login" mode="primary" />
                    </View>
                    <View className="w-full relative items-center">
                        <View className="w-2/5 h-[2px] bg-slate-300 absolute top-1/2 left-0" />
                        <Text className="color-white text-xl">
                            {t('login.or')}
                        </Text>
                        <View className="w-2/5 h-[2px] bg-slate-300 absolute top-1/2 right-0" />
                    </View>
                    <View className="w-full items-center gap-4">
                        <CustomButton
                            text={t('login.loginWithGoogle')}
                            mode="secondary"
                            appendIcon="google"
                            iconLibrary="antdesign"
                        />
                        <Text className="text-base color-white ">
                            {t('login.dontHaveAnAccount')}{' '}
                            <Text className="color-emerald-400">
                                {t('login.signUp')}
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default Login;
