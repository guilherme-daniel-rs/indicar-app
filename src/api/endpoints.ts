import { apiClient } from './apiClient';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  CreateEvaluationRequest,
  Evaluation,
  EvaluationListResponse,
  UpdateEvaluationRequest,
  PaginationParams,
  CreateReportRequest,
  Report,
  RegisterDeviceRequest,
  Device,
  PhotoUploadResponse,
  City,
} from './types';

// Auth endpoints
export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> =>
    apiClient.post('/auth/login', data),

  signup: (data: SignupRequest): Promise<LoginResponse> =>
    apiClient.post('/auth/signup', data),

  refresh: (data: RefreshTokenRequest): Promise<RefreshTokenResponse> =>
    apiClient.post('/auth/refresh', data),

  getMe: (): Promise<User> =>
    apiClient.get('/me'),

  updateMe: (data: Partial<User>): Promise<User> =>
    apiClient.put('/me', data),
};

// Evaluation endpoints
export const evaluationApi = {
  create: (data: CreateEvaluationRequest): Promise<Evaluation> =>
    apiClient.post('/evaluations', data),

  getById: (id: number): Promise<Evaluation> =>
    apiClient.get(`/evaluations/${id}`),

  getList: (params?: PaginationParams): Promise<EvaluationListResponse> =>
    apiClient.get('/evaluations', { params }),

  update: (id: number, data: UpdateEvaluationRequest): Promise<Evaluation> =>
    apiClient.patch(`/evaluations/${id}`, data),

  uploadPhoto: (evaluationId: number, formData: FormData): Promise<PhotoUploadResponse> =>
    apiClient.upload(`/evaluations/${evaluationId}/photos`, formData),

  uploadPhotoToPresignedUrl: (presignedUrl: string, formData: FormData): Promise<void> => {
    return apiClient.put(presignedUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Report endpoints
export const reportApi = {
  create: (data: CreateReportRequest): Promise<Report> =>
    apiClient.post('/reports', data),

  getById: (id: number): Promise<Report> =>
    apiClient.get(`/reports/${id}`),

  getFileUrl: (id: number): Promise<{ file_url: string }> =>
    apiClient.get(`/reports/${id}/file`),
};

// Device endpoints
export const deviceApi = {
  register: (data: RegisterDeviceRequest): Promise<Device> =>
    apiClient.post('/devices', data),
};

// Utility endpoints
export const utilityApi = {
  getCities: (): Promise<City[]> =>
    apiClient.get('/cities'),
};
