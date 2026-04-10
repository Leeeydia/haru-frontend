import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { signupAPI, loginAPI } from '../api/auth';
import { getProfileAPI } from '../api/profile';
import type { SignupRequest, LoginRequest } from '../types';
import axios from 'axios';

export function useAuth() {
  const { login: contextLogin, logout: contextLogout } = useAuthContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signup = async (data: SignupRequest) => {
    setError(null);
    setLoading(true);
    try {
      const res = await signupAPI(data);
      if (res.data.success && res.data.data) {
        contextLogin(res.data.data);
        navigate('/onboarding');
      } else {
        setError(res.data.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('서버에 연결할 수 없습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest, returnUrl?: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await loginAPI(data);
      if (res.data.success && res.data.data) {
        contextLogin(res.data.data);
        try {
          const profileRes = await getProfileAPI();
          if (profileRes.data.success && profileRes.data.data) {
            navigate(returnUrl || '/dashboard');
          } else {
            navigate('/onboarding');
          }
        } catch {
          navigate('/onboarding');
        }
      } else {
        setError(res.data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('서버에 연결할 수 없습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    contextLogout();
    navigate('/');
  };

  return { signup, login, logout, error, setError, loading };
}
