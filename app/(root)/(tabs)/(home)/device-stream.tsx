import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Lock, PhoneOff } from 'lucide-react-native';
import { PiCamera } from 'picamera-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaStream, RTCView } from 'react-native-webrtc';

const { height } = Dimensions.get('window');

export default function Teste() {
    const rtcViewRef = useRef(null);
    const piCameraRef = useRef<PiCamera | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [peerStatus, setPeerStatus] =
        useState<RTCPeerConnectionState>('closed');
    useEffect(() => {
        startCall();
        return endCall;
    }, []);

    const startCall = () => {
        const client = new PiCamera({
            deviceUid: '0fa98c5e-aaa0-427a-89e0-283cbb47a25f',
            mqttHost: 'fa14e40249354fa380420881ee6bc48a.s1.eu.hivemq.cloud',
            mqttPath: '/mqtt',
            mqttPort: 8884, // Websocket Port
            mqttUsername: 'usuario',
            mqttPassword: 'Senha@123',
            stunUrls: [
                'stun:stun1.l.google.com:19302',
                'stun:stun2.l.google.com:19302',
            ],
        });

        client.onTimeout = endCall;
        client.onStream = setRemoteStream;
        client.onSnapshot = handleImage;
        client.onConnectionState = setPeerStatus;
        client.connect();

        piCameraRef.current = client;
    };

    const endCall = () => {
        if (piCameraRef.current) {
            piCameraRef.current.terminate();
            piCameraRef.current = null;
        }
    };

    const handleImage = (base64: string) => {
        // receive a base64 image to do something
        console.log('Image received', base64);
    };

    const [isMicActive, setIsMicActive] = useState(true);

    const getStyle = () => {
        return 'border-transparent bg-slate-700';
    };

    const tranzincY = useSharedValue(0);
    const handleScroll = useAnimatedScrollHandler((event) => {
        tranzincY.value = event.contentOffset.y;
    });

    const animatedStyle = useAnimatedStyle(() => {
        const heightInterpolated = interpolate(
            tranzincY.value,
            [0, height * 0.2],
            [height * (4.5 / 6), height * (2 / 6)],
            Extrapolation.CLAMP,
        );
        return {
            height: heightInterpolated,
        };
    });

    const padTopStyle = useAnimatedStyle(() => {
        const paddingTopInterpolated = interpolate(
            tranzincY.value,
            [0, height * 0.15],
            [0, 200],
            Extrapolation.CLAMP,
        );
        return {
            paddingTop: paddingTopInterpolated,
        };
    });

    return (
        <SafeAreaView className="flex-1 justify-start items-start px-2">
            <Animated.ScrollView
                className="w-full"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                }}
            >
                <Animated.View
                    className="w-full justify-start items-start"
                    style={[padTopStyle]}
                >
                    <Animated.View
                        className="w-full bg-slate-800 rounded-2xl overflow-hidden relative items-start justify-start"
                        style={[animatedStyle]}
                    >
                        {remoteStream && (
                            <RTCView
                                ref={rtcViewRef}
                                collapsable={false}
                                streamURL={remoteStream.toURL()}
                                objectFit={'cover'}
                                style={{ width: '100%', height: '100%' }}
                            />
                        )}
                        <TouchableOpacity className="h-10 w-10 bg-zinc-800/75 flex justify-center items-center border-[1px] border-zinc-400 rounded-full absolute top-10 left-5">
                            <Ionicons
                                name="arrow-back"
                                size={18}
                                color="#94a3b8"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity className="h-10 w-10 bg-zinc-800/75 flex justify-center items-center border-[1px] border-zinc-400 rounded-full absolute top-10 right-5">
                            <MaterialCommunityIcons
                                name="dots-horizontal"
                                size={18}
                                color="#94a3b8"
                            />
                        </TouchableOpacity>
                        <View className="absolute bottom-10 left-5 flex-row items-center">
                            <View className="p-2 bg-zinc-400 rounded-md rounded-tr-none rounded-br-none">
                                <FontAwesome
                                    name="video-camera"
                                    size={18}
                                    color="white"
                                />
                            </View>
                            <View className="flex-1 h-full w-[10px] inline-block items-center justify-center">
                                <Text className="self-start bg-zinc-400/50 px-5 h-full items-center align-middle color-white rounded-md rounded-tl-none rounded-bl-none font-bold">
                                    Camera da fechadura
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                    {/* Controls */}
                    <View
                        className="flex-col justify-start items-center w-full py-4"
                        style={{ height: height * (1 / 6) }}
                    >
                        <View className="w-1/3 h-[5px] bg-zinc-200 rounded-full" />
                        <View className="flex-1 w-full h-1/6 flex-row justify-evenly items-center">
                            <TouchableOpacity
                                className={`justify-center items-center rounded-full h-16 w-16 border-2 ${getStyle()}`}
                            >
                                <Lock color={'white'} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="justify-center items-center rounded-full bg-emerald-400 h-16 w-16"
                                onPress={() => setIsMicActive(!isMicActive)}
                            >
                                <FontAwesome
                                    name={
                                        isMicActive
                                            ? 'microphone'
                                            : 'microphone-slash'
                                    }
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="justify-center items-center rounded-full bg-slate-700 h-16 w-16"
                                onPress={endCall}
                            >
                                <PhoneOff color={'white'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
                <View
                    className="w-full flex-col justify-start items-start relative"
                    style={{ height: height * 0.5 }}
                >
                    <View className="w-full px-2 h-4/6 gap-y-8 relative">
                        <View className="w-full">
                            <Text className="color-indigo-300 text-2xl font-black">
                                Transcrição
                            </Text>
                            <View className="w-full flex-row justify-start items-center gap-x-2">
                                <Text className="color-indigo-100 text-base font-light">
                                    Abaixo estará a transcrição feita por IA
                                </Text>
                                <Ionicons
                                    name="sparkles"
                                    size={12}
                                    color="#e0e7ff"
                                    className="mr-2"
                                />
                            </View>
                        </View>
                        <View className="w-full h-full overflow-hidden">
                            <ScrollView className="w-full h-full gap-y-4 overflow-hidden">
                                <View className="w-full gap-y-4 border-indigo-200 min-h-10 border rounded-md bg-indigo-500/10 p-4 mb-4">
                                    <View className="rounded-full bg-indigo-500/30 self-start py-1 px-4">
                                        <Text className="text-sm text-indigo-100">
                                            00:05
                                        </Text>
                                    </View>
                                    <Text className="text-base text-indigo-100">
                                        Oi, tudo bem?
                                    </Text>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                    <View className="absolute bottom-0 w-full h-16 items-center justify-start p-2 pt-4 flex-row gap-x-2">
                        <TextInput
                            className="w-5/6 h-full bg-indigo-500/10 border border-indigo-300 rounded-md px-2 color-zinc-100"
                            placeholder="Digite uma mensagem"
                            placeholderTextColor="#e0e7ff"
                        />
                        <TouchableOpacity className="bg-indigo-300 w-1/6 h-full rounded-xl justify-center items-center">
                            <Ionicons
                                name="paper-plane"
                                size={16}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
