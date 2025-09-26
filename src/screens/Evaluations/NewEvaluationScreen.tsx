import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useUIStore } from '@/store/ui.store';
import { City } from '@/api/types';
import { Button } from '@/components/Button';
import { FormTextInput } from '@/components/FormTextInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { createEvaluationSchema, CreateEvaluationFormData } from '@/utils/validators';
import { theme } from '@/theme';

export const NewEvaluationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const { showToast } = useUIStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEvaluationFormData>({
    resolver: zodResolver(createEvaluationSchema),
    defaultValues: {
      city_id: 0,
      vehicle_make: '',
      vehicle_model: '',
      vehicle_year: undefined,
      notes: '',
    },
  });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      setIsLoading(true);
      // Temporariamente desabilitado para evitar erro de rede
      // const citiesData = await utilityApi.getCities();
      // setCities(citiesData);
      
      // Dados mockados para teste
      setCities([
        { id: 1, name: 'São Paulo', state: 'SP', country: 'Brasil' },
        { id: 2, name: 'Rio de Janeiro', state: 'RJ', country: 'Brasil' },
        { id: 3, name: 'Belo Horizonte', state: 'MG', country: 'Brasil' },
      ]);
    } catch (error: any) {
      console.error('Error loading cities:', error);
      showToast('error', 'Erro ao carregar cidades');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CreateEvaluationFormData) => {
    try {
      setIsSubmitting(true);
      // Temporariamente desabilitado para evitar erro de rede
      // const evaluation = await evaluationApi.create(data);
      // showToast('success', 'Avaliação criada com sucesso!');
      // navigation.navigate('EvaluationDetail', { evaluationId: evaluation.id });
      
      // Simulação de sucesso
      showToast('success', 'Avaliação criada com sucesso! (Modo teste)');
      console.log('Dados da avaliação:', data);
    } catch (error: any) {
      console.error('Error creating evaluation:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao criar avaliação';
      showToast('error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Carregando cidades..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Nova Avaliação</Text>
          <Text style={styles.subtitle}>
            Preencha os dados do veículo para solicitar uma avaliação
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Cidade *</Text>
            <Controller
              control={control}
              name="city_id"
              render={({ field: { onChange, value } }) => (
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={styles.picker}
                  >
                    <Picker.Item label="Selecione uma cidade" value={0} />
                    {cities.map((city) => (
                      <Picker.Item
                        key={city.id}
                        label={`${city.name} - ${city.state}`}
                        value={city.id}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
            {errors.city_id && (
              <Text style={styles.errorText}>Cidade é obrigatória</Text>
            )}
          </View>

          <Controller
            control={control}
            name="vehicle_make"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Marca do veículo"
                placeholder="Ex: Toyota, Honda, Ford"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.vehicle_make?.message}
                autoCapitalize="words"
                required
              />
            )}
          />

          <Controller
            control={control}
            name="vehicle_model"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Modelo do veículo"
                placeholder="Ex: Corolla, Civic, Focus"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.vehicle_model?.message}
                autoCapitalize="words"
                required
              />
            )}
          />

          <Controller
            control={control}
            name="vehicle_year"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Ano do veículo (opcional)"
                placeholder="Ex: 2020"
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(text ? parseInt(text, 10) : undefined)}
                onBlur={onBlur}
                error={errors.vehicle_year?.message}
                keyboardType="numeric"
                maxLength={4}
              />
            )}
          />

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Observações (opcional)"
                placeholder="Informações adicionais sobre o veículo"
                value={value || ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.notes?.message}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            )}
          />

          <Button
            title="Criar Avaliação"
            onPress={handleSubmit(onSubmit)}
            fullWidth
            loading={isSubmitting}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  form: {
    flex: 1,
  },
  pickerContainer: {
    marginBottom: theme.spacing.md,
  },
  pickerLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
  },
  picker: {
    height: theme.layout.inputHeight,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
  },
});
