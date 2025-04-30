'use client';

import Cookies from 'js-cookie';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  userId: string | null;
  login: (id: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const cookieId = Cookies.get('user_id');
    if (cookieId) {
      setUserId(cookieId);
    }
  }, []);

  const login = (id: string) => {
    Cookies.set('user_id', id, { expires: 30 });
    setUserId(id);
  };

  const logout = () => {
    Cookies.remove('user_id');
    setUserId(null);
  };

  return <AuthContext.Provider value={{ userId, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
