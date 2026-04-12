import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { getMyAnswersAPI } from '../api/answer';
import { getGitHubStatusAPI } from '../api/github';
import type { AnswerHistory, GitHubStatus } from '../types';
import { formatDate, getScoreColor } from '../utils/format';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const [answers, setAnswers] = useState<AnswerHistory[]>([]);
  const [githubStatus, setGithubStatus] = useState<GitHubStatus | null>(null);
  const [githubBannerDismissed, setGithubBannerDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyAnswersAPI().then((res) => {
        if (res.success && res.data) {
          setAnswers(res.data);
        }
      }),
      getGitHubStatusAPI().then((res) => {
        if (res.success && res.data) {
          setGithubStatus(res.data);
        }
      }),
    ]).finally(() => setLoading(false));
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

      {/* GitHub 연동 유도 배너 */}
      {githubStatus && !githubStatus.connected && !githubBannerDismissed && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg p-2.5 shadow-sm">
              <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-900">GitHub를 연동하고 잔디를 채워보세요!</p>
              <p className="text-sm text-indigo-700 mt-0.5">답변과 피드백이 자동으로 커밋되어 GitHub 잔디에 반영됩니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <Link
              to="/settings"
              className="bg-indigo-900 hover:bg-indigo-700 text-white text-sm rounded-lg px-4 py-2 font-medium transition-colors"
            >
              연동하기
            </Link>
            <button
              onClick={() => setGithubBannerDismissed(true)}
              className="text-indigo-400 hover:text-indigo-600 p-1"
              aria-label="배너 닫기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

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
