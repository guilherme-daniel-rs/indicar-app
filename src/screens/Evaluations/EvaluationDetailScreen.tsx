import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUIStore } from '@/store/ui.store';
import { Evaluation, EvaluationStatus } from '@/api/types';
import { Button } from '@/components/Button';
import { PhotoPicker } from '@/components/PhotoPicker';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { theme } from '@/theme';

const { width: screenWidth } = Dimensions.get('window');
const photoSize = (screenWidth - theme.spacing.md * 3) / 2;

const statusLabels: Record<EvaluationStatus, string> = {
  created: 'Criada',
  accepted: 'Aceita',
  in_progress: 'Em Andamento',
  completed: 'Concluída',
  canceled: 'Cancelada',
};

const statusColors: Record<EvaluationStatus, string> = {
  created: theme.colors.info,
  accepted: theme.colors.warning,
  in_progress: theme.colors.primary,
  completed: theme.colors.success,
  canceled: theme.colors.error,
};

export const EvaluationDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { evaluationId } = route.params as { evaluationId: number };
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const { showToast } = useUIStore();

  useEffect(() => {
    loadEvaluation();
  }, [evaluationId]);

  const loadEvaluation = async () => {
    try {
      setIsLoading(true);
      const evaluationData = await evaluationApi.getById(evaluationId);
      setEvaluation(evaluationData);
      setPhotos(evaluationData.photos?.map(photo => photo.photo_url) || []);
    } catch (error: any) {
      console.error('Error loading evaluation:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao carregar avaliação';
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotosChange = async (newPhotos: string[]) => {
    if (newPhotos.length <= photos.length) {
      // Photos were removed, just update state
      setPhotos(newPhotos);
      return;
    }

    // New photos were added, upload them
    const photosToUpload = newPhotos.slice(photos.length);
    await uploadPhotos(photosToUpload);
  };

  const uploadPhotos = async (photosToUpload: string[]) => {
    try {
      setIsUploading(true);
      
      for (const photoUri of photosToUpload) {
        const formData = new FormData();
        formData.append('photo', {
          uri: photoUri,
          type: 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
        } as any);

        await evaluationApi.uploadPhoto(evaluationId, formData);
      }

      // Reload evaluation to get updated photos
      await loadEvaluation();
      showToast('success', 'Fotos enviadas com sucesso!');
    } catch (error: any) {
      console.error('Error uploading photos:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao enviar fotos';
      showToast('error', errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewReport = async () => {
    if (!evaluation?.report) return;

    try {
      const response = await reportApi.getFileUrl(evaluation.report.id);
      navigation.navigate('ReportViewer', { fileUrl: response.file_url });
    } catch (error: any) {
      console.error('Error getting report file:', error);
      showToast('error', 'Erro ao abrir laudo');
    }
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert(
      'Remover foto',
      'Tem certeza que deseja remover esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            const newPhotos = photos.filter((_, i) => i !== index);
            setPhotos(newPhotos);
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Carregando avaliação..." />;
  }

  if (!evaluation) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Avaliação não encontrada"
        subtitle="A avaliação solicitada não foi encontrada."
      />
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.vehicleInfo}>
            {evaluation.vehicle_make} {evaluation.vehicle_model}
            {evaluation.vehicle_year && ` (${evaluation.vehicle_year})`}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[evaluation.status] },
            ]}
          >
            <Text style={styles.statusText}>
              {statusLabels[evaluation.status]}
            </Text>
          </View>
        </View>

        <Text style={styles.createdAt}>
          Criada em {new Date(evaluation.created_at).toLocaleDateString('pt-BR')}
        </Text>

        {/* Notes */}
        {evaluation.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.notes}>{evaluation.notes}</Text>
          </View>
        )}

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fotos</Text>
          {photos.length === 0 ? (
            <EmptyState
              icon="camera-outline"
              title="Nenhuma foto adicionada"
              subtitle="Adicione fotos do veículo para facilitar a avaliação"
            />
          ) : (
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.photoContainer}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <View style={styles.removeButton}>
                    <Ionicons name="close" size={16} color={theme.colors.white} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {evaluation.status !== 'completed' && evaluation.status !== 'canceled' && (
            <PhotoPicker
              photos={photos}
              onPhotosChange={handlePhotosChange}
              maxPhotos={10}
              disabled={isUploading}
            />
          )}
        </View>

        {/* Report */}
        {evaluation.report && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Laudo</Text>
            <View style={styles.reportCard}>
              <View style={styles.reportInfo}>
                <Ionicons name="document-text" size={24} color={theme.colors.success} />
                <View style={styles.reportDetails}>
                  <Text style={styles.reportTitle}>Laudo disponível</Text>
                  <Text style={styles.reportSubtitle}>
                    Status: {evaluation.report.status === 'finalized' ? 'Finalizado' : 'Rascunho'}
                  </Text>
                </View>
              </View>
              <Button
                title="Ver Laudo"
                onPress={handleViewReport}
                variant="outline"
                size="sm"
              />
            </View>
          </View>
        )}

        {/* Actions */}
        {evaluation.status === 'completed' && !evaluation.report && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ações</Text>
            <Button
              title="Solicitar Laudo"
              onPress={() => {
                // TODO: Implement request report functionality
                showToast('info', 'Funcionalidade em desenvolvimento');
              }}
              fullWidth
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  vehicleInfo: {
    flex: 1,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
  },
  createdAt: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  notes: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  photoContainer: {
    position: 'relative',
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
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
  reportCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.sm,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportDetails: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  reportTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  reportSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
