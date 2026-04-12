import { createContext, useContext, useState, type ReactNode } from 'react';
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
