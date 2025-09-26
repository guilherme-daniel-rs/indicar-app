import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { User, LoginRequest, SignupRequest } from '@/api/types';
import { authApi } from '@/api/endpoints';

interface AuthState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  loadMe: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

// Custom storage for secure token storage
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error('Error storing secure data:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error('Error removing secure data:', error);
    }
  },
};

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  isAuthenticated: true, // Temporariamente forçando autenticação
  isLoading: false,
  accessToken: null,
  refreshToken: null,
  user: null,

  // Actions
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login(credentials);
      
      set({
        isAuthenticated: true,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        user: response.user,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (userData: SignupRequest) => {
    set({ isLoading: true });
    try {
      const response = await authApi.signup(userData);
      
      set({
        isAuthenticated: true,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        user: response.user,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },

  refresh: async () => {
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authApi.refresh({ refresh_token: refreshToken });
      
      set({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      });
    } catch (error) {
      // If refresh fails, logout user
      get().logout();
      throw error;
    }
  },

  loadMe: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.getMe();
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  setTokens: (accessToken: string, refreshToken: string) => {
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  clearAuth: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },
}));
