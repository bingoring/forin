import { api } from './client';
import type { ApiResponse, AuthResponse } from '../types/api';

export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', {
      email,
      password,
      display_name: displayName,
    }),

  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refresh_token: refreshToken,
    }),

  logout: () => api.post('/auth/logout'),
};
