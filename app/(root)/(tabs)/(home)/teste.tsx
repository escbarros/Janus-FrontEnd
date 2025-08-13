import { PiCamera } from 'picamera-react-native';
import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { MediaStream, RTCView } from 'react-native-webrtc';

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

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ color: 'white', fontSize: 24 }}>Device Stream</Text>
            {remoteStream && (
                <RTCView
                    ref={rtcViewRef}
                    streamURL={remoteStream.toURL()}
                    objectFit={'contain'}
                    style={{ flex: 1 }}
                />
            )}
        </View>
    );
}
