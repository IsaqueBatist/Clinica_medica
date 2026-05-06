module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // Reanimated 4 desacoplou os worklets num pacote separado. O plugin agora
    // mora em `react-native-worklets/plugin` (em v3 era `react-native-reanimated/plugin`).
    // Precisa ser o ÚLTIMO plugin da lista — exigência do próprio plugin.
    plugins: ["react-native-worklets/plugin"],
  };
};
