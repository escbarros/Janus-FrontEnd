module.exports = async () => {
    const fs = require('fs');
    const path = require('path');

    const __dirname = require('path').dirname(
        require('url').fileURLToPath(import.meta.url),
    );
    const localPropertiesPath = path.join(
        __dirname,
        '..',
        'android',
        'local.properties',
    );
    const sdkDir = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME;

    const content = `sdk.dir=${sdkDir.replace(/\\/g, '\\\\')}`;

    fs.writeFileSync(localPropertiesPath, content);
};
