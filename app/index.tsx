import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import '../global.css';

export default function Index() {
    const { t } = useTranslation();

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <Text className="font-sans font-black text-2xl">
                {t('welcomeMessage')}
            </Text>
        </View>
    );
}
