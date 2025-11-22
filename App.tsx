import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { ToastContainer } from '@/components/ToastContainer';
import { useAuthStore } from '@/store/auth.store';
import { deviceApi } from '@/api/authApi';
import { getDevicePushToken } from '@/utils/permissions';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();
  }, []);

  useEffect(() => {
    // Register device when user is authenticated
    if (isAuthenticated && user) {
      registerDevice();
    }
  }, [isAuthenticated, user]);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  const registerDevice = async () => {
    try {
      const { accessToken } = useAuthStore.getState();
      if (!accessToken) return;
      
      const pushToken = await getDevicePushToken();
      if (pushToken) {
        await deviceApi.register({
          device_token: pushToken,
          platform: Platform.OS as 'ios' | 'android',
        }, accessToken);
        console.log('Device registered successfully');
      } else {
        console.log('Push token not available, skipping device registration');
      }
    } catch (error) {
      console.warn('Device registration failed (this is normal in development):', (error as Error).message);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
        <ToastContainer />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
