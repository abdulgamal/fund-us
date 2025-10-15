import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/api';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  login: (token: string, user?: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // Set token only
      setToken: (token: string) =>
        set({ token, isAuthenticated: true }),

      // Set user data
      setUser: (user: any) =>
        set({ user }),

      // Clear all auth data
      clearAuth: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      // Login with token and optional user data
      login: (token: string, user?: any) =>
        set({ token, user, isAuthenticated: true }),

      // Logout and clear all data
      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // LocalStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Non-hook selectors for use in non-React contexts (like API calls)
export const getToken = () => useAuthStore.getState().token;
export const getUser = () => useAuthStore.getState().user;
export const getIsAuthenticated = () => useAuthStore.getState().isAuthenticated;

