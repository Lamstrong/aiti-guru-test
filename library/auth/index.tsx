import {
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import ky from 'ky';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

import { AuthContext } from './context';
import type { AuthContextType } from './context';
import type { User, AuthError, JwtPayload } from '../../types/auth';

const API_BASE = 'https://dummyjson.com';

type AuthProviderProps = {
  children: ReactNode;
  loading: ReactNode;
};

export const AuthProvider = ({ children, loading }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const clearToken = useCallback(() => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  }, []);

  // Восстановление сессии при запуске приложения
  const restoreAuth = useCallback(async () => {
    let savedToken = localStorage.getItem('authToken');

    if (!savedToken) {
      savedToken = sessionStorage.getItem('authToken');
    }

    if (savedToken) {
      try {
        const payload = jwtDecode<JwtPayload>(savedToken);
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          throw new Error('token expired');
        }

        setToken(savedToken);

        const userData = await ky
          .get(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          })
          .json<User>();

        setUser(userData);
      } catch {
        clearToken();
      }
    }
    setIsLoading(false);
  }, [clearToken]);

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  const login = async (username: string, password: string, rememberMe: boolean) => {
    setError(null);
    setIsLoading(true);

    try {
        const { accessToken: newToken } = await ky
          .post(`${API_BASE}/auth/login`, {
            json: { username, password, expiresInMins: 60 * 24 * 7 },
          })
          .json<{ accessToken: string }>();

      if (rememberMe) {
        localStorage.setItem('authToken', newToken);
        sessionStorage.removeItem('authToken');
      } else {
        sessionStorage.setItem('authToken', newToken);
        localStorage.removeItem('authToken');
      }

      setToken(newToken);

      const userData = await ky
        .get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${newToken}` },
        })
        .json<User>();

      setUser(userData);
      toast.success('Успешный вход!');
    } catch (err: unknown) {
      let message = 'Ошибка сервера. Попробуйте позже.';

      if (err instanceof Error) {
        const httpError = err as { response?: Response };
        if (httpError.response?.status === 400) {
          message = 'Неверный логин или пароль';
        }
      }

      const authError: AuthError = { message };
      setError(authError);
      toast.error(message);
      throw err; // чтобы форма могла поймать ошибку
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    toast.success('Вы вышли из системы');
    // window.location.href = '/login';
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? loading : children}
    </AuthContext.Provider>
  );
};