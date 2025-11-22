import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/navigation/types';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/Button';
import { FormTextInput } from '@/components/FormTextInput';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { signupSchema, SignupFormData } from '@/utils/validators';
import { theme } from '@/theme';

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuthStore();
  const { showToast } = useUIStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      phone: '',
      role: 'evaluator',
      document_id: '',
      bio: '',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      console.log('Tentando criar conta com dados:', data);
      
      // Preparar dados para a API
      const signupData = {
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        phone: data.phone || undefined,
        role: data.role,
        document_id: data.document_id || undefined,
        bio: data.bio || undefined,
      };
      
      console.log('Dados preparados para API:', signupData);
      
      // Chamar a API real
      await signup(signupData);
      
      console.log('Conta criada com sucesso!');
      showToast('success', 'Conta criada com sucesso!');
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao criar conta';
      showToast('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Criando conta..." />;
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
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Preencha os dados para criar sua conta
          </Text>
        </View>

        <View style={styles.form}>
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

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Email"
                placeholder="Digite seu email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                required
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Senha"
                placeholder="Digite sua senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
                required
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormTextInput
                label="Telefone (opcional)"
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
            title="Criar Conta"
            onPress={handleSubmit(onSubmit)}
            fullWidth
            style={styles.signupButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Button
              title="Faça login"
              onPress={navigateToLogin}
              variant="ghost"
              size="sm"
            />
          </View>
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
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  signupButton: {
    marginTop: theme.spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  loginText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
  },
});
