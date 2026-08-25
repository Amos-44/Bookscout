import React, { createContext, useState, useEffect, useContext } from 'react';

// Dynamic API URL for local vs production deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => (res.ok ? res.json() : null))
        .then(data => (data ? setUser(data) : logout()))
        .catch(() => logout());
    }
  }, [token]);

  const login = (tokenData, userData) => {
    localStorage.setItem('token', tokenData);
    setToken(tokenData);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to fix the 'useAuth' import error in BookContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};