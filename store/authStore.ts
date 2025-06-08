import { create } from 'zustand';
import api from '../src/lib/axios';
import { storage } from '../src/utils/storage';

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
  token: storage.get('token'),
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      console.log('Login response:', response.data.data);
      const { token, user } = response.data.data;
      
      if (!token) {
        console.error('No token received from server');
        throw new Error('No token received');
      }

      console.log('Saving token to localStorage');
      storage.set('token', token);
      set({ user, token, isAuthenticated: true });
      console.log('Login successful, state updated');
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      console.log('Attempting registration with data:', { username, email });
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
      });

      console.log('Registration response:', response.data.data);
      const { token, user } = response.data.data;
      
      if (!token) {
        console.error('No token received from server');
        throw new Error('No token received');
      }

      console.log('Saving token to localStorage');
      storage.set('token', token);
      set({ user, token, isAuthenticated: true });
      console.log('Registration successful, state updated');
    } catch (error: any) {
      console.error('Registration error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  logout: () => {
    console.log('Logging out...');
    storage.remove('token');
    set({ user: null, token: null, isAuthenticated: false });
    console.log('Logout complete');
  },

  checkAuth: async () => {
    try {
      console.log('Checking authentication...');
      const token = storage.get('token');
      console.log('Current token:', token);
      
      if (!token) {
        console.log('No token found');
        set({ user: null, token: null, isAuthenticated: false });
        return;
      }

      const response = await api.get('/api/auth/me');
      console.log('Auth check response:', response.data);
      set({ user: response.data.data, token, isAuthenticated: true });
      console.log('Auth check successful');
    } catch (error: any) {
      console.error('Auth check error:', error.response?.data || error.message);
      storage.remove('token');
      set({ user: null, token: null, isAuthenticated: false });
    }
  },
})); 