import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getToken, setToken as saveToken, removeToken } from '../utils/token';
import type { AuthResponse } from '../types';

interface AuthState {
  token: string | null;
  user: Omit<AuthResponse, 'token'> | null;
}

interface AuthContextType extends AuthState {
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
  });

  const login = (data: AuthResponse) => {
    const { token, ...user } = data;
    saveToken(token);
    localStorage.setItem('haru_user', JSON.stringify(user));
    setAuthState({ token, user });
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem('haru_user');
    setAuthState({ token: null, user: null });
  };

  useEffect(() => {
    const token = getToken();
    const userJson = localStorage.getItem('haru_user');
    if (token && userJson) {
      setAuthState({ token, user: JSON.parse(userJson) });
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loading,
        login,
        logout,
        isAuthenticated: !!authState.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
