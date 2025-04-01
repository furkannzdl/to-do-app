import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean; // Yükleme durumu eklendi
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Başlangıçta yükleme durumu true

  // Token doğrulama fonksiyonu
  const verifyToken = async (storedToken: string | null) => {
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setUser(res.data.user); // Backend'den dönen kullanıcı bilgisi
      setToken(storedToken);
      localStorage.setItem('token', storedToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (error) {
      console.error('Token verification failed:', error);
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    verifyToken(storedToken); // Token'ı doğrula
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    const { token } = res.data; // Backend'den sadece token dönüyorsa
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    await verifyToken(token); // Giriş sonrası token'ı doğrula ve user'ı güncelle
  };

  const register = async (email: string, password: string) => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
      email,
      password,
    });
    await login(email, password); // Kayıt sonrası otomatik giriş
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};