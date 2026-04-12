# 하루한답 - 프론트엔드 개발 프롬프트

## 프로젝트 개요

"하루한답"은 매일 이메일로 면접 질문을 보내고, 웹에서 답변을 작성하면 AI가 분석·피드백해주는 개발자 면접 준비 서비스입니다. 답변과 피드백은 GitHub에 자동 커밋되어 잔디에 반영됩니다.

---

## 기술 스택

- **Framework**: React 19 + TypeScript (Vite)
- **Routing**: React Router DOM v7
- **HTTP**: Axios
- **Styling**: Tailwind CSS 3
- **Build**: Vite 8
- **패키지 매니저**: pnpm
- **포트**: 5173 (dev 서버)

---

## 프로젝트 구조

```
haru-frontend/
├── public/
├── src/
│   ├── main.tsx                ← 엔트리포인트
│   ├── App.tsx                 ← 라우터 설정
│   ├── index.css               ← Tailwind 임포트 + 글로벌 스타일
│   ├── api/
│   │   ├── client.ts           ← Axios 인스턴스 (baseURL, 인터셉터)
│   │   ├── auth.ts             ← 인증 API (signup, login)
│   │   ├── profile.ts          ← 프로필 API (save, get)
│   │   ├── question.ts         ← 질문 API (list, get)
│   │   ├── answer.ts           ← 답변 API (getByToken, submit, getMyAnswers)
│   │   └── feedback.ts         ← 피드백 API (get)
│   ├── hooks/
│   │   ├── useAuth.ts          ← 로그인/회원가입/로그아웃/토큰 관리
│   │   ├── useProfile.ts       ← 프로필 저장/조회
│   │   ├── useAnswer.ts        ← 답변 조회/제출
│   │   └── useFeedback.ts      ← 피드백 조회
│   ├── contexts/
│   │   └── AuthContext.tsx      ← 인증 상태 전역 관리 (token, user)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── common/             ← 공용 UI (Button, Input, Card, Modal 등)
│   │   ├── auth/               ← 로그인/회원가입 폼 컴포넌트
│   │   ├── onboarding/         ← 온보딩 스텝 컴포넌트
│   │   ├── answer/             ← 답변 작성 관련 컴포넌트
│   │   ├── feedback/           ← 피드백 표시 관련 컴포넌트
│   │   └── my/                 ← 마이페이지 관련 컴포넌트
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── AnswerPage.tsx      ← /answer/:answerToken
│   │   ├── FeedbackPage.tsx    ← /feedback/:answerId
│   │   └── my/
│   │       ├── HistoryPage.tsx
│   │       ├── WrongNotesPage.tsx
│   │       └── StatsPage.tsx
│   ├── types/
│   │   └── index.ts            ← 전체 타입 정의
│   └── utils/
│       ├── token.ts            ← localStorage 토큰 저장/조회/삭제
│       └── format.ts           ← 날짜 포맷, 점수 등급 변환 등
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 디자인 시스템

### 색상

| 용도 | 색상 | Tailwind 클래스 | Hex |
|------|------|-----------------|-----|
| Primary (남색) | 메인 버튼, 강조, 헤더 | `bg-indigo-900` / `text-indigo-900` | #312E81 |
| Primary Light | 호버, 보조 강조 | `bg-indigo-700` | #4338CA |
| Primary Subtle | 배지, 태그 배경 | `bg-indigo-50` | #EEF2FF |
| Background | 페이지 배경 | `bg-white` / `bg-gray-50` | #FFFFFF / #F9FAFB |
| Surface | 카드, 입력 필드 배경 | `bg-white` | #FFFFFF |
| Text Primary | 본문 텍스트 | `text-gray-900` | #111827 |
| Text Secondary | 보조 텍스트 | `text-gray-500` | #6B7280 |
| Border | 구분선, 입력 테두리 | `border-gray-200` | #E5E7EB |
| Success | 성공, 높은 점수 | `text-emerald-600` / `bg-emerald-50` | #059669 |
| Warning | 주의, 중간 점수 | `text-amber-600` / `bg-amber-50` | #D97706 |
| Danger | 에러, 낮은 점수 | `text-red-600` / `bg-red-50` | #DC2626 |

### 디자인 원칙

- 흰색 배경 + 남색 포인트의 깔끔한 미니멀 디자인
- 카드 컴포넌트: `bg-white rounded-xl shadow-sm border border-gray-200 p-6`
- 버튼(Primary): `bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors`
- 버튼(Secondary): `bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-6 py-3`
- 입력 필드: `w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none`
- 그림자는 최소한으로 사용 (`shadow-sm`), 과도한 그림자 금지
- 여백은 넉넉하게, 요소 간 간격 충분히 확보
- 폰트: 시스템 폰트 스택 (Pretendard 또는 기본 sans-serif)

---

## 백엔드 연동 정보

### 서버

- **Base URL**: `http://localhost:8081`
- **인증**: JWT Bearer Token → `Authorization: Bearer {token}`
- **CORS**: `http://localhost:5173` 허용됨

### Axios 인스턴스 설정

```typescript
// src/api/client.ts
import axios from 'axios';
import { getToken } from '../utils/token';

const client = axios.create({
  baseURL: 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
```

### API 응답 형식 (공통)

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
```

---

## 구현 완료된 백엔드 API (바로 연동 가능)

### 인증

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | /api/auth/signup | ❌ | 회원가입 |
| POST | /api/auth/login | ❌ | 로그인 |

**요청/응답:**

```typescript
// 회원가입
POST /api/auth/signup
Body: { email: string, password: string, name: string }

// 로그인
POST /api/auth/login
Body: { email: string, password: string }

// 응답 (공통)
{
  success: true,
  data: { token: string, userId: number, email: string, name: string },
  message: "성공"
}
```

### 프로필

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | /api/profile | ✅ | 프로필 저장/수정 |
| GET | /api/profile | ✅ | 내 프로필 조회 |

**요청/응답:**

```typescript
// 프로필 저장
POST /api/profile
Body: {
  jobCategory: string,       // "프론트엔드" | "백엔드" | "풀스택"
  techStacks: string[],      // ["React", "TypeScript"]
  receiveTime: number,       // 0~23
  dailyQuestionCount: number, // 1~3
  receiveDays: string        // "EVERYDAY" | "WEEKDAY"
}

// 프로필 조회 응답
{
  success: true,
  data: {
    id: number, userId: number, jobCategory: string,
    techStacks: string[], receiveTime: number,
    dailyQuestionCount: number, receiveDays: string
  }
}
```

### 질문

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | /api/questions | ✅ | 질문 목록 (?category= 필터) |
| GET | /api/questions/{id} | ✅ | 질문 단건 조회 |

---

## 미구현 백엔드 API (목업 처리 후 나중에 연결)

### Phase 5: 답변

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | /api/answers/question?token={answerToken} | ❌ | 토큰으로 질문 정보 조회 |
| POST | /api/answers | ✅ | 답변 제출 |
| GET | /api/answers/delivery/{deliveryId} | ✅ | delivery별 답변 조회 |
| GET | /api/answers/my | ✅ | 내 답변 목록 |

**답변 제출:**
```typescript
POST /api/answers
Body: { deliveryId: number, content: string, isFinal: boolean }
```

### Phase 6: AI 피드백

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | /api/feedback/{answerId} | ✅ | 피드백 조회 |

**피드백 응답:**
```typescript
{
  success: true,
  data: {
    id: number, answerId: number, totalScore: number,
    completeness: string, structure: string,
    expression: string, specificity: string,
    improvedAnswer: string, createdAt: string
  }
}
```

---

## 타입 정의

```typescript
// src/types/index.ts

// 인증
interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// 프로필
interface UserProfile {
  id: number;
  userId: number;
  jobCategory: string;
  techStacks: string[];
  receiveTime: number;
  dailyQuestionCount: number;
  receiveDays: string;
}

interface ProfileRequest {
  jobCategory: string;
  techStacks: string[];
  receiveTime: number;
  dailyQuestionCount: number;
  receiveDays: string;
}

// 질문
interface Question {
  id: number;
  content: string;
  category: string;
  difficulty: string;
  relatedStacks: string[];
  answerKeywords: string[];
  createdAt: string;
}

// 답변
interface Answer {
  id: number;
  userId: number;
  questionId: number;
  deliveryId: number;
  content: string;
  version: number;
  isFinal: boolean;
  submittedAt: string;
}

interface AnswerSubmitRequest {
  deliveryId: number;
  content: string;
  isFinal: boolean;
}

// 피드백
interface Feedback {
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
interface QuestionDelivery {
  id: number;
  userId: number;
  questionId: number;
  answerToken: string;
  sentAt: string;
  answered: boolean;
}

// API 공통
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
```

---

## 라우팅 구조

```typescript
// src/App.tsx
<Routes>
  {/* 공개 페이지 */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/answer/:answerToken" element={<AnswerPage />} />

  {/* 인증 필요 페이지 */}
  <Route element={<ProtectedRoute />}>
    <Route path="/onboarding" element={<OnboardingPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/feedback/:answerId" element={<FeedbackPage />} />
    <Route path="/my/history" element={<HistoryPage />} />
    <Route path="/my/wrong-notes" element={<WrongNotesPage />} />
    <Route path="/my/stats" element={<StatsPage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Route>
</Routes>
```

### 라우팅 규칙

- `ProtectedRoute`: 토큰이 없으면 `/login`으로 리다이렉트
- `/answer/:answerToken`: 비로그인 상태에서 질문 조회는 가능, 답변 제출 시 로그인 필요 → 로그인 후 원래 페이지로 복귀
- 최초 가입 후 프로필 미설정 시 `/onboarding`으로 자동 이동

---

## 페이지별 구현 명세

### 1. 랜딩 페이지 (`/`)

- 서비스 소개, 핵심 기능 설명
- CTA 버튼: "시작하기" → `/signup`
- 로그인 상태면 `/dashboard`로 리다이렉트

### 2. 회원가입 (`/signup`)

- 입력: 이름, 이메일, 비밀번호, 비밀번호 확인
- 유효성 검사: 이메일 형식, 비밀번호 6자 이상, 비밀번호 일치
- 가입 성공 → 토큰 저장 → `/onboarding` 이동

### 3. 로그인 (`/login`)

- 입력: 이메일, 비밀번호
- 로그인 성공 → 토큰 저장 → 프로필 존재 확인 → `/dashboard` 또는 `/onboarding`

### 4. 온보딩 (`/onboarding`)

- 스텝 1: 직군 선택 (프론트엔드 / 백엔드 / 풀스택)
- 스텝 2: 기술 스택 선택 (직군에 따라 옵션 변경, 복수 선택)
- 스텝 3: 질문 수신 설정 (시간, 일일 질문 수, 수신 요일)
- 완료 → POST /api/profile → `/dashboard` 이동

### 5. 대시보드 (`/dashboard`)

- 오늘의 질문 표시 (또는 "오늘의 질문이 아직 발송되지 않았습니다")
- 최근 답변 이력 요약 (최근 5개)
- 간단한 통계 (총 답변 수, 평균 점수, 연속 답변일)

### 6. 답변 작성 (`/answer/:answerToken`)

- GET /api/answers/question?token={answerToken} 으로 질문 정보 로드
- 상단: 질문 내용, 카테고리, 난이도 배지
- 중앙: 텍스트 에디터 (textarea, 마크다운 미지원도 OK)
- 하단: "임시 저장" 버튼 (isFinal: false), "제출" 버튼 (isFinal: true)
- 답변 길이 가이드 표시 ("200자 이상 권장")
- 제출 성공 → `/feedback/:answerId` 이동
- 비로그인 시 제출 클릭 → 로그인 페이지로 이동 (returnUrl 파라미터 포함)

### 7. 피드백 결과 (`/feedback/:answerId`)

- GET /api/feedback/{answerId}
- 내 답변 원문 표시
- 종합 점수 + 등급 (A/B/C/D) 크게 표시
- 항목별 피드백 (내용 완성도, 답변 구조, 표현/말투, 구체성) — 접기/펼치기
- 개선 답변 예시 (토글)
- "다시 작성하기" 버튼 → 답변 페이지로 복귀

### 8. 마이페이지 — 답변 이력 (`/my/history`)

- GET /api/answers/my
- 필터: 카테고리, 날짜, 점수 범위
- 정렬: 최신순, 점수순
- 목록: 날짜, 질문 제목(앞 40자), 카테고리 배지, 점수, 상태
- 클릭 → 해당 피드백 페이지로 이동

---

## 개발 규칙

### 코드 작성 규칙

- 파일 구조는 과하게 세분화하지 않는다
- hooks, api 파일은 도메인 단위로 통합하여 하나의 파일로 작성
  - 예: `useAuth.ts` 하나에 signup/login/logout 통합
  - 예: `api/auth.ts` 하나에 signupAPI/loginAPI 통합
- 컴포넌트는 기능 도메인별 폴더로 분류 (auth, answer, feedback, my 등)
- 공용 UI 컴포넌트는 `components/common/`에 배치
- 페이지 컴포넌트는 `pages/`에 배치, 비즈니스 로직은 hooks로 분리
- Tailwind 유틸리티 클래스 직접 사용, CSS 파일 별도 생성 최소화
- TypeScript strict 모드 준수, any 사용 금지

### 상태 관리

- 인증 상태: AuthContext (React Context)로 전역 관리
- 서버 데이터: 각 hooks에서 useState + useEffect로 관리
- 폼 상태: 컴포넌트 로컬 useState

### 에러 처리

- API 호출 실패 시 사용자에게 에러 메시지 표시 (toast 또는 인라인)
- 401 응답 시 토큰 삭제 후 `/login`으로 리다이렉트 (Axios 인터셉터)
- 네트워크 에러 시 "서버에 연결할 수 없습니다" 메시지

### 목업 데이터 처리 (Phase 5, 6 미구현 API)

- 백엔드 Phase 5, 6이 아직 미구현이므로, 해당 API 호출부에 목업 데이터 fallback 구현
- 목업 데이터는 api 파일 내에 상수로 정의하고, 실제 API 완성 시 제거
- 목업 사용 부분에 `// TODO: 백엔드 완성 시 실제 API로 교체` 주석 필수

### 커밋 메시지 규칙

- 변경 파일이 여러 개일 경우, 관련 없는 변경은 반드시 커밋으로 분리
- 각 커밋 메시지에는 어떤 파일이 포함되는지 함께 명시
- 형식: "type: 한글 설명"
  - feat: 새로운 기능
  - fix: 버그 수정
  - chore: 설정, 문서, 기타
  - refactor: 리팩토링
- 설명은 무엇을 했는지 구체적으로 작성하고, 파일명이나 함수명이 있으면 포함
- 하나의 커밋에 여러 목적이 섞이면 반드시 분리를 먼저 제안

---

## 구현 순서

### Phase A: 프로젝트 세팅 + 공통 기반
1. Tailwind 설정 확인 (tailwind.config.js, postcss.config.js, index.css)
2. Axios 인스턴스 생성 (api/client.ts)
3. 타입 정의 (types/index.ts)
4. 토큰 유틸리티 (utils/token.ts)
5. AuthContext 구현 (contexts/AuthContext.tsx)
6. Layout 컴포넌트 (Header, Footer, Layout)
7. ProtectedRoute 컴포넌트
8. App.tsx 라우터 설정

### Phase B: 인증 + 온보딩 (백엔드 연동)
1. 회원가입 페이지 + API 연동
2. 로그인 페이지 + API 연동
3. 온보딩 페이지 + 프로필 API 연동

### Phase C: 답변 + 피드백 (목업 → 연동)
1. 답변 작성 페이지 (목업 데이터로 질문 표시)
2. 피드백 결과 페이지 (목업 데이터)
3. 백엔드 Phase 5, 6 완성 시 실제 API 연결

### Phase D: 마이페이지
1. 답변 이력 페이지
2. 대시보드 페이지

### Phase E: 부가 기능 (P1, P2)
1. 오답 노트
2. 성장 통계
3. 설정 페이지

---

## 주의사항

- 파일을 생성하거나 수정하기 전에 반드시 기존 파일 구조를 확인할 것
- 새로운 패키지를 추가하지 말 것 (현재 package.json에 있는 것만 사용, 패키지 매니저는 pnpm 사용)
- 백엔드 API 응답 형식(ApiResponse<T>)을 반드시 준수할 것
- 답변 페이지(/answer/:answerToken)는 비인증 상태에서도 질문 조회가 가능해야 함
- 답변 제출은 인증 필요 → 비로그인 상태면 로그인 페이지로 리다이렉트 (returnUrl 포함)
- Tailwind 클래스명은 디자인 시스템 색상 표를 기준으로 일관되게 사용
- 컴포넌트 작성 시 접근성(aria 속성, 키보드 네비게이션) 기본 수준 확보
