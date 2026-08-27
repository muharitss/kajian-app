import axios from 'axios';

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('kajian_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('kajian_admin_token');
      localStorage.removeItem('kajian_admin_user');
    }
    return Promise.reject(error);
  }
);
