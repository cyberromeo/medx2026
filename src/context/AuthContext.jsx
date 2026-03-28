import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const CORRECT_PASSWORD = 'letspassfmge';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('medx-auth') === 'true';
  });

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('medx-auth', 'true');
    }
  }, [isAuthenticated]);

  const login = (password) => {
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('medx-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
