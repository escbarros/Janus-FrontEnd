import EventCard from '@/components/EventCard';
import IconButton from '@/components/IconButton';
import { images, log } from '@/constants';
import { useUserStore } from '@/store';
import { EventResponse } from '@/types/event';
import { api } from '@/utils/api/index';
import { useAuth } from '@clerk/clerk-expo';
import { Funnel } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';

const Notifications = () => {
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const { userId, getToken, isSignedIn } = useAuth();
    const { user } = useUserStore();

    const markEventAsRead = async (eventId: string) => {
        try {
            await api.markEventAsRead(eventId);
            setTimeout(() => {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === eventId
                            ? { ...event, readAt: new Date() }
                            : event,
                    ),
                );
            }, 2500);
        } catch (err) {
            console.error('Error marking event as read:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to mark event as read',
            );
        }
    };

    const fetchEvents = async () => {
        if (!isSignedIn || !userId || !user) {
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const token = await getToken();
            log.info('Fetching events with token:', token);
            if (token) {
                const userEvents = await api.getUserEvents(user.id, token);
                const unReadEvents = userEvents
                    .filter((event) => event.readAt === null)
                    .map((event) => event.id);

                unReadEvents.forEach((eventId) => markEventAsRead(eventId));
                setEvents(userEvents);
            }
        } catch (err) {
            log.error('Error fetching events:', err);
            setError(
                err instanceof Error ? err.message : 'Failed to fetch events',
            );
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await fetchEvents();
        } catch (error) {
            log.error('Error refreshing events:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true);
            await fetchEvents();
            setLoading(false);
        };

        loadEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderEvent = ({ item }: { item: EventResponse }) => {
        return (
            <EventCard
                id={item.id}
                type={item.type || 'DOORBELL'}
                datetime={item.timestamp}
                deviceId={item.device?.serialNumber}
                deviceName={item.device?.nickname}
                user={item.user}
                inviteId={item.inviteId}
                showDeviceName
                showBackground={item.readAt === null}
                isNewNotification={item.readAt === null}
            />
        );
    };

    if (loading) {
        return (
            <ScrollView
                className="w-full h-full bg-transparent"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-1"
            >
                <View className="w-full h-full bg-transparent pt-16 justify-center items-center">
                    <ActivityIndicator size="large" color="#fff" />
                    <Text className="color-white mt-4">
                        Carregando eventos...
                    </Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView
            className="w-full h-full bg-transparent"
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerClassName="flex-1"
            contentContainerStyle={{
                paddingTop: 64,
                overflow: 'visible',
            }}
        >
            <View className="w-full h-full bg-transparent px-6">
                <View className="w-full flex-row items-center justify-between">
                    <View className="flex-1" />
                    <Text className="flex-1 color-white w-100 text-center text-2xl font-bold">
                        Eventos
                    </Text>
                    <View className="flex-1 items-end">
                        <IconButton
                            icon={Funnel}
                            mode="secondary"
                            iconSize={14}
                        ></IconButton>
                    </View>
                </View>
                {events.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Image source={images.noEvents} className="mb-8" />
                        <Text className="color-white font-extrabold text-2xl mb-3">
                            Nenhum Evento
                        </Text>
                        <Text className="color-slate-300 text-center w-3/4">
                            Os eventos de seus dispositivos aparecerão aqui
                            quando forem disparados
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={events}
                        renderItem={renderEvent}
                        keyExtractor={(item) => item.id}
                        contentContainerClassName="gap-2"
                        className="flex-1 mt-11"
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                )}
            </View>
        </ScrollView>
    );
};

export default Notifications;
