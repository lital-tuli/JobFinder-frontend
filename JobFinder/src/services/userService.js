import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token; // For backward compatibility
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens on authentication error
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        console.log('401 error - redirecting to login');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const USERS_URL = '/users';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'x-auth-token': token // For backward compatibility if server expects this header
  };
};

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 
                   error.response.data?.error || 
                   `Server error (${error.response.status})`;
    console.error('API Error:', {
      status: error.response.status,
      message,
      url: error.config?.url,
      method: error.config?.method
    });
    throw new Error(message);
  } else if (error.request) {
    // Network error
    console.error('Network Error:', error.message);
    throw new Error('Network error. Please check your connection.');
  } else {
    // Other error
    console.error('Error:', error.message);
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// =============================================================================
// AUTHENTICATION FUNCTIONS - FIXED
// =============================================================================

export const login = async (credentials) => {
  try {
    console.log('userService.login called with email:', credentials.email);
    
    const response = await api.post(`${USERS_URL}/login`, credentials);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    if (!response.data.token) {
      throw new Error('No authentication token received from server');
    }
    
    if (!response.data.user) {
      throw new Error('No user data received from server');
    }
    
    if (!response.data.user._id) {
      throw new Error('Invalid user data - missing user ID');
    }
    
    if (!response.data.user.email) {
      throw new Error('Invalid user data - missing email');
    }
    
    if (!response.data.user.role) {
      throw new Error('Invalid user data - missing role');
    }
    
    console.log('userService.login successful for:', response.data.user.email);
    
    // Store token based on remember me preference
    if (credentials.rememberMe) {
      localStorage.setItem('token', response.data.token);
      sessionStorage.removeItem('token'); // Clear from session if exists
    } else {
      sessionStorage.setItem('token', response.data.token);
      localStorage.removeItem('token'); // Clear from local if exists
    }
    
    return response.data;
  } catch (error) {
    console.error('userService.login error:', error);
    
    // Clear any existing tokens on login failure
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    handleApiError(error);
  }
};

export const register = async (userData) => {
  try {
    console.log('userService.register called for email:', userData.email);
    
    const response = await api.post(`${USERS_URL}/`, userData);
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    console.log('userService.register successful');
    return response.data;
  } catch (error) {
    console.error('userService.register error:', error);
    handleApiError(error);
  }
};

export const logout = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  
  try {
    if (token) {
      // Call logout endpoint if token exists
      await api.post(`${USERS_URL}/logout`, {}, {
        headers: getAuthHeaders()
      });
      console.log('Server logout successful');
    }
  } catch (error) {
    // Log error but don't throw - logout should always succeed locally
    console.warn('Server logout failed:', error.message);
  } finally {
    // Always clear tokens regardless of API call success/failure
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    console.log('Tokens cleared from storage');
  }
  
  return { success: true, message: "Logged out successfully" };
};

export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      console.log('checkAuth: No token found');
      return { isAuthenticated: false, user: null };
    }
    
    const response = await api.get(`${USERS_URL}/check-auth`, {
      headers: getAuthHeaders()
    });
    
    if (!response.data) {
      throw new Error('No data received from auth check');
    }
    
    console.log('checkAuth successful');
    return response.data;
  } catch (error) {
    console.error('checkAuth error:', error);
    
    // Clear invalid tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    handleApiError(error);
  }
};

// =============================================================================
// PROFILE MANAGEMENT FUNCTIONS
// =============================================================================

export const updateProfile = async (userData) => {
  try {
    const response = await api.put(`${USERS_URL}/profile`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await api.put(`${USERS_URL}/change-password`, passwordData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`${USERS_URL}/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// =============================================================================
// JOB INTERACTION FUNCTIONS
// =============================================================================

export const getSavedJobs = async (userId) => {
  try {
    const response = await api.get(`${USERS_URL}/${userId}/saved-jobs`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAppliedJobs = async (userId) => {
  try {
    const response = await api.get(`${USERS_URL}/${userId}/applied-jobs`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const saveJob = async (jobId) => {
  try {
    const response = await api.post(`${USERS_URL}/save-job`, 
      { jobId },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const unsaveJob = async (jobId) => {
  try {
    const response = await api.delete(`${USERS_URL}/save-job/${jobId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const applyToJob = async (jobId, applicationData = {}) => {
  try {
    const response = await api.post(`${USERS_URL}/apply-job`, 
      { jobId, ...applicationData },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await api.post(`${USERS_URL}/upload-profile-picture`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post(`${USERS_URL}/upload-resume`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};



export default {
  login,
  register,
  logout,
  checkAuth,
  updateProfile,
  changePassword,
  getUserProfile,
  getSavedJobs,
  getAppliedJobs,
  saveJob,
  unsaveJob,
  applyToJob,
  uploadProfilePicture,
  uploadResume
};