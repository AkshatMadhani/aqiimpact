import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
      return Promise.reject(error);
    }

    const message = error.response?.data?.message || 'Something went wrong';

    if (error.response?.status === 400 || error.response?.status === 404) {
      return Promise.reject(error);
    }

    if (error.response?.status >= 500) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);


export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (data) => api.put('/api/auth/profile', data),
};

export const aqiAPI = {
  getCurrentAQI: (city) => api.get(`/api/aqi/${city}`),
  getHistorical: (city, days = 7) => api.get(`/api/aqi/${city}/historical?days=${days}`),
};

export const exposureAPI = {
  calculate: (data) => api.post('/api/exposure/calculate', data),
  getHistory: (days = 7) => api.get(`/api/exposure/history?days=${days}`),
};

export const routeAPI = {
  findRoutes: (data) => api.post('/api/routes/find', data),
  compare: (data) => api.post('/api/routes/compare', data),
  calculate: (data) => api.post('/api/routes/calculate', data),
};

export const policyAPI = {
  getRecommendations: (city, aqi) => api.get(`/api/policy?city=${city}&aqi=${aqi}`),
};

export const interventionAPI = {
  simulate: (data) => api.post('/api/interventions/simulate', data),
  log: (data) => api.post('/api/interventions/log', data),
  getAll: (city) => api.get(`/api/interventions/${city}`),
  getHighRiskZones: (city) => api.get(`/api/interventions/${city}/high-risk-zones`),
};

export const suggestionAPI = {
  get: (data) => api.post('/api/suggestions', data),
};

export const adminAPI = {
  getUsers: (page = 1) => api.get(`/api/admin/users?page=${page}`),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
};

export default api;