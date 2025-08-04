import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'viewer' | null;

interface AuthContextType {
  user: string | null;
  role: UserRole;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(null);

  const login = (username: string, password: string) => {
    // Mock authentication (replace later with backend)
    if (username === 'admin' && password === 'admin123') {
      setUser(username);
      setRole('admin');
      return true;
    } else if (username === 'viewer' && password === 'viewer123') {
      setUser(username);
      setRole('viewer');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
