'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import http, { getToken, setToken } from '../../../lib/http/client';
import type { AuthResult, CurrentUser } from '../../../lib/types/models';

interface AuthContextValue {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<CurrentUser>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    try {
      const me = await http.get<CurrentUser>('/api/users/me');
      setUser(me);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const applyAuth = useCallback(async (result: AuthResult) => {
    setToken(result.accessToken);
    const me = await http.get<CurrentUser>('/api/users/me');
    setUser(me);
    return me;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const auth = await http.post<AuthResult>('/api/auth/login', { email, password }, { token: false });
      return  await applyAuth(auth);
    },
    [applyAuth],
  );

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      const auth = await http.post<AuthResult>('/api/auth/register', { fullName, email, password }, { token: false });
      await applyAuth(auth);
    },
    [applyAuth],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  return ctx;
}