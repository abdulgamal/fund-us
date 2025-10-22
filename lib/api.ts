import { getToken, getIsAuthenticated, useAuthStore } from './store/authStore';
import type { User } from './types/api';

// Re-export the auth store hook for use in components
export { useAuthStore };

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Token Management Functions using Zustand
 */

/**
 * Store authentication token in Zustand store
 */
export function setAuthToken(token: string): void {
  useAuthStore.getState().setToken(token);
}

/**
 * Retrieve authentication token from Zustand store
 */
export function getAuthToken(): string | null {
  return getToken();
}

/**
 * Remove authentication token from Zustand store
 */
export function clearAuthToken(): void {
  useAuthStore.getState().clearAuth();
  // Also clear cookies
  clearAuthCookies();
}

/**
 * Check if user is authenticated (has a token)
 */
export function isAuthenticated(): boolean {
  return getIsAuthenticated();
}

/**
 * Set authentication cookies for middleware access
 */
function setAuthCookies(token: string, userType?: string): void {
  if (typeof document !== 'undefined') {
    // Set auth token cookie (expires in 30 days)
    document.cookie = `auth-token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    
    // Set user type cookie if provided
    if (userType) {
      document.cookie = `user-type=${userType}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    }
  }
}

/**
 * Clear authentication cookies
 */
function clearAuthCookies(): void {
  if (typeof document !== 'undefined') {
    document.cookie = 'auth-token=; path=/; max-age=0';
    document.cookie = 'user-type=; path=/; max-age=0';
  }
}

/**
 * Login with token and optional user data
 */
export function login(token: string, user?: User): void {
  useAuthStore.getState().login(token, user);
  // Also set cookies for middleware access
  setAuthCookies(token, user?.user_type);
}

/**
 * Logout and clear all authentication data
 */
export function logout(): void {
  useAuthStore.getState().logout();
  // Also clear cookies
  clearAuthCookies();
}

/**
 * Extended options for API calls with optional token
 */
export interface ApiCallOptions extends RequestInit {
  token?: string;
  useAuth?: boolean; // If true, automatically include token from storage
}

/**
 * Helper function to make API calls with the base URL
 * @param endpoint - The API endpoint (e.g., '/loans', '/applications')
 * @param options - Fetch options (method, headers, body, etc.) with optional token
 * @returns Promise with the fetch response
 */
export async function apiCall(endpoint: string, options?: ApiCallOptions) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {};

  // Only add Content-Type if body is not FormData
  const isFormData = options?.body instanceof FormData;
  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Add bearer token if provided or useAuth is true
  const token = options?.token || (options?.useAuth ? getAuthToken() : null);
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove custom properties from options before passing to fetch
  const { token: _token, useAuth, ...fetchOptions } = options || {};

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...fetchOptions?.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Optionally handle 401 Unauthorized by clearing token
    if (response.status === 401) {
      clearAuthToken();
    }
    
    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * Helper function to make GET requests
 */
export async function apiGet(endpoint: string, options?: ApiCallOptions) {
  return apiCall(endpoint, { ...options, method: 'GET' });
}

/**
 * Helper function to make POST requests
 */
export async function apiPost(endpoint: string, data?: any, options?: ApiCallOptions) {
  // Check if data is FormData to avoid stringifying it
  const isFormData = data instanceof FormData;
  
  return apiCall(endpoint, {
    ...options,
    method: 'POST',
    body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
  });
}

/**
 * Helper function to make PUT requests
 */
export async function apiPut(endpoint: string, data?: any, options?: ApiCallOptions) {
  return apiCall(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Helper function to make DELETE requests
 */
export async function apiDelete(endpoint: string, options?: ApiCallOptions) {
  return apiCall(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Authenticated API Helpers (automatically include token from storage)
 */

/**
 * Make authenticated GET request
 */
export async function authGet(endpoint: string, options?: ApiCallOptions) {
  return apiGet(endpoint, { ...options, useAuth: true });
}

/**
 * Make authenticated POST request
 */
export async function authPost(endpoint: string, data?: any, options?: ApiCallOptions) {
  return apiPost(endpoint, data, { ...options, useAuth: true });
}

/**
 * Make authenticated PUT request
 */
export async function authPut(endpoint: string, data?: any, options?: ApiCallOptions) {
  return apiPut(endpoint, data, { ...options, useAuth: true });
}

/**
 * Make authenticated DELETE request
 */
export async function authDelete(endpoint: string, options?: ApiCallOptions) {
  return apiDelete(endpoint, { ...options, useAuth: true });
}

