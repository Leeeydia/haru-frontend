import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: '대시보드' },
  { to: '/my/history', label: '마이페이지' },
  { to: '/settings', label: '설정' },
];

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
  const location = useLocation();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-[20px]">
      <div className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">menu_book</span>
          <span className="text-xl font-headline font-extrabold tracking-tighter text-primary">
            하루한답
          </span>
        </Link>

        {/* Desktop Nav */}
        {isAuthenticated ? (
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={
                  isActive(to)
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant font-medium hover:text-primary transition-colors'
                }
              >
                {label}
              </Link>
            ))}
          </nav>
        ) : null}

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden text-on-secondary-container font-bold text-sm"
              >
                {user?.name?.charAt(0) || 'U'}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 py-1 z-50">
                  <div className="px-4 py-3 border-b border-surface-container">
                    <p className="text-sm font-bold text-on-surface truncate">{user?.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  {MY_MENU.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-surface-container">
                    <button
                      onClick={() => { setOpen(false); logout(); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-surface-container-low transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:block text-on-surface-variant font-medium hover:text-primary transition-colors text-sm"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="bg-primary text-on-primary rounded-full px-5 py-2.5 text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                시작하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
