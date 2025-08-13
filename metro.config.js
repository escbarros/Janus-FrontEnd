const { getDefaultConfig } = require('expo/metro-config');
const resolveFrom = require('resolve-from');

const { withNativeWind } = require('nativewind/metro');
const {
    wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (
        moduleName === 'event-target-shim' &&
        context.originModulePath.includes('react-native-webrtc')
    ) {
        const eventTargetShimPath = resolveFrom(
            context.originModulePath,
            'event-target-shim/index.js',
        );

        return {
            filePath: eventTargetShimPath,
            type: 'sourceFile',
        };
    }

    return context.resolveRequest(context, moduleName, platform);
};
module.exports = wrapWithReanimatedMetroConfig(
    withNativeWind(config, { input: './global.css' }),
);
