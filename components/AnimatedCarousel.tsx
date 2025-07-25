import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('screen');

// interface Device {
//     serialNumber: string;
//     name: string;
// }

interface AnimatedCarouselProps {
    items: number[];
}

const AnimatedCarouselItem = ({
    index,
    scrollX,
}: {
    index: number;
    scrollX: Animated.Value;
}) => {
    const itemWidth = width - 48;

    const inputRange = [
        (index - 1) * itemWidth,
        index * itemWidth,
        (index + 1) * itemWidth,
    ];

    const animatedHeight = scrollX.interpolate({
        inputRange,
        outputRange:
            index === -1 ? [300 * 0.9, 300, 300 * 0.9] : [300, 300, 300],
        extrapolate: 'clamp',
    });

    const animatedWidth = scrollX.interpolate({
        inputRange,
        outputRange:
            index === 1
                ? [itemWidth * 0.9, itemWidth, itemWidth * 0.9]
                : [itemWidth, itemWidth, itemWidth],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View
            style={{
                width: animatedWidth,
                height: animatedHeight,
                marginRight: 0,
            }}
            className="bg-slate-700 rounded-3xl overflow-hidden"
        ></Animated.View>
    );
};

const AnimatedCarousel = ({ items }: AnimatedCarouselProps) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);

    const carouselItems = items.slice(1);

    useEffect(() => {
        if (carouselItems.length > 1) {
            const itemWidth = width - 48;
            const initialOffset = itemWidth; // Offset para o segundo item (index 1)

            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    x: initialOffset,
                    animated: false,
                });
                scrollX.setValue(initialOffset);
            }, 100);
        }
    }, [scrollX, carouselItems.length]);

    if (carouselItems.length === 0) {
        return null;
    }

    return (
        <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ width, height: 300 }}
            contentContainerStyle={{
                paddingHorizontal: 24,
                alignItems: 'center',
                gap: 12,
            }}
            snapToInterval={width - 48}
            decelerationRate="fast"
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false },
            )}
            scrollEventThrottle={16}
        >
            {items.map((item, index) => (
                <AnimatedCarouselItem
                    key={index}
                    index={index}
                    scrollX={scrollX}
                ></AnimatedCarouselItem>
            ))}
        </Animated.ScrollView>
    );
};

export default AnimatedCarousel;
