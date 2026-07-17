import axios from 'axios';

// Varsayılan API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5105/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Token varsa header'a ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 Unauthorized gelirse çıkış yap
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 hatası alındığında token geçersizdir, temizle
      localStorage.removeItem('token');
      // Auth Store resetlenebilir (bu kısmı authStore içerisinde handle edeceğiz veya buradan window.location ile yönlendireceğiz)
    }
    return Promise.reject(error);
  }
);

export default api;
