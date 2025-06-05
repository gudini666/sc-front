import { create } from 'zustand';
import api from '../src/lib/axios';

interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data);
      const { token, user } = response.data;
      
      if (!token) {
        console.error('No token received from server');
        throw new Error('No token received');
      }

      console.log('Saving token to localStorage');
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
      console.log('Login successful, state updated');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      console.log('Attempting registration...');
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
      });

      console.log('Registration response:', response.data);
      const { token, user } = response.data;
      
      if (!token) {
        console.error('No token received from server');
        throw new Error('No token received');
      }

      console.log('Saving token to localStorage');
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
      console.log('Registration successful, state updated');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
    console.log('Logout complete');
  },

  checkAuth: async () => {
    try {
      console.log('Checking authentication...');
      const token = localStorage.getItem('token');
      console.log('Current token:', token);
      
      if (!token) {
        console.log('No token found');
        set({ user: null, token: null, isAuthenticated: false });
        return;
      }

      const response = await api.get('/api/auth/me');
      console.log('Auth check response:', response.data);
      set({ user: response.data, token, isAuthenticated: true });
      console.log('Auth check successful');
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
})); 