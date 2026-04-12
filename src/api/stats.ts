import client from './client';
import type { ApiResponse, StatsResponse } from '../types';

export async function getStatsAPI() {
  const res = await client.get<ApiResponse<StatsResponse>>('/api/stats');
  return res.data;
}
