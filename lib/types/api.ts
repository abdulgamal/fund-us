// API Response Types

/**
 * User data structure
 */
export interface User {
  id: number;
  name: string;
  email: string;
  user_type: 'superadmin' | 'bank' | 'funder' | 'borrower';
  first_name: string;
  last_name: string;
  institution_name: string | null;
  investor_type: string | null;
  business_name: string | null;
  business_type: string | null;
}

/**
 * Base API response structure
 */
export interface ApiResponse<T = any> {
  message: string;
  status: 'success' | 'error' | 'fail';
  status_code: number;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Login response data
 */
export interface LoginData {
  user: User;
  access_token: string;
  token_type: string;
}

/**
 * Login response
 */
export interface LoginResponse extends ApiResponse<LoginData> {
  data: LoginData;
}

/**
 * Registration response
 */
export interface RegisterResponse extends ApiResponse<LoginData> {
  data: LoginData;
}

/**
 * Generic error response
 */
export interface ErrorResponse extends ApiResponse {
  status: 'error' | 'fail';
  errors?: Record<string, string[]>;
}

