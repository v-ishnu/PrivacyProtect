/**
 * metro.config.js
 *
 * Safe, async CommonJS Metro config that merges an SVG transformer config
 * with the default config returned by @react-native/metro-config.
 */

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  // get the default config (async)
  const defaultConfig = await getDefaultConfig(__dirname);

  // read the resolver arrays from the default config
  const { assetExts, sourceExts } = defaultConfig.resolver;

  // svg transformer configuration
  const svgConfig = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      // remove 'svg' from assetExts and add it to sourceExts
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
  };

  // merge and return
  return mergeConfig(defaultConfig, svgConfig);
})();
