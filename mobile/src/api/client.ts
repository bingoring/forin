// API client — an axios instance wrapped in a small module so the HTTP library
// is swappable (1-3 decision: no direct fetch). Endpoint/response types come from
// the generated contract (packages/contract), keeping mobile↔server type-safe.
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { saveTokens } from '@/lib/secureStore';
import type { paths } from '@contract/types';
import type { Interior } from '@/map/types';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

const http: AxiosInstance = axios.create({ baseURL, timeout: 30_000 });

// Attach the access token to every request.
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401: rotate the refresh token once and retry; if that fails, log out.
let refreshing: Promise<string | null> | null = null;

async function rotate(): Promise<string | null> {
  if (!refreshing) {
    refreshing = (async () => {
      const rt = useAuthStore.getState().refreshToken;
      if (!rt) return null;
      try {
        // raw axios (no interceptors) to avoid recursion
        const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: rt });
        const pair = data as TokenPair;
        if (!pair.accessToken || !pair.refreshToken) return null;
        useAuthStore.setState({ accessToken: pair.accessToken, refreshToken: pair.refreshToken });
        await saveTokens(pair.accessToken, pair.refreshToken);
        return pair.accessToken;
      } catch {
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error?.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const is401 = error?.response?.status === 401;
    if (is401 && original && !original._retry && !original.url?.includes('/auth/refresh')) {
      original._retry = true;
      const token = await rotate();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return http(original);
      }
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

// --- types extracted from the generated contract ---
type SocialLoginBody =
  paths['/auth/social']['post']['requestBody'] extends { content: { 'application/json': infer B } } ? B : never;
type LoginResp = paths['/auth/social']['post']['responses'][200]['content']['application/json'];
type TokenPair = paths['/auth/refresh']['post']['responses'][200]['content']['application/json'];
type MeResp = paths['/me']['get']['responses'][200]['content']['application/json'];
type Manifest = paths['/content/manifest']['get']['responses'][200]['content']['application/json'];

export const api = {
  raw: http,

  async socialLogin(body: SocialLoginBody): Promise<LoginResp> {
    const { data } = await http.post('/auth/social', body);
    return data as LoginResp;
  },

  async me(): Promise<MeResp> {
    const { data } = await http.get('/me');
    return data as MeResp;
  },

  async manifest(): Promise<Manifest> {
    const { data } = await http.get('/content/manifest');
    return data as Manifest;
  },

  // The /interiors/{id} handler is untyped in the contract, so we assert the
  // mobile-side Interior shape (src/map/types.ts mirrors the server json tags).
  async interior(id: string): Promise<Interior> {
    const { data } = await http.get(`/interiors/${id}`);
    return data as Interior;
  },
};
