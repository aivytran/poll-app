'use client';

import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  userId: string;
  login: (id: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const cookieId = Cookies.get('user_id');
    if (cookieId) {
      setUserId(cookieId);
    }
  }, [userId]);

  useEffect(() => {
    console.log(`${new Date().toISOString()} [AuthProvider] userId: ${userId}`);
  }, []);

  const login = (id: string) => {
    Cookies.set('user_id', id, { expires: 30 });
    setUserId(id);
  };

  const logout = () => {
    Cookies.remove('user_id');
    setUserId('');
  };

  return <AuthContext.Provider value={{ userId, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
