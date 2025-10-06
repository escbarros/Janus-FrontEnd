import { InviteDetails } from '@/types/invite';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
    BriefcaseBusiness,
    Calendar,
    SendHorizonal,
} from 'lucide-react-native';
import { useCallback } from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { Easing } from 'react-native-reanimated';
import CustomButton from './CustomButton';
interface UserProps {
    id: string;
    name: string;
    picUrl: string;
}
interface InviteSentBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheet | null>;
    datetime: string;
    deviceName: string | undefined;
    user: UserProps;
    invite: InviteDetails | null;
}

const InviteSentBottomSheet = ({
    bottomSheetRef,
    datetime,
    deviceName,
    user,
    invite,
}: InviteSentBottomSheetProps) => {
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
            enableDynamicSizing
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
                className="flex-1 p-6 mb-0"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <SafeAreaView className="w-full items-center justify-center gap-2 pb-[72px]">
                    <Text className="text-center color-white text-2xl font-extrabold">
                        Convite Enviado
                    </Text>
                    <View className="flex-row items-center justify-center gap-3 w-full">
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
                    <View className="flex-row items-center justify-around px-4 w-full">
                        <View className="flex-row items-center justify-center gap-1">
                            <Image
                                source={{ uri: user.picUrl }}
                                className="h-4 w-4 rounded-full bg-slate-600 overflow-hidden"
                            />
                            <Text className="color-slate-300 font-medium text-sm ">
                                Por {user.name}
                            </Text>
                        </View>
                        <SendHorizonal color="#cbd5e1" size={12} />
                        <View className="flex-row items-center justify-center gap-1">
                            <Image
                                source={{ uri: user.picUrl }}
                                className="h-4 w-4 rounded-full bg-slate-600 overflow-hidden"
                            />
                            <Text className="color-slate-300 font-medium text-sm ">
                                Para {invite?.receiver?.name?.split(' ')[0]}
                            </Text>
                        </View>
                    </View>
                    <View className="flex-row items-center justify-center gap-1 w-full">
                        <BriefcaseBusiness color="#cbd5e1" size={12} />
                        <Text className="color-slate-300 font-medium text-sm">
                            {invite?.accessLevel}
                        </Text>
                    </View>
                    <View className="w-full mt-6">
                        <CustomButton text="Revogar Convite" mode="reject" />
                    </View>
                </SafeAreaView>
            </BottomSheetScrollView>
        </BottomSheet>
    );
};

export default InviteSentBottomSheet;
