import axios from 'axios';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        // Use a more React-friendly approach - dispatch a custom event
        // that the app can listen to for navigation
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Fallback to direct navigation if event not handled
        setTimeout(() => {
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
