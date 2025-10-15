import StreamChat from '@/components/StreamChat';
import { log } from '@/constants';
import { useMqtt } from '@/context/MqttContext';
import { api } from '@/utils/api';
import { useAuth, useUser } from '@clerk/clerk-expo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
    ChevronLeft,
    Cog,
    Lock,
    PhoneIcon,
    PhoneOff,
    Unlock,
} from 'lucide-react-native';
import { PiCamera } from 'picamera-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
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

export default function DeviceStream() {
    const rtcViewRef = useRef(null);
    const scrollViewRef = useRef<Animated.ScrollView>(null);

    const piCameraRef = useRef<PiCamera | null>(null);
    const { user } = useUser();
    const { getToken } = useAuth();
    const { publishMessage, subscribe } = useMqtt();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [isLoadingCommand, setIsLoadingCommand] = useState(false);
    const [message, setMessage] = useState('');
    const [lockState, setLockState] = useState<'locked' | 'unlocked'>(
        'unlocked',
    );
    const [peerStatus, setPeerStatus] =
        useState<RTCPeerConnectionState>('closed');

    const [callId, setCallId] = useState<string | null>(null);
    const [callHasStarted, setCallHasStarted] = useState(false);

    useEffect(() => {
        setCallHasStarted(callId !== null);
        log.warn('Call ID changed:', callId);
    }, [callId]);

    useEffect(() => {
        const topic = 'device/status/0fa98c5e-aaa0-427a-89e0-283cbb47a25f';
        subscribe(topic, (message) => {
            setIsLoadingCommand(false);
            const payload = JSON.parse(message);
            console.log('Received message on topic', topic, ':', payload);
            setLockState(payload.state);
            setCallId(payload.callId);
        });

        //startWebRTCStream();

        return endWebRTCStream;
    }, []);

    const startCall = async () => {
        const sn = '0fa98c5e-aaa0-427a-89e0-283cbb47a25f';
        const token = await getToken();
        console.log(token);
        if (!token) {
            log.error('No token found');
            return;
        }
        await api.startCall(sn, token).then((id) => {
            setCallHasStarted(true);
            console.log(id);
        });
    };

    const endCall = async () => {
        const sn = '0fa98c5e-aaa0-427a-89e0-283cbb47a25f';
        const token = await getToken();
        console.log(token);
        if (!token) {
            log.error('No token found');
            return;
        }

        await api.endCall(sn, token).then((id) => {
            setCallHasStarted(false);
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            log.info('Call ended', id);
        });
    };

    const startWebRTCStream = () => {
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

        client.onTimeout = endWebRTCStream;
        client.onStream = setRemoteStream;
        client.onConnectionState = setPeerStatus;
        client.connect();

        piCameraRef.current = client;
    };

    const endWebRTCStream = () => {
        if (piCameraRef.current) {
            piCameraRef.current.terminate();
            piCameraRef.current = null;
        }
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
            [height * (5 / 6), height * (2 / 6)],
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

    const blackBarStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            tranzincY.value,
            [0, height * 0.3],
            [0, 1],
            Extrapolation.CLAMP,
        );
        return {
            opacity,
            height: 64,
            backgroundColor: '#020617',
            position: 'absolute',
            bottom: 0,
            width: '100%',
        };
    });

    const handleToggleLock = () => {
        if (isLoadingCommand) return;
        const topic = lockState === 'locked' ? 'unlock' : 'lock';
        setIsLoadingCommand(true);
        publishMessage(
            `device/status/0fa98c5e-aaa0-427a-89e0-283cbb47a25f/command/${topic}`,
            JSON.stringify({
                userId: user?.id || 'unknown',
                state: topic,
                datetime: new Date().toISOString(),
            }),
        );
    };

    return (
        <SafeAreaView className="flex-1 justify-start items-start px-0 w-full">
            <Animated.View style={blackBarStyle} />
            <Animated.ScrollView
                className="w-full"
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEnabled={callHasStarted}
                showsVerticalScrollIndicator={false}
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
                        className="w-full bg-slate-800 rounded-2xl rounded-tl-none rounded-tr-none overflow-hidden relative items-start justify-start"
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
                        <TouchableOpacity
                            onPress={router.back}
                            className="h-10 w-10 bg-zinc-800/75 flex justify-center items-center border-[1px] border-zinc-400 rounded-full absolute top-10 left-5"
                        >
                            <ChevronLeft color={'#94a3b8'} size={18} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Light,
                                );
                                router.push(
                                    '/(root)/(tabs)/(home)/device-info',
                                );
                            }}
                            className="h-10 w-10 bg-zinc-800/75 flex justify-center items-center border-[1px] border-zinc-400 rounded-full absolute top-10 right-5"
                        >
                            <Cog size={18} color="#94a3b8" />
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
                        className="flex-col justify-start items-center w-full py-4 px-2"
                        style={{ height: height * (1 / 6) }}
                    >
                        <View className="w-1/3 h-[5px] bg-zinc-200 rounded-full" />
                        {callHasStarted ? (
                            <View className="flex-1 w-full h-1/6 flex-row justify-evenly items-center">
                                <TouchableOpacity
                                    onPress={handleToggleLock}
                                    className={`justify-center items-center rounded-full h-16 w-16 border-2 ${getStyle()}`}
                                >
                                    {isLoadingCommand ? (
                                        <ActivityIndicator color="white" />
                                    ) : lockState === 'locked' ? (
                                        <Unlock color={'white'} />
                                    ) : (
                                        <Lock color={'white'} />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`${isMicActive ? 'bg-emerald-400' : 'bg-red-400'} justify-center items-center rounded-full h-16 w-16`}
                                    onPress={() => {
                                        Haptics.impactAsync(
                                            Haptics.ImpactFeedbackStyle.Light,
                                        );
                                        setIsMicActive(!isMicActive);
                                    }}
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
                                    onPress={() => {
                                        Haptics.impactAsync(
                                            Haptics.ImpactFeedbackStyle.Light,
                                        );

                                        endCall();
                                    }}
                                >
                                    <PhoneOff color={'white'} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex-1 w-full h-1/6 flex-row justify-evenly items-center">
                                <TouchableOpacity
                                    className="justify-center items-center rounded-full bg-emerald-400 h-16 w-16"
                                    onPress={() => {
                                        Haptics.impactAsync(
                                            Haptics.ImpactFeedbackStyle.Light,
                                        );

                                        startCall();
                                    }}
                                >
                                    <PhoneIcon color={'white'} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Animated.View>
                {callId != null && <StreamChat callId={callId} />}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
