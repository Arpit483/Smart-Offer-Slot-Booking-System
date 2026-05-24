/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';

interface User {
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialAuthState = () => {
  const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

  if (storedToken && storedUser) {
    if (isTokenExpired(storedToken)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return { user: null, token: null };
    } else {
      try {
        return { user: JSON.parse(storedUser), token: storedToken };
      } catch {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        return { user: null, token: null };
      }
    }
  }
  return { user: null, token: null };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getInitialAuthState().user);
  const [token, setToken] = useState<string | null>(() => getInitialAuthState().token);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User, rememberMe: boolean = true) => {
    setToken(newToken);
    setUser(newUser);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', newToken);
    storage.setItem('user', JSON.stringify(newUser));
    if (!rememberMe) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  if (loading) return <div></div>;

  const isAuthenticated = !!token && !isTokenExpired(token);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
