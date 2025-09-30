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
                name="[id]"
                options={{
                    title: 'Info',
                }}
            />
        </Stack>
    );
};

export default Layout;
