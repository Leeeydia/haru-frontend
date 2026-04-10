import client from './client';
import type { ApiResponse, AuthResponse, SignupRequest, LoginRequest } from '../types';

export function signupAPI(data: SignupRequest) {
  return client.post<ApiResponse<AuthResponse>>('/api/auth/signup', data);
}

export function loginAPI(data: LoginRequest) {
  return client.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
}
