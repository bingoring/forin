// Auth state (Zustand). Tokens live here at runtime; persistence to expo-secure-store
// is wired in increment 4b.
import { create } from 'zustand';

type User = { id: string; status: string } | null;

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User;
  isAuthed: boolean;
  setSession: (accessToken: string, refreshToken: string, user: User) => void;
  setAccessToken: (token: string) => void;
  /** Dev-only: enter the app without a provider (paired with a bundled fixture). */
  devLogin: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthed: false,
  setSession: (accessToken, refreshToken, user) =>
    set({ accessToken, refreshToken, user, isAuthed: true }),
  setAccessToken: (accessToken) => set({ accessToken }),
  devLogin: () => set({ accessToken: 'dev', refreshToken: 'dev', user: { id: 'dev-user', status: 'active' }, isAuthed: true }),
  logout: () => set({ accessToken: null, refreshToken: null, user: null, isAuthed: false }),
}));
