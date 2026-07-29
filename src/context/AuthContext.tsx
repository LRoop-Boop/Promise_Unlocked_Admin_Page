import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  bypassed: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("adminToken")
  );
  const [bypassed, setBypassed] = useState(false);

  const login = (newToken: string) => {
    localStorage.setItem("adminToken", newToken);
    setToken(newToken);
    setBypassed(false);
  };
  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
    setBypassed(false);
  };

  return (
    <AuthContext.Provider value={{ token, bypassed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}