import { createContext, useContext, useState, type ReactNode } from 'react';
import { getToken, setToken as saveToken, removeToken } from '../utils/token';
import type { AuthResponse } from '../types';

interface AuthUser {
  userId: number;
  email: string;
  name: string;
  onboardingCompleted: boolean;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextType extends AuthState {
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  setOnboardingCompleted: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = getToken();
    const userJson = localStorage.getItem('haru_user');
    if (token && userJson) {
      return { token, user: JSON.parse(userJson) };
    }
    return { token: null, user: null };
  });

  const loading = false;

  const login = (data: AuthResponse) => {
    const { token, userId, email, name, onboardingCompleted } = data;
    const user: AuthUser = { userId, email, name, onboardingCompleted: onboardingCompleted ?? false };
    saveToken(token);
    localStorage.setItem('haru_user', JSON.stringify(user));
    setAuthState({ token, user });
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('haru_user');
    setAuthState({ token: null, user: null });
  };

  const setOnboardingCompleted = () => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, onboardingCompleted: true };
      localStorage.setItem('haru_user', JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loading,
        login,
        logout,
        setOnboardingCompleted,
        isAuthenticated: !!authState.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
