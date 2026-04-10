import client from './client';
import type { ApiResponse, Feedback } from '../types';

// TODO: 백엔드 완성 시 목업 제거
const MOCK_FEEDBACK: Feedback = {
  id: 1,
  answerId: 1,
  totalScore: 72,
  completeness: 'Virtual DOM의 개념과 장점을 설명했지만, 실제 DOM 조작 비용이 왜 비싼지에 대한 구체적인 설명이 부족합니다. 브라우저 렌더링 파이프라인(Reflow/Repaint)과 연결지어 설명하면 더 완성도 높은 답변이 됩니다.',
  structure: '도입-본론-결론 구조가 잘 갖춰져 있습니다. 다만 재조정 과정을 단계별로 나눠서 설명하면 면접관이 이해하기 더 쉬울 것입니다. 번호를 매기거나 소제목을 활용해보세요.',
  expression: '기술 용어를 적절히 사용하고 있으며, 문장이 간결합니다. "~것 같습니다" 같은 불확실한 표현 대신 "~입니다"로 자신감 있게 서술하면 더 좋겠습니다.',
  specificity: 'Diffing 알고리즘에 대해 언급했지만 O(n) 시간복잡도, key prop의 역할 등 구체적인 수치나 예시가 부족합니다. 실제 코드 예시나 성능 비교 수치를 포함하면 차별화된 답변이 됩니다.',
  improvedAnswer: 'React의 Virtual DOM은 실제 DOM의 가벼운 JavaScript 객체 복사본입니다. 실제 DOM 조작이 비싼 이유는 변경 시마다 브라우저가 Reflow(레이아웃 재계산)와 Repaint(화면 다시 그리기)를 수행하기 때문입니다.\n\nVirtual DOM의 핵심 장점은 세 가지입니다:\n1. **배치 업데이트**: 여러 상태 변경을 모아서 한 번에 실제 DOM에 반영합니다.\n2. **최소 변경**: Diffing 알고리즘으로 변경된 부분만 찾아 업데이트합니다.\n3. **크로스 플랫폼**: 실제 DOM에 의존하지 않아 React Native 등에서도 동작합니다.\n\n재조정(Reconciliation) 과정은 다음과 같습니다:\n1. 상태가 변경되면 새로운 Virtual DOM 트리를 생성합니다.\n2. 이전 Virtual DOM과 새 Virtual DOM을 비교(Diffing)합니다. 이때 O(n) 휴리스틱 알고리즘을 사용합니다.\n3. 다른 타입의 엘리먼트는 하위 트리 전체를 교체하고, 같은 타입이면 속성만 비교합니다.\n4. 리스트에서는 key prop을 사용해 엘리먼트를 식별하고 불필요한 재생성을 방지합니다.\n5. 계산된 최소 변경 사항을 실제 DOM에 일괄 적용합니다.',
  createdAt: new Date().toISOString(),
};

// TODO: 백엔드 완성 시 실제 API로 교체
export async function getFeedbackAPI(answerId: number) {
  try {
    const res = await client.get<ApiResponse<Feedback>>(`/api/feedback/${answerId}`);
    return res.data;
  } catch {
    return {
      success: true,
      data: { ...MOCK_FEEDBACK, answerId },
      message: '목업 데이터',
    } as ApiResponse<Feedback>;
  }
}
