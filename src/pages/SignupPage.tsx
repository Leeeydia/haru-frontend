import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';

export default function SignupPage() {
  const { isAuthenticated } = useAuthContext();
  const { signup, error, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = (): string | null => {
    if (name.trim().length < 2) return '이름은 2자 이상 입력해주세요.';
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) return '올바른 이메일 형식을 입력해주세요. (예: user@example.com)';
    if (password.length < 8) return '비밀번호는 8자 이상 입력해주세요.';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return '비밀번호에 특수문자를 1개 이상 포함해주세요.';
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return '비밀번호에 영문과 숫자를 모두 포함해주세요.';
    if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다.';
    return null;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    signup({ email, password, name: name.trim() });
  };

  const displayError = validationError || error;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-6 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-secondary-container/20 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary text-2xl">person_add</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            회원가입
          </h1>
          <p className="text-on-surface-variant text-sm mt-2">
            하루한답과 함께 면접 준비를 시작하세요
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-8">
          {displayError && (
            <div className="bg-error/10 text-error text-sm rounded-lg px-4 py-3 mb-6 font-medium">
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-on-surface mb-2">
                이름
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
            </div>

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
                placeholder="영문 + 숫자 + 특수문자, 8자 이상"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-on-surface mb-2">
                비밀번호 확인
              </label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-on-primary rounded-full px-6 py-3.5 font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-6">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-primary font-bold hover:text-primary-container transition-colors">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
