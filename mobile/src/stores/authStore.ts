import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authApi } from '../api/auth';
import type { UserInfo } from '../types/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    nativeLanguage?: string,
  ) => Promise<void>;
  setUser: (user: UserInfo) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    const tokens = data.data;
    await SecureStore.setItemAsync('access_token', tokens.access_token);
    await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
    set({ isAuthenticated: true, user: tokens.user });
  },

  register: async (email, password, displayName, nativeLanguage) => {
    const { data } = await authApi.register(email, password, displayName, nativeLanguage);
    const tokens = data.data;
    await SecureStore.setItemAsync('access_token', tokens.access_token);
    await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
    set({ isAuthenticated: true, user: tokens.user });
  },

  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('refresh_token');
    set({ isAuthenticated: false, user: null });
  },
}));
