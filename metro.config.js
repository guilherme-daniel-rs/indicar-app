const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path mapping support
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@/api': path.resolve(__dirname, 'src/api'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/screens': path.resolve(__dirname, 'src/screens'),
  '@/store': path.resolve(__dirname, 'src/store'),
  '@/utils': path.resolve(__dirname, 'src/utils'),
  '@/theme': path.resolve(__dirname, 'src/theme'),
  '@/navigation': path.resolve(__dirname, 'src/navigation'),
};

// Fix for TurboModuleRegistry issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Ensure proper module resolution
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
