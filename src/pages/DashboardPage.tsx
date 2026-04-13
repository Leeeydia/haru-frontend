import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { getMyAnswersAPI } from '../api/answer';
import { getGitHubStatusAPI } from '../api/github';
import type { AnswerHistory, GitHubStatus } from '../types';
import { formatDate, getScoreColor } from '../utils/format';

export default function DashboardPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
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

  const avgScore = (() => {
    const scored = finalAnswers.filter((a) => a.score !== null);
    if (scored.length === 0) return null;
    const sum = scored.reduce((acc, a) => acc + (a.score ?? 0), 0);
    return Math.round(sum / scored.length);
  })();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-6 md:px-12">
      {/* Header */}
      <section className="mb-10">
        <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-primary mb-1">
          안녕하세요, {user?.name ?? '사용자'}님!
        </h1>
        <p className="text-on-surface-variant font-medium">{today}</p>
      </section>

      {/* GitHub banner */}
      {githubStatus && !githubStatus.connected && !githubBannerDismissed && (
        <div className="bg-secondary-container/15 border border-secondary-container/30 rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm shrink-0">
              <svg className="w-5 h-5 text-on-surface" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">GitHub를 연동하고 잔디를 채워보세요!</p>
              <p className="text-sm text-on-surface-variant mt-0.5">답변과 피드백이 자동으로 커밋되어 GitHub 잔디에 반영됩니다.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/settings"
              className="bg-primary text-on-primary text-sm rounded-full px-5 py-2.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              연동하기
            </Link>
            <button
              onClick={() => setGithubBannerDismissed(true)}
              className="text-on-surface-variant/50 hover:text-on-surface-variant p-1 transition-colors"
              aria-label="배너 닫기"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
        {/* Streak card (large) */}
        <div className="md:col-span-2 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-lg overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-on-primary/60 font-bold uppercase tracking-widest text-xs">
              Daily Streak
            </span>
            <div className="text-6xl font-headline font-extrabold mt-2 tracking-tighter">
              {streakDays}
            </div>
            <p className="text-on-primary/80 mt-2 font-medium">
              {streakDays > 0 ? '꾸준히 이어가세요!' : '오늘 첫 답변을 작성해보세요!'}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: '"FILL" 1' }}>
              local_fire_department
            </span>
          </div>
        </div>

        {/* Total count */}
        <div
          onClick={() => navigate('/my/history')}
          className="bg-surface-container-lowest rounded-xl p-6 flex flex-col justify-center border-b-2 border-primary/5 cursor-pointer hover:bg-surface-container-low transition-colors"
        >
          <span className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">
            Total Count
          </span>
          <div className="text-3xl font-headline font-bold text-primary mt-1">
            {totalAnswers}
          </div>
          <div className="mt-4 flex items-center gap-2 text-on-surface-variant text-sm font-medium">
            <span className="material-symbols-outlined text-sm">edit_note</span>
            <span>제출한 답변</span>
          </div>
        </div>

        {/* Avg score */}
        <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col justify-center border-b-2 border-primary/5">
          <span className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">
            Avg Score
          </span>
          <div className="text-3xl font-headline font-bold text-primary mt-1">
            {avgScore !== null ? `${avgScore}%` : '-'}
          </div>
          {avgScore !== null && (
            <div className="mt-4 flex items-center gap-1">
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all" style={{ width: `${avgScore}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick link */}
        <div className="bg-surface-container-low rounded-xl p-6 flex flex-col justify-center">
          <span className="text-on-surface-variant text-sm font-semibold uppercase tracking-wider">
            Quick Links
          </span>
          <div className="mt-3 space-y-2">
            <Link
              to="/my/history"
              className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-base">history</span>
              답변 이력
            </Link>
            <Link
              to="/my/wrong-notes"
              className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-base">note_alt</span>
              오답 노트
            </Link>
          </div>
        </div>
      </div>

      {/* Today's question */}
      <section className="mb-10">
        <h2 className="font-headline text-xl font-bold text-primary mb-4">오늘의 질문</h2>
        <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">schedule</span>
          <p className="text-on-surface-variant text-lg font-medium">오늘의 질문이 아직 발송되지 않았습니다.</p>
          <p className="text-on-surface-variant/60 text-sm mt-2">설정한 시간에 이메일로 질문을 보내드립니다.</p>
        </div>
      </section>

      {/* Recent answers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-xl font-bold text-primary">최근 답변 이력</h2>
          {recentAnswers.length > 0 && (
            <Link
              to="/my/history"
              className="text-sm font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest"
            >
              View All
            </Link>
          )}
        </div>
        {recentAnswers.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-3">edit_note</span>
            <p className="text-on-surface-variant text-lg font-medium">아직 작성한 답변이 없습니다.</p>
            <p className="text-on-surface-variant/60 text-sm mt-2">이메일로 받은 질문에 답변을 작성해보세요.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl divide-y divide-surface-container">
            {recentAnswers.map((answer) => (
              <Link
                key={answer.id}
                to={answer.isFinal ? `/feedback/${answer.id}` : `/answer/${answer.answerToken}`}
                className="group flex items-center justify-between px-6 py-5 hover:bg-surface-container-low transition-colors first:rounded-t-xl last:rounded-b-xl"
              >
                <div className="min-w-0">
                  <p className="text-on-surface font-medium truncate group-hover:text-primary transition-colors">
                    {answer.questionContent?.slice(0, 50) || '(질문 없음)'}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="bg-surface-container-low text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight">
                      {answer.category}
                    </span>
                    <span className="text-sm text-on-surface-variant/60">
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
                    className={`text-[10px] font-bold uppercase tracking-tight px-3 py-1 rounded-full ${
                      answer.isFinal
                        ? 'bg-green-600/10 text-green-700'
                        : 'bg-amber-500/10 text-amber-700'
                    }`}
                  >
                    {answer.isFinal ? '제출완료' : '임시저장'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
