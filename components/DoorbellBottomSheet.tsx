import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import { useCallback } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    Text,
    View,
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import CustomButton from './CustomButton';

interface DoorbellBottomSheetProps {
    deviceId: string | undefined;
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    imageUrl: string | null;
    datetime: string;
    deviceName: string | undefined;
}

const DoorbellBottomSheet = ({
    bottomSheetRef,
    datetime,
    deviceName,
    imageUrl,
    deviceId,
}: DoorbellBottomSheetProps) => {
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

    const handleDevicePress = () => {
        bottomSheetRef.current?.close();
        router.push(`/(root)/(tabs)/(home)/device-info?id=${deviceId}`);
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            enablePanDownToClose={true}
            enableHandlePanningGesture={true}
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
                    <View className="items-center">
                        <Text className="text-center color-white text-2xl font-extrabold">
                            Alguém está na sua porta
                        </Text>
                        <View className="flex-row items-center justify-center gap-3 mt-2">
                            <View className="flex-row items-center gap-1">
                                <MaterialCommunityIcons
                                    name="doorbell-video"
                                    size={16}
                                    color="#cbd5e1"
                                />
                                <Text className="text-slate-300 text-sm">
                                    {deviceName}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Calendar size={16} color="#cbd5e1" />
                                <Text className="text-slate-300 text-sm">
                                    {datetime}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="items-center mt-4 w-96 gap-3">
                        <View className="w-96 h-72 bg-slate-700 rounded-xl">
                            {imageUrl ? (
                                <Image
                                    source={{ uri: imageUrl }}
                                    className="w-full h-full rounded-xl"
                                    resizeMode="cover"
                                />
                            ) : (
                                <ActivityIndicator size="large" color="#fff" />
                            )}
                        </View>
                        <CustomButton
                            text="Acessar Interfone"
                            mode="primary"
                            onPress={handleDevicePress}
                        />
                    </View>
                </SafeAreaView>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default DoorbellBottomSheet;
