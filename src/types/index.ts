// 인증
export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// 프로필
export interface UserProfile {
  id: number;
  userId: number;
  jobCategory: string;
  techStacks: string[];
  receiveTime: number;
  dailyQuestionCount: number;
  receiveDays: string;
}

export interface ProfileRequest {
  jobCategory: string;
  techStacks: string[];
  receiveTime: number;
  dailyQuestionCount: number;
  receiveDays: string;
}

// 질문
export interface Question {
  id: number;
  content: string;
  category: string;
  difficulty: string;
  relatedStacks: string[];
  answerKeywords: string[];
  createdAt: string;
}

// 질문 상세 (GET /api/answers/question?token= 응답)
export interface QuestionDetail extends Question {
  deliveryId: number;
}

// 답변
export interface Answer {
  id: number;
  userId: number;
  questionId: number;
  deliveryId: number;
  questionContent: string;
  category: string;
  content: string;
  version: number;
  isFinal: boolean;
  submittedAt: string;
  feedbackId: number | null;
}

export interface AnswerSubmitRequest {
  deliveryId: number;
  content: string;
  isFinal: boolean;
}

// 답변 이력 (GET /api/answers/my 응답)
export interface AnswerHistory {
  id: number;
  userId: number;
  questionId: number;
  deliveryId: number;
  content: string;
  version: number;
  isFinal: boolean;
  submittedAt: string;
  questionContent: string;
  category: string;
  difficulty: string;
  score: number | null;
  answerToken: string;
}

// 피드백
export interface Feedback {
  id: number;
  answerId: number;
  totalScore: number;
  completeness: string;
  structure: string;
  expression: string;
  specificity: string;
  improvedAnswer: string;
  createdAt: string;
  answerContent: string;
  answerToken: string;
}

// 질문 발송
export interface QuestionDelivery {
  id: number;
  userId: number;
  questionId: number;
  answerToken: string;
  sentAt: string;
  answered: boolean;
}

// GitHub 연동
export interface GitHubStatus {
  connected: boolean;
  username: string | null;
  repo: string | null;
}

// 오답 노트
export interface WrongNote {
  id: number;
  answerId: number;
  addedType: 'MANUAL' | 'AUTO';
  resolved: boolean;
  resolvedAt: string | null;
  createdAt: string;
  questionId: number;
  questionContent: string;
  category: string;
  difficulty: string;
  totalScore: number | null;
}

// API 공통
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
