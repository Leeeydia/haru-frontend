import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const MY_MENU = [
  { to: '/my/history', label: '답변 이력' },
  { to: '/my/wrong-notes', label: '오답 노트' },
  { to: '/my/stats', label: '성장 통계' },
  { to: '/settings', label: '설정' },
];

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="bg-indigo-900">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white">
          하루한답
        </Link>

        <nav className="flex items-center gap-5">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                대시보드
              </Link>

              {/* 마이페이지 드롭다운 */}
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-1 text-indigo-200 hover:text-white text-sm font-medium transition-colors"
                >
                  마이페이지
                  <svg
                    className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    {MY_MENU.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => { setOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-indigo-200 hover:text-white text-sm transition-colors">
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-white text-indigo-900 hover:bg-indigo-50 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
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
