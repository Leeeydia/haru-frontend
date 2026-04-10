import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getScoreGrade, getScoreColor } from '../../utils/format';

// TODO: 백엔드 완성 시 실제 API 데이터로 교체
interface HistoryItem {
  answerId: number;
  questionContent: string;
  category: string;
  difficulty: string;
  score: number | null;
  isFinal: boolean;
  submittedAt: string;
}

const MOCK_HISTORY: HistoryItem[] = [
  { answerId: 1, questionContent: 'React의 Virtual DOM이 실제 DOM과 비교하여 어떤 장점을 가지는지 설명하고, 재조정 과정이 어떻게 동작하는지 서술하세요.', category: '프론트엔드', difficulty: '중급', score: 72, isFinal: true, submittedAt: '2025-04-11T09:00:00Z' },
  { answerId: 2, questionContent: 'TCP 3-way handshake의 과정을 설명하고, 각 단계에서 어떤 플래그가 사용되는지 서술하세요.', category: 'CS', difficulty: '초급', score: 85, isFinal: true, submittedAt: '2025-04-10T09:00:00Z' },
  { answerId: 3, questionContent: 'REST API의 설계 원칙과 RESTful한 API를 만들기 위해 고려해야 할 사항들을 설명하세요.', category: '백엔드', difficulty: '중급', score: 60, isFinal: true, submittedAt: '2025-04-09T09:00:00Z' },
  { answerId: 4, questionContent: 'JavaScript의 클로저(Closure)란 무엇이며, 실제 개발에서 어떤 상황에 활용할 수 있는지 예시를 들어 설명하세요.', category: '프론트엔드', difficulty: '중급', score: 91, isFinal: true, submittedAt: '2025-04-08T09:00:00Z' },
  { answerId: 5, questionContent: '프로젝트에서 팀원 간 의견 충돌이 발생했을 때 어떻게 해결하셨나요?', category: '인성', difficulty: '초급', score: 78, isFinal: true, submittedAt: '2025-04-07T09:00:00Z' },
  { answerId: 6, questionContent: 'Spring Boot에서 의존성 주입(DI)이란 무엇이며, 어떤 방식들이 있는지 설명하세요.', category: '백엔드', difficulty: '초급', score: null, isFinal: false, submittedAt: '2025-04-06T09:00:00Z' },
  { answerId: 7, questionContent: '데이터베이스 인덱스의 동작 원리와 인덱스를 설계할 때 주의할 점을 설명하세요.', category: 'CS', difficulty: '고급', score: 68, isFinal: true, submittedAt: '2025-04-05T09:00:00Z' },
  { answerId: 8, questionContent: 'CSS Flexbox와 Grid의 차이점을 설명하고, 각각 어떤 상황에서 사용하는 것이 적합한지 서술하세요.', category: '프론트엔드', difficulty: '초급', score: 88, isFinal: true, submittedAt: '2025-04-04T09:00:00Z' },
];

const CATEGORIES = ['전체', 'CS', '프론트엔드', '백엔드', '공통', '인성'];
const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'score-high', label: '점수 높은순' },
  { value: 'score-low', label: '점수 낮은순' },
];

export default function HistoryPage() {
  const [category, setCategory] = useState('전체');
  const [sort, setSort] = useState('latest');

  const filtered = MOCK_HISTORY
    .filter((item) => category === '전체' || item.category === category)
    .sort((a, b) => {
      if (sort === 'score-high') return (b.score ?? -1) - (a.score ?? -1);
      if (sort === 'score-low') return (a.score ?? 999) - (b.score ?? 999);
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">답변 이력</h1>

      {/* 필터 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-indigo-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none sm:ml-auto"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-400 text-lg">답변 이력이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-2">면접 질문에 답변을 작성해보세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link
              key={item.answerId}
              to={`/feedback/${item.answerId}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 font-medium truncate">
                    {item.questionContent.slice(0, 50)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="bg-indigo-50 text-indigo-900 text-xs font-medium px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                      {item.difficulty}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(item.submittedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.score !== null ? (
                    <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                      {item.score}점 <span className="text-sm">{getScoreGrade(item.score)}</span>
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">채점 전</span>
                  )}
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      item.isFinal
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {item.isFinal ? '제출완료' : '임시저장'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
