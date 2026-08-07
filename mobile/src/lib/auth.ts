// Auth flow: native/OIDC social sign-in → server /auth/social (verifies the
// provider ID token via OIDC) → JWT in secure-store.
//
// Apple: expo-apple-authentication (native). Google/Kakao: expo-auth-session
// (OIDC id_token via the system browser) — the client IDs come from env
// (SOCIAL_CONFIG); until they're set, the login screen disables those buttons.
// The obtained id_token's audience must equal the server's GOOGLE_CLIENT_ID /
// KAKAO_CLIENT_ID for /auth/social to verify it.
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';

import { api } from '@/api/client';
import { clearTokens, loadTokens, saveTokens } from '@/lib/secureStore';
import { useAuthStore } from '@/store/authStore';

export type Provider = 'google' | 'apple' | 'kakao';

// Provider credentials (filled in later via env / EAS secrets). Empty = not
// configured → the login screen keeps that provider disabled.
export const SOCIAL_CONFIG = {
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? '',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  // Kakao: the NATIVE app key, not the REST key. Kakao's console refuses to
  // register a custom-scheme redirect URI for a REST key (http/https only), but
  // `kakao<NATIVE_APP_KEY>://oauth` is implicitly bound to the native key — that's
  // the redirect Kakao's own SDKs use. So we drive the same OIDC endpoints with
  // the native key as client_id. The id_token's `aud` is then this key.
  kakaoNativeAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? '',
};

// The redirect Kakao accepts for a native app key. Must also be registered as a
// URL scheme in app.json (`kakao<key>`) or the browser can't hand control back.
export const kakaoRedirectUri = SOCIAL_CONFIG.kakaoNativeAppKey
  ? `kakao${SOCIAL_CONFIG.kakaoNativeAppKey}://oauth`
  : '';
export function isProviderConfigured(provider: Provider): boolean {
  if (provider === 'apple') return true; // native, no client-side key
  // The Google auth hook needs the client ID for THIS platform (iOS/Android).
  if (provider === 'google') return !!(Platform.OS === 'android' ? SOCIAL_CONFIG.googleAndroidClientId : SOCIAL_CONFIG.googleIosClientId);
  return !!SOCIAL_CONFIG.kakaoNativeAppKey; // kakao
}

// Exchange a verified provider ID token for our session JWTs. Called by the
// Apple flow below and by the Google/Kakao expo-auth-session flows (login.tsx).
export async function completeSocialLogin(provider: Provider, idToken: string): Promise<void> {
  const res = await api.socialLogin({ provider, idToken });
  const access = res.tokens?.accessToken;
  const refresh = res.tokens?.refreshToken;
  if (!access || !refresh) throw new Error('login: server returned no tokens');
  await saveTokens(access, refresh);
  useAuthStore.getState().setSession(access, refresh, toUser(res.user));
}

// Apple sign-in (native). Google/Kakao are hook-driven in login.tsx, then call
// completeSocialLogin() with the returned id_token.
export async function signInApple(): Promise<void> {
  const cred = await AppleAuthentication.signInAsync({
    requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
  });
  if (!cred.identityToken) throw new Error('apple: no identity token');
  await completeSocialLogin('apple', cred.identityToken);
}

// devSignIn: local-only login via the server's ENV=dev /auth/dev endpoint (no
// provider). Lets Expo Go exercise authed flows without OIDC credentials.
export async function devSignIn(): Promise<void> {
  const res = await api.devLogin();
  const access = res.tokens?.accessToken;
  const refresh = res.tokens?.refreshToken;
  if (!access || !refresh) throw new Error('dev login: server returned no tokens');
  await saveTokens(access, refresh);
  useAuthStore.getState().setSession(access, refresh, toUser(res.user));
}

export async function signOut(): Promise<void> {
  await clearTokens();
  useAuthStore.getState().logout();
}

// syncOnboarded fetches /me and records whether the profile is onboarded, so the
// entry gate can route to the onboarding wizard vs the app. Returns the flag.
export async function syncOnboarded(): Promise<boolean> {
  try {
    const me = await api.me();
    const ob = !!(me.profile as { onboarded?: boolean } | null)?.onboarded;
    useAuthStore.getState().setOnboarded(ob);
    return ob;
  } catch {
    return false;
  }
}

// restoreSession rehydrates tokens from secure-store on app start and verifies via /me.
export async function restoreSession(): Promise<void> {
  const { access, refresh } = await loadTokens();
  if (!access || !refresh) return;
  useAuthStore.setState({ accessToken: access, refreshToken: refresh, isAuthed: true });
  try {
    const me = await api.me();
    useAuthStore.getState().setSession(access, refresh, toUser(me.user));
    useAuthStore.getState().setOnboarded(!!(me.profile as { onboarded?: boolean } | null)?.onboarded);
  } catch {
    // token invalid/expired → the 401 interceptor rotates or logs out.
  }
}

// bootstrapSession runs once at app root: restore a saved session; in dev, if
// none survives (fresh install, or deep-linking to an authed screen without ever
// logging in), auto dev-login so testing flows just work. No-op effect in prod.
export async function bootstrapSession(): Promise<void> {
  await restoreSession();
  if (__DEV__ && !useAuthStore.getState().isAuthed) {
    try {
      await devSignIn();
      await syncOnboarded(); // devSignIn doesn't hit /me; learn onboarding state for the gate
    } catch {
      // dev server not running / ENV!=dev → stay logged out (login screen handles it).
    }
  }
}

function toUser(u?: { id?: string; status?: string }) {
  if (!u?.id) return null;
  return { id: u.id, status: u.status ?? '' };
}
