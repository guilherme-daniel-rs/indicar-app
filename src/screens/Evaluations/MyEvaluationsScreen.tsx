import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUIStore } from '@/store/ui.store';
import { Evaluation, EvaluationStatus } from '@/api/types';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/Button';
import { theme } from '@/theme';

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

export const MyEvaluationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<EvaluationStatus | 'all'>('all');
  const { showToast } = useUIStore();

  const loadEvaluations = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      // Temporariamente desabilitado para evitar erro de rede
      // const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      // const response = await evaluationApi.getList(params);
      // setEvaluations(response.evaluations);
      
      // Dados mockados para teste
      setEvaluations([]);
    } catch (error: any) {
      console.error('Error loading evaluations:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao carregar avaliações';
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvaluations();
    }, [selectedStatus])
  );

  const handleRefresh = () => {
    loadEvaluations(true);
  };

  const handleEvaluationPress = (evaluation: Evaluation) => {
    navigation.navigate('EvaluationDetail', { evaluationId: evaluation.id });
  };

  const handleNewEvaluation = () => {
    navigation.navigate('NewEvaluation');
  };

  const renderEvaluationItem = ({ item }: { item: Evaluation }) => (
    <TouchableOpacity
      style={styles.evaluationCard}
      onPress={() => handleEvaluationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.evaluationHeader}>
        <Text style={styles.vehicleInfo}>
          {item.vehicle_make} {item.vehicle_model}
          {item.vehicle_year && ` (${item.vehicle_year})`}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[item.status] },
          ]}
        >
          <Text style={styles.statusText}>
            {statusLabels[item.status]}
          </Text>
        </View>
      </View>

      <Text style={styles.createdAt}>
        Criada em {new Date(item.created_at).toLocaleDateString('pt-BR')}
      </Text>

      {item.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {item.notes}
        </Text>
      )}

      <View style={styles.evaluationFooter}>
        <View style={styles.photosInfo}>
          <Ionicons name="camera" size={16} color={theme.colors.textTertiary} />
          <Text style={styles.photosText}>
            {item.photos?.length || 0} fotos
          </Text>
        </View>

        {item.report && (
          <View style={styles.reportInfo}>
            <Ionicons name="document-text" size={16} color={theme.colors.success} />
            <Text style={styles.reportText}>Laudo disponível</Text>
          </View>
        )}

        <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );

  const renderStatusFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
      >
        {(['all', ...Object.keys(statusLabels)] as (EvaluationStatus | 'all')[])
          .map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === status && styles.filterButtonTextActive,
                ]}
              >
                {status === 'all' ? 'Todas' : statusLabels[status as EvaluationStatus]}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Carregando avaliações..." />;
  }

  return (
    <View style={styles.container}>
      {renderStatusFilter()}

      {evaluations.length === 0 ? (
        <EmptyState
          icon="list-outline"
          title="Nenhuma avaliação encontrada"
          subtitle={
            selectedStatus === 'all'
              ? 'Você ainda não criou nenhuma avaliação.'
              : `Nenhuma avaliação com status "${statusLabels[selectedStatus as EvaluationStatus]}" encontrada.`
          }
          action={
            <Button
              title="Nova Avaliação"
              onPress={handleNewEvaluation}
            />
          }
        />
      ) : (
        <FlatList
          data={evaluations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvaluationItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterContainer: {
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  filterButtonTextActive: {
    color: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  evaluationCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  evaluationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  vehicleInfo: {
    flex: 1,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
  },
  createdAt: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  notes: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  evaluationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photosInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photosText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    marginLeft: theme.spacing.xs,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
