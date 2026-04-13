import { useState, type FormEvent } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { isAuthenticated } = useAuthContext();
  const { login, error, loading } = useAuth();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const returnUrl = searchParams.get('returnUrl') || undefined;
    login({ email, password }, returnUrl);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-secondary-container/20 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">lock_open</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            로그인
          </h1>
          <p className="text-on-surface-variant text-sm mt-2">
            하루한답에 돌아오신 것을 환영합니다
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8">
          {error && (
            <div className="bg-error/10 text-error text-sm rounded-lg px-4 py-3 mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-on-surface mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-on-surface mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary rounded-full px-6 py-3.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            계정이 없으신가요?{' '}
            <Link to="/signup" className="text-primary font-bold hover:text-primary-container transition-colors">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
