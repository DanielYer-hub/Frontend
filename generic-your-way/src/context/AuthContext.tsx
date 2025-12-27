import { createContext, useState, useContext, useEffect, type FunctionComponent, type ReactNode } from 'react';
import { getMe, loginUser, registerUser } from '../services/userService';
import { setToken } from '../services/http';
import { track } from "../utils/analytics";


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
  try {
    const data = await loginUser(email, password);
    setTok(data.token);
    setToken(data.token);
    localStorage.setItem("token", data.token); 
    setUser(data.user);
    await refreshMe();
    track("Login Success", { method: "password" });
  } catch (e: any) {
    track("Login Failed", {
      status: e?.response?.status,
      reason: e?.response?.data?.message || "unknown",
    });
    throw e;
  }
};

 const registerAndLogin = async (payload: any) => {
  try {
    const reg = await registerUser(payload);
    if (reg?.token && reg?.user) {
      setTok(reg.token);
      setToken(reg.token);
      localStorage.setItem("token", reg.token); 
      setUser(reg.user);
      await refreshMe();
      track("Signup Success", { method: "email" });
      return;
    }
    await login(payload.email, payload.password);
    track("Signup Success", { method: "email_fallback_login" });
  } catch (e: any) {
    track("Signup Failed", {
      status: e?.response?.status,
      reason: e?.response?.data?.message || "unknown",
    });
    throw e;
  }
};

  const refreshMe = async () => {
  try {
    const me = await getMe();
    setUser(me);
    localStorage.setItem("user", JSON.stringify(me));
  } catch (e: any) {
    if (e?.response?.status === 401) {
      logout(); 
      return;
    }
    throw e;
  }
};

  const updateUserInContext = (patch: Partial<ApiUser>) => {
  setUser(prev => {
    const next = prev ? { ...prev, ...patch } : (patch as ApiUser);
    localStorage.setItem("user", JSON.stringify(next));
    return next;
  });
};

  const logout = () => {
    track("Auth: Logout");
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
