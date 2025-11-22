import axios, { AxiosInstance } from 'axios';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * Obtém a URL base da API ajustada para o ambiente atual
 * - iOS Simulator: localhost funciona
 * - Android Emulator: usa 10.0.2.2 (mapeamento especial do Android)
 * - Dispositivo físico: usa o IP da máquina ou a variável de ambiente
 */
function getApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  
  // Se a URL foi definida explicitamente, usa ela
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }

  // Extrai a porta da URL de ambiente ou usa 8080 como padrão
  const port = envUrl?.match(/:(\d+)/)?.[1] || '8080';
  
  // iOS Simulator - localhost funciona
  if (Platform.OS === 'ios' && Device.isDevice === false) {
    const url = `http://localhost:${port}`;
    return url;
  }
  
  // Android Emulator - precisa usar 10.0.2.2
  if (Platform.OS === 'android' && Device.isDevice === false) {
    const url = `http://10.0.2.2:${port}`;
    return url;
  }
  
  // Dispositivo físico - precisa do IP da máquina
  // Tenta usar a variável de ambiente, senão mostra aviso
  if (Device.isDevice) {
    return envUrl || `http://localhost:${port}`;
  }
  
  // Fallback
  return envUrl || `http://localhost:${port}`;
}

const API_BASE_URL = getApiBaseUrl();

class SimpleApiClient {
  public client: AxiosInstance;

  constructor() {
    try {
      this.client = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      throw error;
    }

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Token será adicionado pelos endpoints individualmente
        const fullUrl = `${config.baseURL}${config.url}`;
        console.log('Simple API Request:', {
          method: config.method?.toUpperCase(),
          url: fullUrl,
          baseURL: config.baseURL,
          path: config.url,
          headers: config.headers,
          data: config.data,
        });
        return config;
      },
      (error) => {
        console.error('Simple Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log('Simple API Response:', {
          status: response.status,
          url: response.config.url,
          fullUrl: `${response.config.baseURL}${response.config.url}`,
          data: response.data,
        });
        return response;
      },
      (error) => {
        const fullUrl = error.config ? `${error.config.baseURL}${error.config.url}` : 'unknown';
        const is404 = error.response?.status === 404;
        const isReportNotFound = error.config?.url?.includes('/report') && is404;
        
        // Não logar 404 como erro quando for busca de relatório (comportamento esperado)
        if (!isReportNotFound) {
          // Logar outros erros normalmente
          console.error('Simple API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            fullUrl: fullUrl,
            message: error.message,
            code: error.code,
            data: error.response?.data,
            request: error.request ? {
              readyState: error.request.readyState,
              status: error.request.status,
            } : null,
          });
        }
        
        return Promise.reject(error);
      }
    );
  }

  // HTTP methods
  get<T = any>(url: string, config?: any): Promise<T> {
    return this.client.get(url, config).then(response => response.data);
  }

  post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.post(url, data, config).then(response => response.data);
  }

  put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.put(url, data, config).then(response => response.data);
  }

  patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.patch(url, data, config).then(response => response.data);
  }

  delete<T = any>(url: string, config?: any): Promise<T> {
    return this.client.delete(url, config).then(response => response.data);
  }
}

export const simpleApiClient = new SimpleApiClient();
