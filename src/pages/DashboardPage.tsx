import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { getMyAnswersAPI } from '../api/answer';
import type { AnswerHistory } from '../types';
import { formatDate, getScoreColor } from '../utils/format';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [answers, setAnswers] = useState<AnswerHistory[]>([]);
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

  const finalAnswers = answers.filter((a) => a.isFinal);
  const totalAnswers = finalAnswers.length;
  const recentAnswers = answers.slice(0, 5);

  // 평균 점수 계산
  const avgScore = (() => {
    const scored = finalAnswers.filter((a) => a.score !== null);
    if (scored.length === 0) return null;
    const sum = scored.reduce((acc, a) => acc + (a.score ?? 0), 0);
    return Math.round(sum / scored.length);
  })();

  // 연속 답변일 계산
  const streakDays = (() => {
    if (finalAnswers.length === 0) return 0;
    const dates = [...new Set(
      finalAnswers.map((a) => a.submittedAt.slice(0, 10)),
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
    { label: '평균 점수', value: avgScore !== null ? `${avgScore}점` : '-' },
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
                to={answer.isFinal ? `/feedback/${answer.id}` : `/answer/${answer.answerToken}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-gray-900 truncate">
                    {answer.questionContent?.slice(0, 50) || '(질문 없음)'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-indigo-50 text-indigo-900 text-xs font-medium px-2 py-0.5 rounded-full">
                      {answer.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(answer.submittedAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  {answer.score !== null && (
                    <span className={`text-sm font-bold ${getScoreColor(answer.score)}`}>
                      {answer.score}점
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${
                      answer.isFinal
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {answer.isFinal ? '제출완료' : '임시저장'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
