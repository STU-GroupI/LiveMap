module.exports = {
  preset: 'react-native',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest/setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
    '|react-native-vector-icons' +
    '|react-native-reanimated' +
    '|@react-native' +
    '|@react-navigation' +
    '|@react-native-masked-view' +
    '|masked-view' +
    ')/)',
  ],
};
