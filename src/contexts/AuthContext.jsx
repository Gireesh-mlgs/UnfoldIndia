import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { saveToken, getToken, logout as doLogout } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      // optionally decode token to get user info; for now set session
      setSession({ token });
      setUser({ email: 'unknown' });
    }
  }, []);

  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.register(email, password);
      if (res.token) {
        saveToken(res.token);
        setSession({ token: res.token });
        setUser(res.user || { email });
        toast({ title: 'Registered', description: 'Welcome!' });
        navigate('/');
      }
    } catch (err) {
      toast({ title: 'Registration failed', description: err.message || String(err), variant: 'destructive' });
      throw err;
    } finally { setLoading(false); }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.token) {
        saveToken(res.token);
        setSession({ token: res.token });
        setUser(res.user || { email });
        toast({ title: 'Signed in', description: 'Welcome back!' });
        navigate('/');
      }
    } catch (err) {
      toast({ title: 'Login failed', description: err.message || String(err), variant: 'destructive' });
      throw err;
    } finally { setLoading(false); }
  };

  const signOut = () => {
    doLogout();
    setUser(null);
    setSession(null);
    navigate('/login');
  };

  const value = { user, session, loading, signUp, signIn, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
