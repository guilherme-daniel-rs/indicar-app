import * as ImagePicker from 'expo-image-picker';
// import * as Notifications from 'expo-notifications'; // Push notifications desativadas
import { Platform } from 'react-native';

// Image picker permissions
export const requestImagePickerPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return false;
      }

      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error('Error requesting image picker permissions:', error);
    return false;
  }
};

// Notification permissions - DESATIVADO
export const requestNotificationPermissions = async (): Promise<boolean> => {
  // Push notifications desativadas temporariamente
  return false;
  // try {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   return status === 'granted';
  // } catch (error) {
  //   console.error('Error requesting notification permissions:', error);
  //   return false;
  // }
};

// Get device push token - DESATIVADO
export const getDevicePushToken = async (): Promise<string | null> => {
  // Push notifications desativadas temporariamente
  return null;
  // try {
  //   // Verifica se o PROJECT_ID está configurado
  //   if (!process.env.EXPO_PUBLIC_PROJECT_ID) {
  //     console.warn('EXPO_PUBLIC_PROJECT_ID not configured, skipping push token generation');
  //     return null;
  //   }

  //   const token = await Notifications.getExpoPushTokenAsync({
  //     projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  //   });
  //   return token.data;
  // } catch (error) {
  //   console.warn('Push notifications not available (this is normal in development):', (error as Error).message);
  //   return null;
  // }
};

// Check if permissions are granted
export const checkImagePickerPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      return true;
    }

    const mediaLibraryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.getCameraPermissionsAsync();

    return mediaLibraryStatus.status === 'granted' && cameraStatus.status === 'granted';
  } catch (error) {
    console.error('Error checking image picker permissions:', error);
    return false;
  }
};

export const checkNotificationPermissions = async (): Promise<boolean> => {
  // Push notifications desativadas temporariamente
  return false;
  // try {
  //   const { status } = await Notifications.getPermissionsAsync();
  //   return status === 'granted';
  // } catch (error) {
  //   console.error('Error checking notification permissions:', error);
  //   return false;
  // }
};
