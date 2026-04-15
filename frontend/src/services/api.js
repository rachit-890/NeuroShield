import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to handle requests from the dashboard/analytics
export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  getTopUsers: (params) => api.get('/analytics/top-users', { params }),
  getSuspicious: (params) => api.get('/analytics/suspicious', { params }),
  getErrorRate: () => api.get('/analytics/error-rate'),
};

export const securityService = {
  getLogs: (params) => api.get('/logs', { params }), // We'll need to implement this endpoint or similar
  getThreats: () => api.get('/security/threats'),
};

export default api;
