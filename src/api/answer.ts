import client from './client';
import type { ApiResponse, QuestionDetail, Answer, AnswerHistory, AnswerSubmitRequest } from '../types';

export async function getQuestionByTokenAPI(token: string) {
  const res = await client.get<ApiResponse<QuestionDetail>>(`/api/answers/question`, {
    params: { token },
  });
  return res.data;
}

export async function getMyAnswersAPI() {
  const res = await client.get<ApiResponse<AnswerHistory[]>>('/api/answers/my');
  return res.data;
}

export async function getAnswersByDeliveryAPI(deliveryId: number) {
  const res = await client.get<ApiResponse<Answer[]>>(`/api/answers/delivery/${deliveryId}`);
  return res.data;
}

export async function submitAnswerAPI(data: AnswerSubmitRequest) {
  const res = await client.post<ApiResponse<Answer>>('/api/answers', data);
  return res.data;
}
