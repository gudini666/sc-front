import axios from 'axios';
import config from '../config';
import { storage } from '../utils/storage';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Важно для работы с CORS
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', `${config.baseURL || ''}${config.url || ''}`);
    const token = storage.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.message);
    if (error.response?.data) {
      console.error('Error data:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api; 