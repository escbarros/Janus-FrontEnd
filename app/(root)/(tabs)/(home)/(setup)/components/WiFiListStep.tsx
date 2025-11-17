import CustomButton from '@/components/CustomButton';
import { ChevronRight, Lock, Wifi } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    PermissionsAndroid,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

interface WifiNetwork {
    SSID: string;
    BSSID: string;
    capabilities: string;
    frequency: number;
    level: number;
    timestamp: number;
}

interface WiFiListStepProps {
    onNext?: () => void;
}

const WiFiListStep: React.FC<WiFiListStepProps> = ({ onNext }) => {
    const [networks, setNetworks] = useState<WifiNetwork[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(
        null,
    );
    const [password, setPassword] = useState('');
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Permissão de Localização',
                        message:
                            'Precisamos de permissão de localização para escanear redes WiFi',
                        buttonNeutral: 'Perguntar depois',
                        buttonNegative: 'Cancelar',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        const loadWifiNetworks = async () => {
            setLoading(true);
            try {
                const hasPermission = await requestPermissions();
                if (!hasPermission) {
                    Alert.alert(
                        'Permissão Necessária',
                        'Precisamos de permissão de localização para escanear redes WiFi',
                    );
                    setLoading(false);
                    return;
                }

                const wifiList = await WifiManager.loadWifiList();
                const uniqueNetworks = wifiList
                    .filter(
                        (network, index, self) =>
                            index ===
                            self.findIndex((n) => n.SSID === network.SSID),
                    )
                    .sort((a, b) => b.level - a.level);

                setNetworks(uniqueNetworks);
            } catch (error) {
                console.error('Erro ao carregar redes WiFi:', error);
                Alert.alert('Erro', 'Não foi possível carregar as redes WiFi');
            } finally {
                setLoading(false);
            }
        };

        loadWifiNetworks();
    }, []);

    const isNetworkSecured = (capabilities: string) => {
        return (
            capabilities.includes('WPA') ||
            capabilities.includes('WEP') ||
            capabilities.includes('PSK')
        );
    };

    const handleNetworkPress = (network: WifiNetwork) => {
        setSelectedNetwork(network);
        if (isNetworkSecured(network.capabilities)) {
            setShowPasswordInput(true);
        }
    };

    const handleConnect = () => {
        if (selectedNetwork && onNext) {
            setIsConnecting(true);
            setTimeout(() => {
                setIsConnecting(false);
                onNext();
            }, 3000);
        }
    };

    const renderWifiItem = ({ item }: { item: WifiNetwork }) => {
        const isSecured = isNetworkSecured(item.capabilities);
        const signalStrength = item.level;
        const signalBars =
            signalStrength > -50 ? 3 : signalStrength > -70 ? 2 : 1;

        return (
            <Pressable
                className="flex-row items-center justify-between bg-dark-card py-4 px-4 mb-2 rounded-lg active:opacity-70 w-full"
                onPress={() => handleNetworkPress(item)}
            >
                <View className="flex-row items-center gap-3 flex-1">
                    <Wifi size={20} color="#14b8a6" strokeWidth={signalBars} />
                    <View className="flex-1">
                        <Text
                            className="text-white font-medium"
                            numberOfLines={1}
                        >
                            {item.SSID || 'Rede Oculta'}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                            {isSecured ? 'Protegida' : 'Aberta'} • Sinal:{' '}
                            {signalStrength} dBm
                        </Text>
                    </View>
                </View>
                <View className="flex-row items-center gap-2">
                    {isSecured && <Lock size={16} color="#9ca3af" />}
                    <ChevronRight size={20} color="#9ca3af" strokeWidth={2} />
                </View>
            </Pressable>
        );
    };

    if (showPasswordInput && selectedNetwork) {
        if (isConnecting) {
            return (
                <View className="flex-1 items-center justify-center px-8">
                    <ActivityIndicator size="large" color="#14b8a6" />
                    <Text className="text-white text-xl font-bold mt-8 mb-2">
                        Conectando à {selectedNetwork.SSID}
                    </Text>
                    <Text className="text-gray-400 text-sm text-center">
                        Aguarde enquanto estabelecemos a conexão...
                    </Text>
                </View>
            );
        }

        return (
            <View className="flex-1 items-center justify-center px-8">
                <Wifi size={64} color="#14b8a6" strokeWidth={1.5} />
                <Text className="text-white text-xl font-bold mt-8 mb-2">
                    Conectar à {selectedNetwork.SSID}
                </Text>
                <Text className="text-gray-400 text-sm mb-8 text-center">
                    Digite a senha da rede WiFi
                </Text>

                <View className="w-full mb-6">
                    <TextInput
                        className="bg-dark-card text-white px-4 py-3 rounded-lg"
                        placeholder="Senha"
                        placeholderTextColor="#9ca3af"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoFocus
                    />
                </View>

                <View className="w-full gap-3">
                    <CustomButton text="Conectar" onPress={handleConnect} />
                    <CustomButton
                        text="Cancelar"
                        mode="secondary"
                        onPress={() => {
                            setShowPasswordInput(false);
                            setPassword('');
                            setSelectedNetwork(null);
                        }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 items-center justify-start pt-8 w-full">
            <Text className="text-white text-xl font-bold mb-2">
                Conectar a internet
            </Text>
            <Text className="text-gray-400 text-sm mb-4">
                Selecione uma rede WiFi para conectar ao novo dispositivo
            </Text>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#14b8a6" />
                    <Text className="text-gray-400 mt-4">
                        Procurando redes WiFi...
                    </Text>
                </View>
            ) : networks.length === 0 ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Wifi size={64} color="#9ca3af" strokeWidth={1.5} />
                    <Text className="text-white text-lg font-bold mt-4 mb-2">
                        Nenhuma rede encontrada
                    </Text>
                    <Text className="text-gray-400 text-center">
                        Toque em Atualizar Lista para procurar novamente
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={networks}
                    renderItem={renderWifiItem}
                    keyExtractor={(item, index) => `${item.SSID}-${index}`}
                    className="w-full"
                    contentContainerClassName="w-full"
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default WiFiListStep;
