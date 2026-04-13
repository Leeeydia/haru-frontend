import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const MOBILE_TABS = [
  { to: '/dashboard', icon: 'dashboard', label: '홈' },
  { to: '/my/history', icon: 'account_circle', label: '마이페이지' },
  { to: '/settings', icon: 'settings', label: '설정' },
];

export default function MobileNav() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-surface/80 backdrop-blur-[20px] flex items-center justify-around z-50 border-t border-surface-container">
      {MOBILE_TABS.map(({ to, icon, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center gap-1 ${
            isActive(to) ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={isActive(to) ? { fontVariationSettings: '"FILL" 1' } : undefined}
          >
            {icon}
          </span>
          <span className="text-[10px] font-bold uppercase">{label}</span>
        </Link>
      ))}
    </div>
  );
}
