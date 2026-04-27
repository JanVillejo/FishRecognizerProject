const {getDefaultConfig} = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Fix Windows file watcher issue — use polling instead of native fs.watch
config.watcher = {
  watchman: {
    deferStates: [],
  },
  additionalExts: [],
  healthCheck: {
    enabled: false,
  },
};

// Fix: block ALL native build/cpp folders inside node_modules
config.resolver.blockList = [
  /.*node_modules[/\\].*[/\\]android[/\\]build[/\\].*/,
  /.*node_modules[/\\].*[/\\]android[/\\]\.cxx[/\\].*/,
  /.*node_modules[/\\].*[/\\]android[/\\]src[/\\]main[/\\]cpp[/\\].*/,
  /.*node_modules[/\\].*[/\\]build[/\\]intermediates[/\\].*/,
  /.*\.cxx[/\\].*/,
  /.*CMakeFiles[/\\].*/,
];

// tflite asset support
config.resolver.assetExts = [
  ...(config.resolver.assetExts || []),
  'tflite',
];

module.exports = config;