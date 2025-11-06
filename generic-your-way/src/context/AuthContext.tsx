import { createContext, useState, useContext, useEffect, type FunctionComponent, type ReactNode } from 'react';
import { getMe, loginUser, registerUser } from '../services/userService';
import { setToken } from '../services/http';

type ApiName = { first: string; last: string };
type ApiUser = {
  id: string;
  name: ApiName;
  email: string;
  region: string;
  role: 'player' | 'admin';
  address:{
    city: string;
    country: string;
  };
  settings: string[];
  bio?: string | null;
  image?: { url?: string | null } | null;
  contacts?: { phoneE164?: string | null; telegramUsername?: string | null } | null;
};

interface AuthContextType {
  user: ApiUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registerAndLogin: (payload: any) => Promise<void>;
  refreshMe: () => Promise<void>;
  updateUserInContext: (patch: Partial<ApiUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setTok] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t) {
      setTok(t);
      setToken(t);
    }
    if (u) {
      try { setUser(JSON.parse(u) as ApiUser); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password); 
    setTok(data.token);
    setToken(data.token);
    setUser(data.user);
    await refreshMe();
  };

  const registerAndLogin = async (payload: any) => {
    const reg = await registerUser(payload);
    if (reg?.token && reg?.user) {
      setTok(reg.token);
      setToken(reg.token);
      setUser(reg.user);
      await refreshMe();
      return;
    }
    await login(payload.email, payload.password);
  };

  const refreshMe = async () => {
    const me = await getMe();
    setUser(me);
    localStorage.setItem('user', JSON.stringify(me));
  };

  const updateUserInContext = (patch: Partial<ApiUser>) => {
  setUser(prev => {
    const next = prev ? { ...prev, ...patch } : (patch as ApiUser);
    localStorage.setItem("user", JSON.stringify(next));
    return next;
  });
};

  const logout = () => {
    setTok(null);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, registerAndLogin, refreshMe, updateUserInContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
