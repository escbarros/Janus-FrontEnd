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
                    paddingVertical: 64,
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'setup',
                }}
            />
        </Stack>
    );
};

export default Layout;
