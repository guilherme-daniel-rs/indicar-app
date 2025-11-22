import { simpleApiClient as apiClient } from './simpleApiClient';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  CreateEvaluationRequest,
  ReportFileResponse,
  Evaluation,
  EvaluationListResponse,
  UpdateEvaluationRequest,
  EvaluationListParams,
  CreateReportRequest,
  Report,
  RegisterDeviceRequest,
  Device,
  EvaluationPhoto,
  City,
} from './types';

// Auth endpoints moved to authApi.ts

// Evaluation endpoints
export const evaluationApi = {
  create: async (data: CreateEvaluationRequest, accessToken: string): Promise<Evaluation> => {
    // simpleApiClient.post já retorna response.data automaticamente
    return apiClient.post('/evaluations', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getById: (id: number, accessToken: string): Promise<Evaluation> => {
    return apiClient.get(`/evaluations/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getList: (params?: EvaluationListParams, accessToken?: string): Promise<EvaluationListResponse> => {
    return apiClient.get('/evaluations', {
      params,
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {},
    });
  },

  update: (id: number, data: UpdateEvaluationRequest, accessToken: string): Promise<Evaluation> => {
    return apiClient.patch(`/evaluations/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  uploadPhoto: (evaluationId: number, formData: FormData, accessToken: string): Promise<EvaluationPhoto> => {
    return apiClient.post(`/evaluations/${evaluationId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getPhotos: (evaluationId: number, accessToken: string): Promise<EvaluationPhoto[]> => {
    return apiClient.get(`/evaluations/${evaluationId}/photos`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

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
  create: (data: CreateReportRequest, accessToken: string): Promise<Report> => {
    return apiClient.post('/reports', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getById: (id: number, accessToken: string): Promise<Report> => {
    return apiClient.get(`/reports/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getByEvaluationId: async (evaluationId: number, accessToken: string): Promise<Report | null> => {
    // Buscar relatório usando rota específica: GET /evaluations/{id}/report
    try {
      const report = await apiClient.get<Report>(`/evaluations/${evaluationId}/report`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return report;
    } catch (error: any) {
      // Se retornar 404, significa que não existe relatório para esta avaliação
      if (error?.response?.status === 404) {
        console.log(`No report found for evaluation_id: ${evaluationId}`);
        return null;
      }
      // Outros erros (500, network, etc)
      console.error('Error fetching report by evaluation_id:', error);
      throw error;
    }
  },

  update: (id: number, data: { summary?: string; status?: 'draft' | 'finalized' }, accessToken: string): Promise<Report> => {
    return apiClient.patch(`/reports/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  uploadFile: (id: number, formData: FormData, accessToken: string): Promise<void> => {
    return apiClient.post(`/reports/${id}/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  getFileUrl: (id: number, accessToken: string): Promise<ReportFileResponse> => {
    return apiClient.get(`/reports/${id}/file`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

// Device endpoints moved to authApi.ts

// Utility endpoints
export const utilityApi = {
  getCities: (accessToken?: string): Promise<City[]> => {
    return apiClient.get('/cities', {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {},
    });
  },
};
