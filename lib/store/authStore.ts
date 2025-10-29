import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/api';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loginTimestamp: number | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  login: (token: string, user?: User) => void;
  logout: () => void;
  checkAutoLogout: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      loginTimestamp: null,

      // Set token only
      setToken: (token: string) =>
        set({ token, isAuthenticated: true, loginTimestamp: Date.now() }),

      // Set user data
      setUser: (user: any) =>
        set({ user }),

      // Clear all auth data
      clearAuth: () =>
        set({ token: null, user: null, isAuthenticated: false, loginTimestamp: null }),

      // Login with token and optional user data
      login: (token: string, user?: any) =>
        set({ token, user, isAuthenticated: true, loginTimestamp: Date.now() }),

      // Logout and clear all data
      logout: () =>
        set({ token: null, user: null, isAuthenticated: false, loginTimestamp: null }),

      // Check if user should be auto-logged out (24 hours)
      checkAutoLogout: () => {
        const state = get();
        if (state.loginTimestamp && state.isAuthenticated) {
          const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours
          const timeElapsed = Date.now() - state.loginTimestamp;
          
          if (timeElapsed >= oneDayInMs) {
            // Auto logout after 24 hours
            set({ token: null, user: null, isAuthenticated: false, loginTimestamp: null });
            
            // Redirect to login page if we're in the browser
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login?message=Your session has expired. Please login again.';
            }
            
            return true;
          }
        }
        return false;
      },
    }),
    {
      name: 'auth-storage', // LocalStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loginTimestamp: state.loginTimestamp,
      }),
    }
  )
);

// Non-hook selectors for use in non-React contexts (like API calls)
export const getToken = () => useAuthStore.getState().token;
export const getUser = () => useAuthStore.getState().user;
export const getIsAuthenticated = () => useAuthStore.getState().isAuthenticated;

