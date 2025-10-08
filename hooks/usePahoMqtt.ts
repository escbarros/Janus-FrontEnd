import { log } from '@/constants';
import Paho, { Message } from 'paho-mqtt';
import { useCallback, useEffect, useRef, useState } from 'react';

const BROKER_URL =
    'wss://fa14e40249354fa380420881ee6bc48a.s1.eu.hivemq.cloud:8884/mqtt';

type ConnectionStatus =
    | 'Disconnected'
    | 'Connecting...'
    | 'Connected'
    | 'Error';

interface MqttMessage {
    topic: string;
    payload: string;
}

type MessageCallback = (payload: string) => void;

export function usePahoMqtt() {
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>('Disconnected');
    const [lastMessage, setLastMessage] = useState<MqttMessage | null>(null);
    const clientRef = useRef<Paho.Client | null>(null);
    const listenersRef = useRef<Record<string, MessageCallback>>({});
    const credentialsRef = useRef<{
        username: string;
        password: string;
    } | null>(null);

    // 🔁 Reconnect helper
    const reconnect = useCallback(() => {
        const creds = credentialsRef.current;
        if (!creds) return;
        log.warn('🔁 Tentando reconectar ao broker MQTT...');
        connect(creds.username, creds.password);
    }, []);

    const connect = useCallback(
        (username: string, password: string) => {
            credentialsRef.current = { username, password };

            if (clientRef.current?.isConnected()) {
                log.info('Client already connected.');
                return;
            }

            setConnectionStatus('Connecting...');
            log.info('Attempting to connect to HiveMQ Cloud broker...');

            const clientId = `paho_${Math.random().toString(16).slice(2, 10)}`;
            const client = new Paho.Client(BROKER_URL, clientId);
            clientRef.current = client;

            client.onConnectionLost = (responseObject: any) => {
                if (responseObject.errorCode !== 0) {
                    log.error('Connection lost:', responseObject.errorMessage);
                    setConnectionStatus('Error');
                    // 🔁 tenta reconectar após 3 segundos
                    setTimeout(reconnect, 3000);
                } else {
                    log.info('Connection closed cleanly.');
                    setConnectionStatus('Disconnected');
                }
            };

            client.onMessageArrived = (message: Paho.Message) => {
                const topic = message.destinationName;
                const payload = message.payloadString;
                setLastMessage({ topic, payload });

                const callback = listenersRef.current[topic];
                if (callback) callback(payload);
            };

            client.connect({
                userName: username,
                password: password,
                useSSL: true,
                timeout: 10,
                onSuccess: () => {
                    log.debug('✅ Conectado ao HiveMQ Cloud!');
                    setConnectionStatus('Connected');

                    // 🔄 re-subscreve em todos os tópicos registrados
                    Object.keys(listenersRef.current).forEach((topic) => {
                        client.subscribe(topic, {
                            qos: 1,
                            onSuccess: () =>
                                log.info(`Reinscrito em: ${topic}`),
                            onFailure: (err) =>
                                log.error(`Falha ao reinscrever ${topic}`, err),
                        });
                    });
                },
                onFailure: (responseObject: any) => {
                    log.error('Connection failed:', responseObject);
                    setConnectionStatus('Error');
                    // tenta reconectar depois de 5s
                    setTimeout(reconnect, 5000);
                },
            });
        },
        [reconnect],
    );

    const disconnect = useCallback(() => {
        if (clientRef.current?.isConnected()) {
            clientRef.current.disconnect();
            setConnectionStatus('Disconnected');
            log.info('Client disconnected.');
        }
    }, []);

    const publishMessage = useCallback((topic: string, message: string) => {
        if (clientRef.current?.isConnected()) {
            const messageObject = new Message(message);
            messageObject.destinationName = topic;
            messageObject.qos = 1;
            clientRef.current.send(messageObject);
            log.info(`📤 Mensagem enviada para '${topic}'`);
        } else {
            log.warn('Cannot publish: client is not connected.');
        }
    }, []);

    const subscribe = useCallback(
        (topic: string, callback: MessageCallback) => {
            listenersRef.current[topic] = callback;
            log.info(`🪝 Listener registrado para: ${topic}`);

            if (clientRef.current?.isConnected()) {
                clientRef.current.subscribe(topic, {
                    qos: 1,
                    onSuccess: () => log.info(`✅ Subscrito: ${topic}`),
                    onFailure: (err) =>
                        log.error(`❌ Falha ao subscrever ${topic}`, err),
                });
            }
        },
        [],
    );

    const unsubscribe = useCallback((topic: string) => {
        delete listenersRef.current[topic];
        log.info(`Listener removido para: ${topic}`);

        if (clientRef.current?.isConnected()) {
            clientRef.current.unsubscribe(topic, {
                onSuccess: () =>
                    log.info(`✅ Unsubscrito com sucesso: ${topic}`),
                onFailure: (err) =>
                    log.error(`❌ Falha ao unsubscribir ${topic}`, err),
            });
        }
    }, []);

    useEffect(() => {
        return () => {
            if (clientRef.current?.isConnected()) {
                clientRef.current.disconnect();
                log.info('🔌 Cliente MQTT desconectado no unmount.');
            }
        };
    }, []);

    return {
        connectionStatus,
        lastMessage,
        connect,
        disconnect,
        publishMessage,
        subscribe,
        unsubscribe,
    };
}
