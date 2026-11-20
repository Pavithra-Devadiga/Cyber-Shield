import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const cleanBaseUrl = (() => {
  let url = (rawBaseUrl || '').trim().replace(/\/+$/, '');
  if (!url) return '/api';
  // Ensure the base URL ends with /api even if configured without it (e.g. https://my-backend.onrender.com)
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
})();

const api = axios.create({
  baseURL: cleanBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
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
    console.error('API Error:', error?.response?.status, error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
