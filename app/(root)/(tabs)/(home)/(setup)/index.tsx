import BackButton from '@/components/BackButton';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View, ViewToken } from 'react-native';
import FoundStep from './components/FoundStep';
import PairingStep from './components/PairingStep';
import SearchingStep from './components/SearchingStep';
import WiFiListStep from './components/WiFiListStep';

const { width } = Dimensions.get('window');

interface SlideData {
    id: string;
    title: string;
    description: string;
    type: 'pairing' | 'searching' | 'found' | 'wifi';
}

const slides: SlideData[] = [
    {
        id: '1',
        title: 'Pairing',
        description:
            'Pressione e botão por 5 segundos ou até o led começar a pulsar com a cor verde',
        type: 'pairing',
    },
    {
        id: '2',
        title: 'Searching',
        description: 'Procurando dispositivo',
        type: 'searching',
    },
    {
        id: '3',
        title: 'Found',
        description: 'Dispositivo Encontrado!',
        type: 'found',
    },
    {
        id: '4',
        title: 'WiFi List',
        description: 'Conectar a internet',
        type: 'wifi',
    },
];

const DeviceSetup = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(
        ({
            viewableItems,
        }: {
            viewableItems: ViewToken<SlideData>[];
            changed: ViewToken<SlideData>[];
        }) => {
            if (viewableItems.length > 0) {
                setCurrentIndex(viewableItems[0].index ?? 0);
            }
        },
    ).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };

    const handleRetry = () => {
        // Volta para o step de searching
        const searchingIndex = slides.findIndex(
            (slide) => slide.type === 'searching',
        );
        if (searchingIndex !== -1) {
            flatListRef.current?.scrollToIndex({
                index: searchingIndex,
                animated: true,
            });
        }
    };

    const renderSlideContent = (item: SlideData) => {
        switch (item.type) {
            case 'pairing':
                return <PairingStep onNext={handleNext} />;

            case 'searching':
                return <SearchingStep onNext={handleNext} />;

            case 'found':
                return <FoundStep onNext={handleNext} onRetry={handleRetry} />;

            case 'wifi':
                return <WiFiListStep />;

            default:
                return null;
        }
    };

    const renderItem = ({ item }: { item: SlideData }) => {
        return (
            <View
                style={{ width: width - 48 }}
                className="w-full h-full justify-center items-center"
            >
                {renderSlideContent(item)}
            </View>
        );
    };

    return (
        <View className="w-full h-full bg-dark-background">
            <View className="flex-row items-center justify-between w-full">
                <BackButton />
                <Text className="text-white font-bold text-xl">
                    Novo Dispositivo
                </Text>
                <View className="w-6" />
            </View>

            <FlatList
                ref={flatListRef}
                data={slides}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                scrollEnabled={false}
            />

            {/* Pagination Dots */}
            <View className="flex-row justify-center items-center pb-12 gap-2">
                {slides.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 w-2 rounded-full transition-all ${
                            index === currentIndex
                                ? 'w-8 bg-emerald-400'
                                : 'w-2 bg-gray-600'
                        }`}
                    />
                ))}
            </View>
        </View>
    );
};

export default DeviceSetup;
