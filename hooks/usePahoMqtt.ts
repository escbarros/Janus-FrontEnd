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

    useEffect(() => {
        return () => {
            if (clientRef.current?.isConnected()) {
                clientRef.current.disconnect();
            }
        };
    }, []);

    const connect = useCallback((username: string, password: string) => {
        if (clientRef.current?.isConnected()) {
            log.info('Client already connected.');
            return;
        }

        setConnectionStatus('Connecting...');
        console.log('Attempting to connect to HiveMQ Cloud broker...');

        const clientId = `paho_${Math.random().toString(16).substr(2, 8)}`;
        const client = new Paho.Client(BROKER_URL, clientId);
        clientRef.current = client;

        client.onConnectionLost = (responseObject: any) => {
            if (responseObject.errorCode !== 0) {
                log.error('Connection lost:', responseObject.errorMessage);
                setConnectionStatus('Error');
            } else {
                log.info('Connection lost.');
                setConnectionStatus('Disconnected');
            }
        };

        client.onMessageArrived = (message: Paho.Message) => {
            const topic = message.destinationName;
            const payload = message.payloadString;

            setLastMessage({ topic, payload });

            if (listenersRef.current[topic]) {
                listenersRef.current[topic](payload);
            }
        };

        client.connect({
            userName: username,
            password: password,
            useSSL: true,
            timeout: 10,
            onSuccess: () => {
                log.info('Successfully connected to HiveMQ Cloud!');
                setConnectionStatus('Connected');

                Object.keys(listenersRef.current).forEach((topic) => {
                    client.subscribe(topic, {
                        qos: 1,
                        onSuccess: () =>
                            log.info(
                                `Subscribed to pre-registered topic: ${topic}`,
                            ),
                        onFailure: (err) =>
                            log.error(`Failed to subscribe to ${topic}`, err),
                    });
                });
            },
            onFailure: (responseObject: any) => {
                log.error('Connection failed:', responseObject);
                setConnectionStatus('Error');
            },
        });
    }, []);

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
            log.info(`Message sent to topic '${topic}'`);
        } else {
            log.warn('Cannot publish: client is not connected.');
        }
    }, []);

    const subscribe = useCallback(
        (topic: string, callback: MessageCallback) => {
            listenersRef.current[topic] = callback;
            log.info(`Listener registered for topic: ${topic}`);

            if (clientRef.current?.isConnected()) {
                clientRef.current.subscribe(topic, {
                    qos: 1,
                    onSuccess: () => {
                        log.info(`Successfully subscribed to topic: ${topic}`);
                    },
                    onFailure: (responseObject: any) => {
                        log.error(
                            `Failed to subscribe to topic ${topic}`,
                            responseObject,
                        );
                    },
                });
            }
        },
        [],
    );

    const unsubscribe = useCallback((topic: string) => {
        delete listenersRef.current[topic];
        log.info(`Listener removed for topic: ${topic}`);

        if (clientRef.current?.isConnected()) {
            clientRef.current.unsubscribe(topic, {
                onSuccess: () => {
                    log.info(`Successfully unsubscribed from topic: ${topic}`);
                },
                onFailure: (responseObject: any) => {
                    log.error(
                        `Failed to unsubscribe from topic ${topic}`,
                        responseObject,
                    );
                },
            });
        }
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
