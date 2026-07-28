// Auth state (Zustand). Tokens live here at runtime; persistence to expo-secure-store
// is wired in increment 4b.
import { create } from 'zustand';

type User = { id: string; status: string } | null;

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User;
  isAuthed: boolean;
  // Onboarding completion, learned from /me. null = not yet known (still loading).
  onboarded: boolean | null;
  setSession: (accessToken: string, refreshToken: string, user: User) => void;
  setAccessToken: (token: string) => void;
  setOnboarded: (onboarded: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthed: false,
  onboarded: null,
  setSession: (accessToken, refreshToken, user) =>
    set({ accessToken, refreshToken, user, isAuthed: true }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setOnboarded: (onboarded) => set({ onboarded }),
  logout: () => set({ accessToken: null, refreshToken: null, user: null, isAuthed: false, onboarded: null }),
}));
