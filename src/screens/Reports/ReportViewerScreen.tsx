import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUIStore } from '@/store/ui.store';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { theme } from '@/theme';

export const ReportViewerScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fileUrl } = route.params as { fileUrl: string };
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { showToast } = useUIStore();

  const handleOpenInBrowser = async () => {
    try {
      await WebBrowser.openBrowserAsync(fileUrl);
    } catch (error) {
      console.error('Error opening browser:', error);
      showToast('error', 'Erro ao abrir no navegador');
    }
  };

  const handleDownload = async () => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        showToast('error', 'Não é possível abrir este arquivo');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      showToast('error', 'Erro ao baixar arquivo');
    }
  };

  const handleWebViewError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleWebViewLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="document-outline"
          title="Erro ao carregar laudo"
          subtitle="Não foi possível carregar o laudo. Tente abrir no navegador ou baixar o arquivo."
          action={
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleOpenInBrowser}
              >
                <Ionicons name="open-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.actionButtonText}>Abrir no Navegador</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleDownload}
              >
                <Ionicons name="download-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.actionButtonText}>Baixar Arquivo</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="Carregando laudo..." />
        </View>
      )}

      <WebView
        source={{ uri: fileUrl }}
        style={styles.webview}
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
        startInLoadingState={true}
        scalesPageToFit={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleOpenInBrowser}
        >
          <Ionicons name="open-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.toolbarButtonText}>Abrir no Navegador</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toolbarButton}
          onPress={handleDownload}
        >
          <Ionicons name="download-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.toolbarButtonText}>Baixar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  toolbarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  toolbarButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actions: {
    width: '100%',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
