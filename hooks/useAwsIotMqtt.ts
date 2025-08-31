// hooks/useAwsIotMqtt.ts

import { Amplify } from 'aws-amplify';
import {
    fetchAuthSession,
    getCurrentUser,
    signIn,
    signOut,
} from 'aws-amplify/auth';

import { Buffer } from 'buffer';
import mqtt, { MqttClient } from 'mqtt';
import { useCallback, useEffect, useRef, useState } from 'react';

// Ferramentas do AWS SDK v3 para assinar a URL
import { log } from '@/constants';
import { Sha256 } from '@aws-crypto/sha256-js';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { SignatureV4 } from '@aws-sdk/signature-v4';

// Polyfill necessário
global.Buffer = Buffer;

// --- CONFIGURAÇÃO (mesma de antes) ---
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-2_RrgH4RcHY',
            userPoolClientId: '1aleamhb0297gms6ki6nivth2t',
            identityPoolId: 'us-east-2:5e81a987-03aa-4df2-bc5d-d0da89638649',
        },
    },
});

const AWS_IOT_ENDPOINT = 'ap6jqdaojmxrl-ats.iot.us-east-2.amazonaws.com';
const AWS_REGION = 'us-east-2';
// --- FIM DA CONFIGURAÇÃO ---

type ConnectionStatus =
    | 'Disconnected'
    | 'Connecting...'
    | 'Connected'
    | 'Error'
    | 'Credentials Error';

export function useAwsIotMqtt() {
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>('Disconnected');
    const [lastMessage, setLastMessage] = useState<{
        topic: string;
        payload: string;
    } | null>(null);
    const clientRef = useRef<MqttClient | null>(null);

    // Efeito para limpar a conexão ao sair
    useEffect(() => {
        return () => {
            if (clientRef.current) {
                clientRef.current.end(true);
            }
        };
    }, []);

    // Função para conectar ao Broker MQTT
    const connectToMqtt = useCallback(async () => {
        if (clientRef.current) {
            clientRef.current.end(true);
        }
        setConnectionStatus('Connecting...');

        try {
            // 1. Obter credenciais temporárias do Cognito
            const session = await fetchAuthSession({ forceRefresh: true });
            const credentials = session.credentials;
            if (!credentials) {
                setConnectionStatus('Credentials Error');
                return;
            }

            // 2. Criar e assinar a URL de conexão WebSocket com o SDK v3
            const signer = new SignatureV4({
                credentials,
                region: AWS_REGION,
                service: 'iotdevicegateway',
                sha256: Sha256,
            });

            const request = new HttpRequest({
                method: 'GET',
                protocol: 'wss:',
                hostname: AWS_IOT_ENDPOINT,
                path: '/mqtt',
                headers: {
                    host: AWS_IOT_ENDPOINT,
                },
            });

            const signedRequest = await signer.presign(request, {
                expiresIn: 3600,
            });

            const signedUrl = `${signedRequest.protocol}//${signedRequest.hostname}${signedRequest.path}`;

            log.debug('Conectando ao AWS IoT com a URL assinada...');
            const client = mqtt.connect(signedUrl, {
                reconnectPeriod: 0,
            });
            clientRef.current = client;

            client.on('connect', () => {
                log.debug('Conectado ao AWS IoT');
                setConnectionStatus('Connected');
            });
            client.on('error', (err) => {
                log.error('Connection error:', err);
                setConnectionStatus('Error');
            });
            client.on('close', () => {
                console.log('Conexão fechada');
                setConnectionStatus('Disconnected');
            });
            client.on('message', (topic, payload) => {
                const message = payload.toString();
                setLastMessage({ topic, payload: message });
                console.log(
                    `Mensagem recebida: Tópico='${topic}', Mensagem='${message}'`,
                );
            });
        } catch (err) {
            console.error('Erro na configuração da conexão:', err);
            setConnectionStatus('Error');
        }
    }, []);

    const signInUser = useCallback(
        async (username: string, password: string) => {
            try {
                const { isSignedIn } = await signIn({ username, password });
                if (isSignedIn) {
                    log.debug('Usuário autenticado com sucesso');
                    const creds = await getCurrentUser(); // ou Auth.currentCredentials()
                    console.log('identityId =', creds); // formato: us-east-2:xxxxxxxx-xxxx-....
                    await connectToMqtt();
                }
                return isSignedIn;
            } catch (err) {
                console.error('Erro no login:', err);
                await signOutUser();
                return false;
            }
        },
        [connectToMqtt],
    );

    const signOutUser = useCallback(async () => {
        if (clientRef.current) {
            clientRef.current.end(true);
        }
        await signOut();
        setConnectionStatus('Disconnected');
    }, []);

    const publishMessage = useCallback((topic: string, message: any) => {
        log.debug(`Publicando na tópico '${topic}':`, message);
        if (clientRef.current?.connected) {
            log.debug('Cliente MQTT conectado, publicando mensagem...');
            clientRef.current.publish(topic, message, { qos: 1 });
        } else {
            log.warn('Cliente MQTT não conectado, mensagem não publicada.');
            log.warn(clientRef);
        }
    }, []);

    const subscribeToTopic = useCallback((topic: string) => {
        if (clientRef.current?.connected) {
            clientRef.current.subscribe(topic, { qos: 1 });
        }
    }, []);

    return {
        connectionStatus,
        lastMessage,
        signInUser,
        signOutUser,
        publishMessage,
        subscribeToTopic,
    };
}
