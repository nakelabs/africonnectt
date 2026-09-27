import React, { createContext, useContext, useState, useEffect } from 'react';
import { API, getAuthToken, setAuthToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    async function initAuth() {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userData = await API.auth.me();
        setUser(userData);
      } catch (err) {
        setAuthToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await API.auth.login(email, password);
    setAuthToken(data.access_token);
    const userData = await API.auth.me();
    setUser(userData);
    return userData;
  };

  const signupFounder = async (payload) => {
    const data = await API.auth.signupFounder(payload);
    setAuthToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const signupInvestor = async (payload) => {
    const data = await API.auth.signupInvestor(payload);
    setAuthToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await API.auth.logout();
    } catch(e) {} // ignore if failed
    setAuthToken(null);
    setUser(null);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role, login, signupFounder, signupInvestor, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
