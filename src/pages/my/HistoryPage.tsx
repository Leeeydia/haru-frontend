import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAnswersAPI } from '../../api/answer';
import { formatDate, getScoreGrade, getScoreColor } from '../../utils/format';
import type { AnswerHistory } from '../../types';

const CATEGORIES = ['전체', 'CS', '프론트엔드', '백엔드', '공통', '인성'];
const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'score-high', label: '점수 높은순' },
  { value: 'score-low', label: '점수 낮은순' },
];

export default function HistoryPage() {
  const [answers, setAnswers] = useState<AnswerHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('전체');
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    getMyAnswersAPI()
      .then((res) => {
        if (res.success && res.data) {
          setAnswers(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = answers
    .filter((item) => category === '전체' || item.category === category)
    .sort((a, b) => {
      if (sort === 'score-high') return (b.score ?? -1) - (a.score ?? -1);
      if (sort === 'score-low') return (a.score ?? 999) - (b.score ?? 999);
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
              key={item.id}
              to={item.isFinal ? `/feedback/${item.id}` : `/answer/${item.answerToken}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 font-medium truncate">
                    {item.questionContent?.slice(0, 50) || '(질문 없음)'}
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
