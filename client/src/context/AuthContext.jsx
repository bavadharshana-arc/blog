import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on app initialization
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('[Auth] Session validation failed:', error.response?.data?.message || error.message);
          // Token is expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      const { user: loggedInUser, token: authToken } = res.data;
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setToken(authToken);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const { user: registeredUser, token: authToken } = res.data;
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      setUser(registeredUser);
      setToken(authToken);
      return res;
    }
    throw new Error(res.message || 'Registration failed');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
