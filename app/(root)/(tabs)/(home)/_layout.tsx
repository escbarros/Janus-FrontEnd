import { Stack } from 'expo-router';
import React from 'react';

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Stack.Screen
                name="device-info"
                options={{
                    title: 'Device Info',
                }}
            />
            <Stack.Screen
                name="teste"
                options={{
                    title: 'Device Stream',
                }}
            />
        </Stack>
    );
};

export default Layout;
