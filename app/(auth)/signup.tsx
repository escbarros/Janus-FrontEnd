import BackButton from '@/components/BackButton';
import CustomButton from '@/components/CustomButton';
import InputField from '@/components/TextInput';
import { useRouter } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SignUp = () => {
    const router = useRouter();
    const { t } = useTranslation();

    return (
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
                    <InputField
                        label={t('signup.name')}
                        placeholder={t('signup.namePlaceholder')}
                        icon={User}
                    />
                    <InputField
                        label={t('signup.email')}
                        placeholder={t('signup.emailPlaceholder')}
                        icon={Mail}
                    />
                    <InputField
                        label={t('signup.password')}
                        placeholder={t('signup.passwordPlaceholder')}
                        icon={Lock}
                        isPassword
                    />
                    <CustomButton text="Registrar" mode="primary" />
                    <View className="w-full relative items-center">
                        <View className="w-2/5 h-[1px] bg-slate-300 absolute top-1/2 left-0" />
                        <Text className="color-white text-xl">
                            {t('login.or')}
                        </Text>
                        <View className="w-2/5 h-[1px] bg-slate-300 absolute top-1/2 right-0" />
                    </View>
                    <CustomButton
                        text={t('login.loginWithGoogle')}
                        mode="secondary"
                        appendIcon="google"
                        iconLibrary="antdesign"
                    />
                    <TouchableOpacity
                        className="w-full"
                        onPress={() => router.push('/signup')}
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
    );
};

export default SignUp;
