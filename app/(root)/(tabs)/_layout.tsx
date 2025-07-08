import { Tabs } from 'expo-router';
import { Bell, Home, Settings } from 'lucide-react-native';
import { Dimensions, View } from 'react-native';
const { width } = Dimensions.get('screen');
export default function Layout() {
    const CustomTabIcon = ({
        size = 28,
        icon: Icon,
        focused,
    }: {
        color: string;
        size?: number;
        icon: any;
        focused: boolean;
    }) => (
        <View
            style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: focused ? '#34d399' : '#475569',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 1,
            }}
        >
            <Icon color={focused ? '#000000' : '#ffffff'} size={size} />
        </View>
    );

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#34d399',
                tabBarInactiveTintColor: '#a7f3d0',
                tabBarStyle: {
                    backgroundColor: '#020617',
                    borderTopWidth: 0,
                    elevation: 2,
                    height: 72,
                    borderRadius: 100,
                    alignItems: 'center',
                    position: 'absolute',
                    bottom: 0,
                    width: 250,
                    marginLeft: (width - 310) / 2, // Não faço ideia
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                },
                tabBarShowLabel: false,
                sceneStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabIcon
                            color={color}
                            icon={Home}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabIcon
                            color={color}
                            icon={Bell}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused }) => (
                        <CustomTabIcon
                            color={color}
                            icon={Settings}
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
