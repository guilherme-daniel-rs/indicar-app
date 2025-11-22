import { z } from 'zod';

// Auth validators
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const signupSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, 'Telefone deve ter pelo menos 10 dígitos'),
  role: z
    .string()
    .min(1, 'Role é obrigatório'),
  document_id: z
    .string()
    .optional(),
  bio: z
    .string()
    .optional(),
});

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, 'Telefone deve ter pelo menos 10 dígitos'),
});

// Evaluation validators
export const createEvaluationSchema = z.object({
  city_id: z
    .number()
    .min(1, 'Cidade é obrigatória'),
  vehicle_make: z
    .string()
    .min(1, 'Marca do veículo é obrigatória')
    .max(50, 'Marca deve ter no máximo 50 caracteres'),
  vehicle_model: z
    .string()
    .min(1, 'Modelo do veículo é obrigatório')
    .max(50, 'Modelo deve ter no máximo 50 caracteres'),
  vehicle_plate: z
    .string()
    .min(1, 'Placa do veículo é obrigatória')
    .max(10, 'Placa deve ter no máximo 10 caracteres'),
  vehicle_year: z
    .number()
    .min(1900, 'Ano deve ser maior que 1900')
    .max(new Date().getFullYear() + 1, 'Ano não pode ser no futuro'),
  notes: z
    .string()
    .min(1, 'Observações são obrigatórias')
    .max(500, 'Observações devem ter no máximo 500 caracteres'),
});

export const updateEvaluationSchema = z.object({
  notes: z
    .string()
    .max(500, 'Observações devem ter no máximo 500 caracteres')
    .optional(),
});

// Photo validators
export const photoSchema = z.object({
  uri: z.string().url('URI da foto inválida'),
  type: z.string().optional(),
  name: z.string().optional(),
});

// Common validators
export const idSchema = z.number().positive('ID deve ser um número positivo');

export const paginationSchema = z.object({
  page: z.number().min(1, 'Página deve ser maior que 0').optional(),
  limit: z.number().min(1, 'Limite deve ser maior que 0').max(100, 'Limite máximo é 100').optional(),
  status: z.enum(['created', 'accepted', 'in_progress', 'completed', 'canceled']).optional(),
});

// Form validation helpers
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Erro de validação' } };
  }
};

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateEvaluationFormData = z.infer<typeof createEvaluationSchema>;
export type UpdateEvaluationFormData = z.infer<typeof updateEvaluationSchema>;
export type PhotoData = z.infer<typeof photoSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
