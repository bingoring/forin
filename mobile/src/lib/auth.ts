// Auth flow: native social sign-in → server /auth/social → JWT in secure-store.
//
// NOTE: native provider SDKs need a dev build (NOT Expo Go) + provider app
// registration (client IDs / Kakao app key). Apple is wired via expo-apple-authentication;
// Google/Kakao are stubbed until their SDKs + credentials are set up.
import * as AppleAuthentication from 'expo-apple-authentication';

import { api } from '@/api/client';
import { clearTokens, loadTokens, saveTokens } from '@/lib/secureStore';
import { useAuthStore } from '@/store/authStore';

export type Provider = 'google' | 'apple' | 'kakao';

async function providerIdToken(provider: Provider): Promise<string> {
  if (provider === 'apple') {
    const cred = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
    });
    if (!cred.identityToken) throw new Error('apple: no identity token');
    return cred.identityToken;
  }
  // Google/Kakao: install the native SDK + configure the client ID/app key, then return its ID token.
  throw new Error(`${provider} 로그인은 아직 설정되지 않았습니다 (client ID + dev build 필요).`);
}

export async function signIn(provider: Provider): Promise<void> {
  const idToken = await providerIdToken(provider);
  const res = await api.socialLogin({ provider, idToken });
  const access = res.tokens?.accessToken;
  const refresh = res.tokens?.refreshToken;
  if (!access || !refresh) throw new Error('login: server returned no tokens');
  await saveTokens(access, refresh);
  useAuthStore.getState().setSession(access, refresh, toUser(res.user));
}

export async function signOut(): Promise<void> {
  await clearTokens();
  useAuthStore.getState().logout();
}

// restoreSession rehydrates tokens from secure-store on app start and verifies via /me.
export async function restoreSession(): Promise<void> {
  const { access, refresh } = await loadTokens();
  if (!access || !refresh) return;
  useAuthStore.setState({ accessToken: access, refreshToken: refresh, isAuthed: true });
  try {
    const me = await api.me();
    useAuthStore.getState().setSession(access, refresh, toUser(me.user));
  } catch {
    // token invalid/expired → the 401 interceptor rotates or logs out.
  }
}

function toUser(u?: { id?: string; status?: string }) {
  if (!u?.id) return null;
  return { id: u.id, status: u.status ?? '' };
}
