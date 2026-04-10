import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { getMyAnswersAPI } from '../api/answer';
import type { Answer } from '../types';
import { formatDate } from '../utils/format';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAnswersAPI()
      .then((res) => {
        if (res.success && res.data) {
          setAnswers(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const totalAnswers = answers.filter((a) => a.isFinal).length;
  const recentAnswers = answers.slice(0, 5);

  // 연속 답변일 계산
  const streakDays = (() => {
    if (answers.length === 0) return 0;
    const dates = [...new Set(
      answers.filter((a) => a.isFinal).map((a) => a.submittedAt.slice(0, 10)),
    )].sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  const stats = [
    { label: '총 답변 수', value: totalAnswers > 0 ? `${totalAnswers}개` : '0개' },
    { label: '평균 점수', value: '-' },
    { label: '연속 답변일', value: streakDays > 0 ? `${streakDays}일` : '0일' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* 인사말 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          안녕하세요, {user?.name ?? '사용자'}님!
        </h1>
        <p className="text-gray-500 mt-1">{today}</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
          >
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-indigo-900">{value}</p>
          </div>
        ))}
      </div>

      {/* 오늘의 질문 */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">오늘의 질문</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-400 text-lg">오늘의 질문이 아직 발송되지 않았습니다.</p>
          <p className="text-gray-400 text-sm mt-2">설정한 시간에 이메일로 질문을 보내드립니다.</p>
        </div>
      </div>

      {/* 최근 답변 이력 */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">최근 답변 이력</h2>
        {recentAnswers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-400 text-lg">아직 작성한 답변이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">
              이메일로 받은 질문에 답변을 작성해보세요.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
            {recentAnswers.map((answer) => (
              <Link
                key={answer.id}
                to={`/feedback/${answer.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-gray-900 truncate">
                    {answer.content.slice(0, 40) || '(내용 없음)'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(answer.submittedAt)}
                  </p>
                </div>
                <span
                  className={`ml-4 text-xs font-medium px-3 py-1 rounded-full ${
                    answer.isFinal
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {answer.isFinal ? '제출완료' : '임시저장'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
