import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading, user } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  // 온보딩 미완료 시 /onboarding으로 리다이렉트 (단, /onboarding 자체는 허용)
  if (!user?.onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
