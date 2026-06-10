// Token persistence in the device keychain/keystore (expo-secure-store).
import * as SecureStore from 'expo-secure-store';

const ACCESS = 'forin.accessToken';
const REFRESH = 'forin.refreshToken';

export async function saveTokens(access: string, refresh: string) {
  await SecureStore.setItemAsync(ACCESS, access);
  await SecureStore.setItemAsync(REFRESH, refresh);
}

export async function loadTokens(): Promise<{ access: string | null; refresh: string | null }> {
  return { access: await SecureStore.getItemAsync(ACCESS), refresh: await SecureStore.getItemAsync(REFRESH) };
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS);
  await SecureStore.deleteItemAsync(REFRESH);
}
