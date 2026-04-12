import client from './client';
import type { ApiResponse, GitHubStatus } from '../types';

// TODO: 백엔드 완성 시 실제 API로 교체
const MOCK_GITHUB_STATUS: GitHubStatus = {
  connected: false,
  githubUsername: null,
  githubRepo: null,
};

export async function getGitHubStatusAPI(): Promise<ApiResponse<GitHubStatus>> {
  try {
    const res = await client.get<ApiResponse<GitHubStatus>>('/api/github/status');
    return res.data;
  } catch {
    // TODO: 백엔드 완성 시 실제 API로 교체
    return { success: true, data: MOCK_GITHUB_STATUS, message: '목업 데이터' };
  }
}

export async function connectGitHubAPI(): Promise<ApiResponse<{ authUrl: string }>> {
  try {
    const res = await client.post<ApiResponse<{ authUrl: string }>>('/api/github/connect');
    return res.data;
  } catch {
    // TODO: 백엔드 완성 시 실제 API로 교체
    return {
      success: false,
      data: null,
      message: 'GitHub 연동 API가 아직 준비되지 않았습니다.',
    };
  }
}

export async function callbackGitHubAPI(code: string): Promise<ApiResponse<null>> {
  try {
    const res = await client.post<ApiResponse<null>>('/api/github/callback', { code });
    return res.data;
  } catch {
    // TODO: 백엔드 완성 시 실제 API로 교체
    return { success: false, data: null, message: 'GitHub 연동 API가 아직 준비되지 않았습니다.' };
  }
}

export async function disconnectGitHubAPI(): Promise<ApiResponse<null>> {
  try {
    const res = await client.delete<ApiResponse<null>>('/api/github/disconnect');
    return res.data;
  } catch {
    // TODO: 백엔드 완성 시 실제 API로 교체
    return { success: false, data: null, message: 'GitHub 연동 해제 API가 아직 준비되지 않았습니다.' };
  }
}
