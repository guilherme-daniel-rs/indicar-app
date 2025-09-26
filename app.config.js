export default {
  expo: {
    name: "IndiCar",
    slug: "indicar-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.indicar.app"
    },
    android: {
      package: "com.indicar.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-notifications",
      [
        "expo-image-picker",
        {
          photosPermission: "O app precisa acessar suas fotos para anexar imagens às avaliações.",
          cameraPermission: "O app precisa acessar a câmera para tirar fotos das avaliações."
        }
      ]
    ],
    extra: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || "https://your-api-domain.com:8080"
    }
  }
};
