import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';

if (!API_BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL is not defined');
}

class SimpleApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Token será adicionado pelos endpoints individualmente
        console.log('Simple API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          headers: config.headers,
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
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.error('Simple API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });
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
