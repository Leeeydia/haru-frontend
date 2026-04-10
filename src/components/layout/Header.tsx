import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <header className="bg-indigo-900">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          하루한답
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-indigo-200 hover:text-white transition-colors">
                대시보드
              </Link>
              <Link to="/my/history" className="text-indigo-200 hover:text-white transition-colors">
                내 답변
              </Link>
              <button
                onClick={logout}
                className="text-indigo-300 hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-indigo-200 hover:text-white transition-colors">
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-white text-indigo-900 hover:bg-indigo-50 rounded-lg px-4 py-2 font-medium transition-colors"
              >
                시작하기
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
