import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { getProfileAPI, saveProfileAPI } from '../api/profile';
import { getGitHubStatusAPI, connectGitHubAPI, disconnectGitHubAPI } from '../api/github';
import type { UserProfile, GitHubStatus } from '../types';

export default function SettingsPage() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [github, setGitHub] = useState<GitHubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubMessage, setGithubMessage] = useState('');

  // 프로필 폼 상태
  const [receiveTime, setReceiveTime] = useState(9);
  const [dailyQuestionCount, setDailyQuestionCount] = useState(1);
  const [receiveDays, setReceiveDays] = useState('EVERYDAY');

  useEffect(() => {
    Promise.all([
      getProfileAPI().then((res) => {
        if (res.data.success && res.data.data) {
          const p = res.data.data;
          setProfile(p);
          setReceiveTime(p.receiveTime);
          setDailyQuestionCount(p.dailyQuestionCount);
          setReceiveDays(p.receiveDays);
        }
      }),
      getGitHubStatusAPI().then((res) => {
        if (res.success && res.data) {
          setGitHub(res.data);
        }
      }),
    ]).finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveMessage('');
    try {
      const res = await saveProfileAPI({
        jobCategory: profile.jobCategory,
        techStacks: profile.techStacks,
        receiveTime,
        dailyQuestionCount,
        receiveDays,
      });
      if (res.data.success) {
        setSaveMessage('설정이 저장되었습니다.');
      } else {
        setSaveMessage(res.data.message || '저장에 실패했습니다.');
      }
    } catch {
      setSaveMessage('서버에 연결할 수 없습니다.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleConnectGitHub = async () => {
    setGithubLoading(true);
    setGithubMessage('');
    try {
      const res = await connectGitHubAPI();
      if (res.success && res.data) {
        window.location.href = res.data.authUrl;
      } else {
        setGithubMessage(res.message || 'GitHub 연동에 실패했습니다.');
      }
    } catch {
      setGithubMessage('서버에 연결할 수 없습니다.');
    } finally {
      setGithubLoading(false);
    }
  };

  const handleDisconnectGitHub = async () => {
    if (!confirm('GitHub 연동을 해제하시겠습니까? 더 이상 답변이 자동 커밋되지 않습니다.')) return;
    setGithubLoading(true);
    setGithubMessage('');
    try {
      const res = await disconnectGitHubAPI();
      if (res.success) {
        setGitHub({ connected: false, username: null, repo: null });
        setGithubMessage('GitHub 연동이 해제되었습니다.');
      } else {
        setGithubMessage(res.message || '연동 해제에 실패했습니다.');
      }
    } catch {
      setGithubMessage('서버에 연결할 수 없습니다.');
    } finally {
      setGithubLoading(false);
      setTimeout(() => setGithubMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">설정</h1>

      {/* 계정 정보 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">계정 정보</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">이름</span>
            <span className="text-sm text-gray-900 font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">이메일</span>
            <span className="text-sm text-gray-900 font-medium">{user?.email}</span>
          </div>
        </div>
      </section>

      {/* GitHub 연동 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">GitHub 연동</h2>
        <p className="text-sm text-gray-500 mb-5">
          GitHub를 연동하면 면접 답변과 AI 피드백이 자동으로 커밋되어 잔디에 반영됩니다.
        </p>

        {github?.connected ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-sm font-medium px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                연동됨
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-sm text-gray-700 font-medium">{github.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-sm text-gray-600">{github.repo}</span>
              </div>
            </div>
            <button
              onClick={handleDisconnectGitHub}
              disabled={githubLoading}
              className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              {githubLoading ? '처리 중...' : '연동 해제'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectGitHub}
            disabled={githubLoading}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-5 py-2.5 font-medium transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {githubLoading ? '연동 중...' : 'GitHub 연동하기'}
          </button>
        )}

        {githubMessage && (
          <p className={`text-sm mt-3 ${githubMessage.includes('해제') || githubMessage.includes('실패') || githubMessage.includes('연결') ? 'text-red-600' : 'text-emerald-600'}`}>
            {githubMessage}
          </p>
        )}
      </section>

      {/* 질문 수신 설정 */}
      {profile && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">질문 수신 설정</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">수신 시간</label>
              <select
                value={receiveTime}
                onChange={(e) => setReceiveTime(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value={-1}>테스트용 (매시간 발송)</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">일일 질문 수</label>
              <select
                value={dailyQuestionCount}
                onChange={(e) => setDailyQuestionCount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>{n}개</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">수신 요일</label>
              <select
                value={receiveDays}
                onChange={(e) => setReceiveDays(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="EVERYDAY">매일</option>
                <option value="WEEKDAY">평일만</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
              {saveMessage && (
                <span className={`text-sm ${saveMessage.includes('실패') || saveMessage.includes('연결') ? 'text-red-600' : 'text-emerald-600'}`}>
                  {saveMessage}
                </span>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
