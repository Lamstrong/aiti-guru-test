import { createContext, useContext } from 'react';
import type { User, AuthError } from '../../types/auth';

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: AuthError | null;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен использоваться внутри AuthProvider');
  return context;
};
