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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppStackNavigationProp } from '@/navigation/types';
import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { Evaluation, EvaluationStatus, Report } from '@/api/types';
import { evaluationApi, reportApi } from '@/api/endpoints';
import { Button } from '@/components/Button';
import { PhotoPicker } from '@/components/PhotoPicker';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { FormTextInput } from '@/components/FormTextInput';
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
  const navigation = useNavigation<AppStackNavigationProp>();
  const route = useRoute();
  const { evaluationId } = route.params as { evaluationId: number };
  console.log('EvaluationDetailScreen loaded with evaluationId:', evaluationId);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [reportSummary, setReportSummary] = useState('');
  const [isEditingReport, setIsEditingReport] = useState(false);
  const { showToast } = useUIStore();
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    loadEvaluation();
  }, [evaluationId]);

  const loadReport = async () => {
    if (!accessToken) return;
    
    try {
      // Buscar relatório usando GET /evaluations/{id}/report
      const foundReport = await reportApi.getByEvaluationId(evaluationId, accessToken);
      if (foundReport) {
        console.log('Relatório encontrado:', foundReport);
        setReport(foundReport);
        setReportSummary(foundReport.summary || '');
        // Atualizar evaluation com o report encontrado
        if (evaluation) {
          setEvaluation({ ...evaluation, report: foundReport });
        }
      } else {
        // Relatório não existe ainda (404) - comportamento normal
        setReport(null);
        setReportSummary('');
      }
    } catch (error: any) {
      // Se for 404, é normal - relatório ainda não foi criado
      // Não logar como erro, pois é comportamento esperado
      if (error?.response?.status === 404) {
        setReport(null);
        setReportSummary('');
      } else {
        // Outros erros (500, network, etc) - logar mas não bloquear a UI
        console.error('Erro ao buscar relatório:', error);
      }
    }
  };

  const loadPhotos = async () => {
    if (!accessToken) return;
    
    try {
      const photosData = await evaluationApi.getPhotos(evaluationId, accessToken);
      // Usar o campo 'url' retornado pela API
      const photoUrls = photosData.map(photo => photo.url || photo.photo_url || '');
      setPhotos(photoUrls.filter(url => url !== ''));
    } catch (error: any) {
      // Se der erro ao buscar fotos, não bloquear a UI
      console.log('Error loading photos:', error);
    }
  };

  const loadEvaluation = async () => {
    try {
      setIsLoading(true);
      if (!accessToken) {
        showToast('error', 'Token de acesso não encontrado');
        return;
      }
      const evaluationData = await evaluationApi.getById(evaluationId, accessToken);
      setEvaluation(evaluationData);
      
      // Buscar fotos separadamente usando a rota evaluations/:id/photos
      await loadPhotos();
      
      // Se a API retornou o report, usar ele
      if (evaluationData.report) {
        setReport(evaluationData.report);
        setReportSummary(evaluationData.report.summary || '');
      } else {
        // Se não retornou na evaluation, tentar buscar separadamente
        // Apenas para avaliações que podem ter relatório
        if (evaluationData.status === 'in_progress' || evaluationData.status === 'completed') {
          await loadReport();
        }
      }
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

        if (!accessToken) {
          throw new Error('Token de acesso não encontrado');
        }
        await evaluationApi.uploadPhoto(evaluationId, formData, accessToken);
      }

      // Buscar fotos atualizadas usando a rota evaluations/:id/photos
      await loadPhotos();
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
    const reportToView = report || evaluation?.report;
    if (!reportToView) return;

    try {
      if (!accessToken) {
        showToast('error', 'Token de acesso não encontrado');
        return;
      }
      const response = await reportApi.getFileUrl(reportToView.id, accessToken);
      navigation.navigate('ReportViewer', { fileUrl: response.url });
    } catch (error: any) {
      // Se for 404, significa que o PDF não foi enviado ainda
      if (error?.response?.status === 404) {
        showToast('info', 'PDF do laudo ainda não foi enviado');
      } else {
      console.error('Error getting report file:', error);
      showToast('error', 'Erro ao abrir laudo');
      }
    }
  };


  const handleAcceptEvaluation = async () => {
    if (!accessToken || !user) {
      showToast('error', 'Token de acesso não encontrado');
      return;
    }

    if (user.role !== 'evaluator') {
      showToast('error', 'Apenas avaliadores podem aceitar avaliações');
      return;
    }

    Alert.alert(
      'Aceitar Avaliação',
      'Tem certeza que deseja aceitar esta avaliação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceitar',
          onPress: async () => {
            try {
              setIsUpdatingStatus(true);
              // Enviar apenas evaluator_id - a API muda o status para 'accepted' automaticamente
              await evaluationApi.update(
                evaluationId,
                {
                  evaluator_id: user.id,
                },
                accessToken
              );
              showToast('success', 'Avaliação aceita com sucesso!');
              await loadEvaluation();
            } catch (error: any) {
              console.error('Error accepting evaluation:', error);
              const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao aceitar avaliação';
              showToast('error', errorMessage);
            } finally {
              setIsUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  const handleStartEvaluation = async () => {
    if (!accessToken || !user || !evaluation) {
      showToast('error', 'Token de acesso não encontrado');
      return;
    }

    if (evaluation.evaluator_id !== user.id) {
      showToast('error', 'Apenas o avaliador designado pode iniciar a avaliação');
      return;
    }

    Alert.alert(
      'Iniciar Avaliação',
      'Tem certeza que deseja iniciar esta avaliação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: async () => {
            try {
              setIsUpdatingStatus(true);
              await evaluationApi.update(
                evaluationId,
                { status: 'in_progress' },
                accessToken
              );
              showToast('success', 'Avaliação iniciada com sucesso!');
              await loadEvaluation();
            } catch (error: any) {
              console.error('Error starting evaluation:', error);
              const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao iniciar avaliação';
              showToast('error', errorMessage);
            } finally {
              setIsUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  const handleCompleteEvaluation = async () => {
    if (!accessToken || !user || !evaluation) {
      showToast('error', 'Token de acesso não encontrado');
      return;
    }

    // Validar se já está concluída
    if (evaluation.status === 'completed') {
      showToast('info', 'Esta avaliação já está concluída');
      return;
    }

    // Validar se está no status correto para concluir
    if (evaluation.status !== 'in_progress') {
      showToast('error', `Não é possível concluir uma avaliação com status "${statusLabels[evaluation.status]}"`);
      return;
    }

    if (evaluation.evaluator_id !== user.id) {
      showToast('error', 'Apenas o avaliador designado pode concluir a avaliação');
      return;
    }

    // Prevenir chamadas duplicadas
    if (isUpdatingStatus) {
      return;
    }

    Alert.alert(
      'Concluir Avaliação',
      'Tem certeza que deseja concluir esta avaliação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Concluir',
          onPress: async () => {
            try {
              setIsUpdatingStatus(true);
              const updatedEvaluation = await evaluationApi.update(
                evaluationId,
                { status: 'completed' },
                accessToken
              );
              
              // Atualizar estado imediatamente para evitar chamadas duplicadas
              setEvaluation(updatedEvaluation);
              
              showToast('success', 'Avaliação concluída com sucesso!');
              
              // Redirecionar para a home após um pequeno delay para mostrar o toast
              setTimeout(() => {
                navigation.goBack();
              }, 500);
            } catch (error: any) {
              console.error('Error completing evaluation:', error);
              const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao concluir avaliação';
              showToast('error', errorMessage);
            } finally {
              setIsUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  const handleCreateReport = async () => {
    if (!accessToken || !evaluation) {
      showToast('error', 'Token de acesso não encontrado');
      return;
    }

    try {
      setIsSavingReport(true);
      const newReport = await reportApi.create(
        {
          evaluation_id: evaluationId,
          summary: reportSummary.trim() || '',
        },
        accessToken
      );
      // Salvar o relatório no estado
      setReport(newReport);
      setReportSummary(newReport.summary || '');
      // Atualizar a evaluation com o report
      if (evaluation) {
        setEvaluation({ ...evaluation, report: newReport });
      }
      showToast('success', 'Relatório criado com sucesso!');
      setIsEditingReport(false);
    } catch (error: any) {
      console.error('Error creating report:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao criar relatório';
      showToast('error', errorMessage);
    } finally {
      setIsSavingReport(false);
    }
  };

  const handleUpdateReport = async () => {
    if (!accessToken || !report) {
      showToast('error', 'Token de acesso não encontrado');
      return;
    }

    try {
      setIsSavingReport(true);
      const updatedReport = await reportApi.update(
        report.id,
        { summary: reportSummary || undefined },
        accessToken
      );
      // Atualizar o relatório no estado
      setReport(updatedReport);
      setReportSummary(updatedReport.summary || '');
      // Atualizar a evaluation com o report atualizado
      if (evaluation) {
        setEvaluation({ ...evaluation, report: updatedReport });
      }
      showToast('success', 'Relatório atualizado com sucesso!');
      setIsEditingReport(false);
    } catch (error: any) {
      console.error('Error updating report:', error);
      const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao atualizar relatório';
      showToast('error', errorMessage);
    } finally {
      setIsSavingReport(false);
    }
  };

  const handleFinalizeReport = async () => {
    if (!accessToken || !report) {
      showToast('error', 'Token de acesso não encontrado');
      return;
    }

    Alert.alert(
      'Finalizar Relatório',
      'Tem certeza que deseja finalizar este relatório? Após finalizar, não será possível editá-lo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Finalizar',
          onPress: async () => {
            try {
              setIsSavingReport(true);
              const finalizedReport = await reportApi.update(
                report.id,
                { status: 'finalized' },
                accessToken
              );
              // Atualizar o relatório no estado
              setReport(finalizedReport);
              // Atualizar a evaluation com o report finalizado
              if (evaluation) {
                setEvaluation({ ...evaluation, report: finalizedReport });
              }
              showToast('success', 'Relatório finalizado com sucesso!');
            } catch (error: any) {
              console.error('Error finalizing report:', error);
              const errorMessage = error?.response?.data?.message || error?.response?.data?.error || 'Erro ao finalizar relatório';
              showToast('error', errorMessage);
            } finally {
              setIsSavingReport(false);
            }
          },
        },
      ]
    );
  };

  const handleUploadPdf = async () => {
    if (!accessToken || !evaluation?.report) {
      showToast('error', 'Token de acesso não encontrado');
      return;
    }

    // TODO: Implementar seleção de PDF usando expo-document-picker
    // Por enquanto, mostrar mensagem informativa
    Alert.alert(
      'Upload de PDF',
      'Funcionalidade de upload de PDF será implementada em breve. Por enquanto, você pode criar o relatório com o resumo.',
      [{ text: 'OK' }]
    );
    
    // Quando expo-document-picker estiver instalado, usar:
    // import * as DocumentPicker from 'expo-document-picker';
    // const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    // if (!result.canceled) {
    //   const formData = new FormData();
    //   formData.append('file', {
    //     uri: result.assets[0].uri,
    //     type: 'application/pdf',
    //     name: result.assets[0].name,
    //   } as any);
    //   await reportApi.uploadFile(evaluation.report.id, formData, accessToken);
    // }
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

        {/* Evaluator Info */}
        {evaluation.evaluator_id && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliador</Text>
            <View style={styles.infoCard}>
              <Ionicons name="person" size={20} color={theme.colors.primary} />
              <Text style={styles.infoText}>
                Avaliador ID: {evaluation.evaluator_id}
              </Text>
            </View>
          </View>
        )}

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
                <View
                  key={index}
                  style={styles.photoContainer}
                >
                  <Image source={{ uri: photo }} style={styles.photo} />
                </View>
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

        {/* Report Section - Show when in_progress and user is evaluator, or when report exists (any status) */}
        {((evaluation.status === 'in_progress' && user?.id === evaluation.evaluator_id) ||
          (report || evaluation.report)) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Relatório Técnico</Text>
              
              {!report && !evaluation.report && evaluation.status === 'in_progress' && user?.id === evaluation.evaluator_id && (
                <View style={styles.reportFormCard}>
                  <FormTextInput
                    label="Resumo da Avaliação (opcional)"
                    placeholder="Descreva os principais pontos da avaliação do veículo..."
                    value={reportSummary}
                    onChangeText={setReportSummary}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    containerStyle={styles.reportInputContainer}
                  />
                  <Button
                    title="Criar Relatório"
                    onPress={handleCreateReport}
                    fullWidth
                    loading={isSavingReport}
                    disabled={isSavingReport}
                  />
                </View>
              )}
              
              {(report || evaluation.report) ? (
                // Relatório existente
                <View style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <View style={styles.reportInfo}>
                      <Ionicons
                        name="document-text"
                        size={24}
                        color={
                          (report || evaluation.report)?.status === 'finalized'
                            ? theme.colors.success
                            : theme.colors.warning
                        }
                      />
                      <View style={styles.reportDetails}>
                        <Text style={styles.reportTitle}>Relatório</Text>
                        <Text style={styles.reportSubtitle}>
                          Status:{' '}
                          {(report || evaluation.report)?.status === 'finalized'
                            ? 'Finalizado'
                            : 'Rascunho'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {(report || evaluation.report)?.status === 'draft' && evaluation.status === 'in_progress' && user?.id === evaluation.evaluator_id && (
                    <>
                      {isEditingReport ? (
                        <View style={styles.reportEditForm}>
                          <FormTextInput
                            label="Resumo da Avaliação"
                            placeholder="Descreva os principais pontos da avaliação..."
                            value={reportSummary}
                            onChangeText={setReportSummary}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            containerStyle={styles.reportInputContainer}
                          />
                          <View style={styles.reportActionsRow}>
                            <Button
                              title="Cancelar"
                              onPress={() => {
                                setIsEditingReport(false);
                                setReportSummary(
                                  (report || evaluation.report)?.summary || ''
                                );
                              }}
                              variant="outline"
                              style={styles.reportActionButton}
                            />
                            <Button
                              title="Salvar"
                              onPress={handleUpdateReport}
                              loading={isSavingReport}
                              disabled={isSavingReport}
                              style={styles.reportActionButton}
                            />
                          </View>
                        </View>
                      ) : (
                        <>
                          {(report || evaluation.report)?.summary && (
                            <View style={styles.reportSummaryContainer}>
                              <Text style={styles.reportSummaryLabel}>
                                Resumo:
                              </Text>
                              <Text style={styles.reportSummaryText}>
                                {(report || evaluation.report)?.summary}
                              </Text>
                            </View>
                          )}
                          <View style={styles.reportActionsRow}>
                            <Button
                              title="Editar Resumo"
                              onPress={() => {
                                setIsEditingReport(true);
                                setReportSummary(
                                  (report || evaluation.report)?.summary || ''
                                );
                              }}
                              variant="outline"
                              size="sm"
                              style={styles.reportActionButton}
                            />
                            <Button
                              title="Upload PDF"
                              onPress={handleUploadPdf}
                              variant="outline"
                              size="sm"
                              loading={isUploadingPdf}
                              disabled={isUploadingPdf}
                              style={styles.reportActionButton}
                            />
                          </View>
                          <Button
                            title="Finalizar Relatório"
                            onPress={handleFinalizeReport}
                            fullWidth
                            loading={isSavingReport}
                            disabled={isSavingReport}
                            style={styles.finalizeButton}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* Mostrar relatório em draft quando completed (sem edição) */}
                  {(report || evaluation.report)?.status === 'draft' && evaluation.status === 'completed' && (
                    <>
                      {(report || evaluation.report)?.summary && (
                        <View style={styles.reportSummaryContainer}>
                          <Text style={styles.reportSummaryLabel}>
                            Resumo:
                          </Text>
                          <Text style={styles.reportSummaryText}>
                            {(report || evaluation.report)?.summary}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.reportWarning}>
                        ⚠️ Este relatório está em rascunho e não foi finalizado.
                      </Text>
                    </>
                  )}

                  {(report || evaluation.report)?.status === 'finalized' && (
                    <>
                      {(report || evaluation.report)?.summary && (
                        <View style={styles.reportSummaryContainer}>
                          <Text style={styles.reportSummaryText}>
                            {(report || evaluation.report)?.summary}
                          </Text>
                        </View>
                      )}
                      <Button
                        title="Ver PDF do Laudo"
                        onPress={handleViewReport}
                        variant="outline"
                        fullWidth
                      />
                    </>
                  )}
                </View>
              ) : null}
            </View>
          )}

        {/* Report - Show when completed and has report */}
        {evaluation.status === 'completed' && evaluation.report && (
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

        {/* Actions - Accept Evaluation */}
        {evaluation.status === 'created' && user?.role === 'evaluator' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ações</Text>
            <Button
              title="Aceitar Avaliação"
              onPress={handleAcceptEvaluation}
              fullWidth
              loading={isUpdatingStatus}
              disabled={isUpdatingStatus}
            />
          </View>
        )}

        {/* Actions - Start Evaluation */}
        {evaluation.status === 'accepted' &&
          user?.id === evaluation.evaluator_id && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ações</Text>
              <Button
                title="Iniciar Avaliação"
                onPress={handleStartEvaluation}
                fullWidth
                loading={isUpdatingStatus}
                disabled={isUpdatingStatus}
              />
            </View>
          )}

        {/* Actions - Complete Evaluation */}
        {evaluation.status === 'in_progress' &&
          user?.id === evaluation.evaluator_id && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ações</Text>
              <Button
                title="Concluir Avaliação"
                onPress={handleCompleteEvaluation}
                fullWidth
                loading={isUpdatingStatus}
                disabled={isUpdatingStatus}
              />
            </View>
          )}

        {/* Actions - Request Report */}
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
  reportCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
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
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  infoText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  reportFormCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  reportInputContainer: {
    marginBottom: theme.spacing.md,
  },
  reportHeader: {
    marginBottom: theme.spacing.sm,
  },
  reportEditForm: {
    marginTop: theme.spacing.md,
  },
  reportActionsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  reportActionButton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  finalizeButton: {
    marginTop: theme.spacing.md,
  },
  reportSummaryContainer: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  reportSummaryLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs / 2,
  },
  reportSummaryText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  reportWarning: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.warning,
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    textAlign: 'center',
  },
});
