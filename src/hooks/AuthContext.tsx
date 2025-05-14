'use client';

import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  userId: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  initialUserId,
  children,
}: {
  initialUserId: string;
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<string>(initialUserId);

  return <AuthContext.Provider value={{ userId }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
