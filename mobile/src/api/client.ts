// API client — an axios instance wrapped in a small module so the HTTP library
// is swappable (1-3 decision: no direct fetch). Endpoint/response types come from
// the generated contract (packages/contract), keeping mobile↔server type-safe.
import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '@/store/authStore';
import type { paths } from '@contract/types';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

const http: AxiosInstance = axios.create({ baseURL, timeout: 30_000 });

// Attach the access token to every request.
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → clear session (refresh-token rotation is wired in 4b).
http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(error);
  },
);

// --- typed helpers (extracted from the generated contract) ---
type SocialLoginBody =
  paths['/auth/social']['post']['requestBody'] extends { content: { 'application/json': infer B } } ? B : never;

type Manifest =
  paths['/content/manifest']['get']['responses'][200]['content']['application/json'];

export const api = {
  raw: http,

  async socialLogin(body: SocialLoginBody) {
    const { data } = await http.post('/auth/social', body);
    return data as paths['/auth/social']['post']['responses'][200]['content']['application/json'];
  },

  async manifest(): Promise<Manifest> {
    const { data } = await http.get('/content/manifest');
    return data as Manifest;
  },
};
