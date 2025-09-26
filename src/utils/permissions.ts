import * as ImagePicker from 'expo-image-picker';
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

// Notification permissions (temporariamente desabilitado)
export const requestNotificationPermissions = async (): Promise<boolean> => {
  return false; // Temporariamente desabilitado
};

// Get device push token (temporariamente desabilitado)
export const getDevicePushToken = async (): Promise<string | null> => {
  return null; // Temporariamente desabilitado
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
  return false; // Temporariamente desabilitado
};
