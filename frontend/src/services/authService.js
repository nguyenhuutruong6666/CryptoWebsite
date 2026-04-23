import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/api/auth/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/api/auth/profile', data);
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post('/api/auth/forgot-password', { email });
    return res.data;
  },

  verifyOTP: async (email, otp) => {
    const res = await api.post('/api/auth/verify-otp', { email, otp });
    return res.data;
  },

  resetPassword: async (email, otp, newPassword) => {
    const res = await api.post('/api/auth/reset-password', { email, otp, newPassword });
    return res.data;
  }
};
