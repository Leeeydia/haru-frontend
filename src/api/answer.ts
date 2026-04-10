import client from './client';
import type { ApiResponse, Question, Answer, AnswerSubmitRequest } from '../types';

// TODO: 백엔드 완성 시 목업 제거
const MOCK_QUESTION: Question = {
  id: 1,
  content: 'React의 Virtual DOM이 실제 DOM과 비교하여 어떤 장점을 가지는지 설명하고, 재조정(Reconciliation) 과정이 어떻게 동작하는지 서술하세요.',
  category: '프론트엔드',
  difficulty: '중급',
  relatedStacks: ['React', 'JavaScript'],
  answerKeywords: ['Virtual DOM', '재조정', 'Diffing', '배치 업데이트'],
  createdAt: new Date().toISOString(),
};

// TODO: 백엔드 완성 시 목업 제거
const MOCK_ANSWER: Answer = {
  id: 1,
  userId: 1,
  questionId: 1,
  deliveryId: 1,
  content: '',
  version: 1,
  isFinal: false,
  submittedAt: new Date().toISOString(),
};

// TODO: 백엔드 완성 시 실제 API로 교체
export async function getQuestionByTokenAPI(token: string) {
  try {
    const res = await client.get<ApiResponse<Question>>(`/api/answers/question`, {
      params: { token },
    });
    return res.data;
  } catch {
    return { success: true, data: { ...MOCK_QUESTION }, message: '목업 데이터' } as ApiResponse<Question>;
  }
}

// TODO: 백엔드 완성 시 실제 API로 교체
export async function submitAnswerAPI(data: AnswerSubmitRequest) {
  try {
    const res = await client.post<ApiResponse<Answer>>('/api/answers', data);
    return res.data;
  } catch {
    return {
      success: true,
      data: { ...MOCK_ANSWER, content: data.content, isFinal: data.isFinal, submittedAt: new Date().toISOString() },
      message: '목업 데이터',
    } as ApiResponse<Answer>;
  }
}
