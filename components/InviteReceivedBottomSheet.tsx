import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Calendar } from 'lucide-react-native';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import CustomButton from './CustomButton';

interface InviteReceivedBottomSheetProps {
    deviceId: string | undefined;
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    datetime: string;
    deviceName: string | undefined;
}

const InviteReceivedBottomSheet = ({
    bottomSheetRef,
    datetime,
    deviceName,
}: InviteReceivedBottomSheetProps) => {
    const snapPoints = ['33%'];

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
            enablePanDownToClose={true}
            enableHandlePanningGesture={true}
            enableContentPanningGesture={true}
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
                className="flex-1 p-6 "
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
            >
                <View className="w-full items-center justify-center gap-2">
                    <Text className="text-center color-white text-2xl font-extrabold">
                        Convite Recebido
                    </Text>
                    <View className="flex-row items-center justify-center gap-3">
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
                    <CustomButton text="Aceitar" mode="primary" />
                    <CustomButton text="Recusar" mode="reject" />
                </View>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default InviteReceivedBottomSheet;
