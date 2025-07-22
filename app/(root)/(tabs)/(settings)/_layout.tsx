import { Stack } from 'expo-router';
import React from 'react';

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: 'transparent',
                    paddingHorizontal: 24,
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Settings',
                }}
            />
        </Stack>
    );
};

export default Layout;
