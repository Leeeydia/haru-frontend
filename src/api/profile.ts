import client from './client';
import type { ApiResponse, UserProfile, ProfileRequest } from '../types';

export function getProfileAPI() {
  return client.get<ApiResponse<UserProfile>>('/api/profile');
}

export function saveProfileAPI(data: ProfileRequest) {
  return client.post<ApiResponse<UserProfile>>('/api/profile', data);
}
