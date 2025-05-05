import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'; // Use .env for base URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the JWT in the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      return response.data;  // { token: ..., user: ...}
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  };
  
  export const register = async (userData) => {
      try {
          const response = await api.post('/users/', userData);
          return response.data;
      } catch (error) {
          throw error.response?.data || { error: 'Registration failed' };
      }
  };
  
  
  export const getJobs = async (filters = {}) => {
    try {
      const response = await api.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch jobs' };
    }
  };
  
  export const getJob = async (id) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch job details' };
    }
  };
  
  export const applyForJob = async (jobId) => {
      try {
          const response = await api.post(`/jobs/${jobId}/apply`);
          return response.data;
      } catch (error) {
          throw error.response?.data || { error: 'Failed to apply for the job' };
      }
  };
  
  export const saveJob = async (jobId) => {
      try {
          const response = await api.post(`/jobs/${jobId}/save`);
          return response.data;
      } catch (error) {
          throw error.response?.data || { error: 'Failed to save the job' };
      }
  };

export default api;
