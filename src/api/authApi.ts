import { simpleApiClient as apiClient } from './simpleApiClient';
import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  RegisterDeviceRequest,
  Device,
} from './types';

// Auth API functions
export const authApi = {
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('Logging in with credentials:', credentials);
    console.log('API Base URL:', process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080');
    console.log('Full URL will be:', `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/auth/login`);
    return apiClient.post('/auth/login', credentials);
  },

  signup: (userData: SignupRequest): Promise<LoginResponse> => {
    return apiClient.post('/auth/signup', userData);
  },

  refresh: (refreshData: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return apiClient.post('/auth/refresh', {}, {
      headers: {
        'X-Refresh-Token': refreshData.refresh_token,
      },
    });
  },

  getMe: (accessToken: string): Promise<User> => {
    return apiClient.get('/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  updateProfile: (userData: Partial<User>, accessToken: string): Promise<User> => {
    return apiClient.put('/me', userData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

// Device API functions
export const deviceApi = {
  register: (deviceData: RegisterDeviceRequest, accessToken: string): Promise<Device> => {
    return apiClient.post('/devices', deviceData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  unregister: (deviceId: number, accessToken: string): Promise<void> => {
    return apiClient.delete(`/devices/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
