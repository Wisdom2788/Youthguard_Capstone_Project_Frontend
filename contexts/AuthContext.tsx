import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '../services/api';
import { User, AuthTokens, UserRole } from '../types';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useUI } from './UIContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { closeAuthModal, setAuthModalState } = useUI();

  const fetchUser = useCallback(async () => {
    const tokensString = localStorage.getItem('authTokens');
    if (tokensString) {
      try {
        const { data } = await api.get<User>('/api/core/current-user/');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user', error);
        localStorage.removeItem('authTokens');
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const loginMutation = useMutation<AuthTokens, Error, any>({
    mutationFn: (credentials) => api.post('/api/auth/jwt/create/', credentials).then(res => res.data),
    onSuccess: async (data) => {
      localStorage.setItem('authTokens', JSON.stringify(data));
      await fetchUser();
      toast.success('Login successful!');
      closeAuthModal();
      
      // Navigate to dashboard without reload
      window.location.hash = '/dashboard';
    },
    onError: (error) => {
      console.error('Login failed:', error);
      toast.error('Login failed. Please check your credentials.');
    },
  });

  const registerMutation = useMutation<any, Error, any>({
    mutationFn: (userData) => api.post('/api/core/register-with-role/', userData),
    onSuccess: async (data) => {
      // If registration returns user data with tokens, log them in automatically
      if (data.access && data.refresh) {
        localStorage.setItem('authTokens', JSON.stringify({ access: data.access, refresh: data.refresh }));
        await fetchUser();
        toast.success('Registration successful! Welcome to YouthGuard!');
        closeAuthModal();
        
        // Navigate to dashboard without reload
        window.location.hash = '/dashboard';
      } else {
        // If no tokens, show login form
        toast.success('Registration successful! Please log in to continue.');
        setAuthModalState('login');
      }
    },
    onError: (error: any) => {
       const errorData = error.response?.data;
       const errorMessages = Object.entries(errorData).map(([key, value]) => {
         // Handle both string and array values
         const message = Array.isArray(value) ? value.join(', ') : String(value);
         return `${key}: ${message}`;
       }).join('\n');
       toast.error(`Registration failed:\n${errorMessages || 'Please try again.'}`);
    }
  });


  const login = async (credentials: any) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: any) => {
    await registerMutation.mutateAsync(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('authTokens');
    setUser(null);
    closeAuthModal(); // Close any open modals
    toast.success('Logged out successfully.');
    // Force a complete page reload to landing page
    window.location.href = window.location.origin + window.location.pathname;
  };

  const isAuthenticated = !!user;
  const role = user?.role || UserRole.GUEST;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};