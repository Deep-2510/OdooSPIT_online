// client/src/services/api/base.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        
        case 403:
          // Forbidden - show access denied message
          console.error('Access denied:', data.message);
          break;
        
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        
        case 422:
          // Validation error
          console.error('Validation error:', data.errors);
          break;
        
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        
        default:
          console.error('API error:', data.message);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API utility functions
export const apiUtils = {
  // Generic API call with error handling
  call: async (apiFunction, ...args) => {
    try {
      const response = await apiFunction(...args);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Upload file with progress
  upload: async (url, file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });
      
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message 
      };
    }
  },

  // Download file
  download: async (url, filename, params = {}) => {
    try {
      const response = await api.get(url, {
        params,
        responseType: 'blob',
      });

      // Create blob and download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { error: null };
    } catch (error) {
      return { 
        error: error.response?.data?.message || error.message 
      };
    }
  },
};

export default api;