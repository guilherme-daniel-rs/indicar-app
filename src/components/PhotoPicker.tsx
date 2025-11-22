import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { requestImagePickerPermissions } from '@/utils/permissions';

interface PhotoPickerProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const photoSize = (screenWidth - theme.spacing.md * 3) / 2;

export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photos,
  onPhotosChange,
  maxPhotos = 10,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPhoto = async () => {
    if (disabled || isLoading) return;

    try {
      const hasPermission = await requestImagePickerPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permissão necessária',
          'É necessário permitir o acesso à câmera e galeria para adicionar fotos.'
        );
        return;
      }

      Alert.alert(
        'Adicionar foto',
        'Escolha uma opção',
        [
          {
            text: 'Câmera',
            onPress: () => openCamera(),
          },
          {
            text: 'Galeria',
            onPress: () => openImageLibrary(),
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error adding photo:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a foto.');
    }
  };

  const openCamera = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        addPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    } finally {
      setIsLoading(false);
    }
  };

  const openImageLibrary = async () => {
    try {
      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: maxPhotos - photos.length,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newPhotos = result.assets.map(asset => asset.uri);
        onPhotosChange([...photos, ...newPhotos]);
      }
    } catch (error) {
      console.error('Error opening image library:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    } finally {
      setIsLoading(false);
    }
  };

  const addPhoto = (uri: string) => {
    if (photos.length >= maxPhotos) {
      Alert.alert('Limite atingido', `Você pode adicionar no máximo ${maxPhotos} fotos.`);
      return;
    }
    onPhotosChange([...photos, uri]);
  };

  const canAddMore = photos.length < maxPhotos;

  // Se já houver fotos, mostrar apenas o botão de adicionar (sem mostrar as fotos novamente)
  if (photos.length > 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Fotos ({photos.length}/{maxPhotos})
        </Text>
        {canAddMore && (
          <TouchableOpacity
            style={[styles.addButton, disabled && styles.disabled]}
            onPress={handleAddPhoto}
            disabled={disabled || isLoading}
          >
            <Ionicons
              name="camera"
              size={24}
              color={disabled ? theme.colors.textTertiary : theme.colors.primary}
            />
            <Text
              style={[
                styles.addButtonText,
                disabled && styles.disabledText,
              ]}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Se não houver fotos, mostrar o picker completo
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Fotos ({photos.length}/{maxPhotos})
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {canAddMore && (
          <TouchableOpacity
            style={[styles.addButton, disabled && styles.disabled]}
            onPress={handleAddPhoto}
            disabled={disabled || isLoading}
          >
            <Ionicons
              name="camera"
              size={24}
              color={disabled ? theme.colors.textTertiary : theme.colors.primary}
            />
            <Text
              style={[
                styles.addButtonText,
                disabled && styles.disabledText,
              ]}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  scrollContent: {
    paddingRight: theme.spacing.md,
  },
  photoContainer: {
    position: 'relative',
    marginRight: theme.spacing.sm,
  },
  photo: {
    width: photoSize,
    height: photoSize,
    borderRadius: theme.borderRadius.md,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: photoSize,
    height: photoSize,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  disabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  disabledText: {
    color: theme.colors.textTertiary,
  },
});
