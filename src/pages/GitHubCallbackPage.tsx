import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { callbackGitHubAPI } from '../api/github';

export default function GitHubCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('GitHub 인증 코드가 없습니다.');
      return;
    }

    callbackGitHubAPI(code)
      .then((res) => {
        if (res.success) {
          navigate('/settings', { replace: true });
        } else {
          setError(res.message || 'GitHub 연동에 실패했습니다.');
        }
      })
      .catch(() => {
        setError('서버에 연결할 수 없습니다.');
      });
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/settings', { replace: true })}
          className="bg-indigo-900 hover:bg-indigo-700 text-white rounded-lg px-6 py-3 font-medium transition-colors"
        >
          설정으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-8 h-8 border-4 border-indigo-900 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">GitHub 연동 처리 중...</p>
    </div>
  );
}
