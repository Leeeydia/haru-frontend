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

// 답변
export interface Answer {
  id: number;
  userId: number;
  questionId: number;
  deliveryId: number;
  content: string;
  version: number;
  isFinal: boolean;
  submittedAt: string;
}

export interface AnswerSubmitRequest {
  deliveryId: number;
  content: string;
  isFinal: boolean;
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

// API 공통
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
