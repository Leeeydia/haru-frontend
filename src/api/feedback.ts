import client from './client';
import type { ApiResponse, Feedback } from '../types';

export async function getFeedbackAPI(answerId: number) {
  const res = await client.get<ApiResponse<Feedback>>(`/api/feedback/${answerId}`);
  return res.data;
}
