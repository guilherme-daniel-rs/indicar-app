import { create } from 'zustand';
import { Toast, ToastType } from '@/api/types';

interface UIState {
  // State
  toasts: Toast[];
  isLoading: boolean;
  loadingMessage?: string;

  // Actions
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;
  setLoading: (isLoading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  toasts: [],
  isLoading: false,
  loadingMessage: undefined,

  // Actions
  showToast: (type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      id,
      type,
      message,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto remove toast after duration
    setTimeout(() => {
      get().hideToast(id);
    }, duration);
  },

  hideToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  setLoading: (isLoading: boolean, message?: string) => {
    set({ isLoading, loadingMessage: message });
  },
}));
