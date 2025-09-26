import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { authApi } from '@/api/endpoints';
import { Button } from '@/components/Button';
import { FormTextInput } from '@/components/FormTextInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { updateProfileSchema, UpdateProfileFormData } from '@/utils/validators';
import { theme } from '@/theme';

export const ProfileScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, logout, setUser } = useAuthStore();
  const { showToast } = useUIStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      setIsSaving(true);
      const updatedUser = await authApi.updateMe(data);
      setUser(updatedUser);
      showToast('success', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error?.response?.data?.message || 'Erro ao atualizar perfil';
      showToast('error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Carregando perfil..." />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar dados do usuário</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={theme.colors.white} />
          </View>
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user.role === 'user' ? 'Usuário' : 
               user.role === 'evaluator' ? 'Avaliador' : 'Administrador'}
            </Text>
          </View>
        </View>

        {/* Profile Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <Controller
            control={control}
            name="full_name"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Nome completo"
                placeholder="Digite seu nome completo"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.full_name?.message}
                autoCapitalize="words"
                required
              />
            )}
          />

          <FormTextInput
            label="Email"
            value={user.email}
            editable={false}
            style={styles.disabledInput}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Telefone"
                placeholder="Digite seu telefone"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
            )}
          />

          <Button
            title="Salvar Alterações"
            onPress={handleSubmit(onSubmit)}
            fullWidth
            loading={isSaving}
            style={styles.saveButton}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.actions}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
            <View style={styles.actionLeft}>
              <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
              <Text style={styles.actionText}>Sair da Conta</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>IndiCar</Text>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
        </View>
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
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  roleBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  roleText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  disabledInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    color: theme.colors.textTertiary,
  },
  saveButton: {
    marginTop: theme.spacing.lg,
  },
  actions: {
    marginBottom: theme.spacing.xl,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  appName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  appVersion: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
  },
  errorText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});
