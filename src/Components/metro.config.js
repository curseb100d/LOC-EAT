const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(_dirname);

const defaultConfig = getDefaultConfig(_dirname);
defaultConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;