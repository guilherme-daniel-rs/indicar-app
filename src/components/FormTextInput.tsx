import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { theme } from '@/theme';

interface FormTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  required?: boolean;
}

export const FormTextInput = forwardRef<TextInput, FormTextInputProps>(
  (
    {
      label,
      error,
      containerStyle,
      inputStyle,
      required = false,
      ...textInputProps
    },
    ref
  ) => {
    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            hasError && styles.inputError,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textTertiary}
          {...textInputProps}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

FormTextInput.displayName = 'FormTextInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },
  input: {
    height: theme.layout.inputHeight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
