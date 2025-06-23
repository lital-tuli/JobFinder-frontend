import axios from 'axios';

// =============================================================================
// API CONFIGURATION
// =============================================================================

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// =============================================================================
// REQUEST INTERCEPTOR
// =============================================================================

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      // Add both Authorization and x-auth-token headers for compatibility
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }

    // Log request for debugging (remove in production)
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing tokens and redirecting');
      
      // Clear tokens from storage
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        console.log('Redirecting to login page');
        window.location.href = '/login';
      }
    }

    // Log error for debugging
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        url: error.config?.url,
        method: error.config?.method
      });
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// ERROR HANDLING HELPER
// =============================================================================

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
    // Something else happened
    console.error('Unexpected Error:', error.message);
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

// =============================================================================
// AUTHENTICATION SERVICES
// =============================================================================

// User registration
export const register = async (userData) => {
  try {
    console.log('userService.register called with:', { 
      email: userData.email, 
      name: userData.name,
      role: userData.role 
    });

    const response = await api.post('/users', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Registration successful, token stored');
    }
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.token,
      message: response.data.message
    };
  } catch (error) {
    console.error('userService.register error:', error);
    handleApiError(error);
  }
};

// User login
export const login = async (email, password) => {
  try {
    console.log('userService.login called with email:', email);

    const response = await api.post('/users/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      console.log('Login successful, token stored');
    }
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.token,
      message: response.data.message
    };
  } catch (error) {
    console.error('userService.login error:', error);
    handleApiError(error);
  }
};

// Check authentication status
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      console.log('checkAuth: No token found');
      return { isAuthenticated: false };
    }

    console.log('checkAuth: Token found, verifying with server');
    const response = await api.get('/users/check-auth');
    
    return { 
      isAuthenticated: true, 
      user: response.data.user 
    };
  } catch {
    console.log('Auth check failed - user not authenticated');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    return { isAuthenticated: false };
  }
};

// User logout
export const logout = async () => {
  try {
    // Call server logout endpoint
    await api.post('/users/logout');
  } catch (error) {
    console.warn('Server logout failed, continuing with local logout:', error.message);
  } finally {
    // Always clear local storage
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    console.log('User logged out successfully');
  }
};

// =============================================================================
// PROFILE SERVICES
// =============================================================================

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data.user;
  } catch (error) {
    console.error('Get user profile error:', error);
    handleApiError(error);
  }
};

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await api.get('/users/profile/me');
    return response.data.user;
  } catch (error) {
    console.error('Get current user profile error:', error);
    handleApiError(error);
  }
};

// Update user profile
export const updateProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}`, profileData);
    return {
      success: true,
      user: response.data.user,
      message: response.data.message
    };
  } catch (error) {
    console.error('Update profile error:', error);
    handleApiError(error);
  }
};

// Update current user profile
export const updateCurrentProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile/me', profileData);
    return {
      success: true,
      user: response.data.user,
      message: response.data.message
    };
  } catch (error) {
    console.error('Update current profile error:', error);
    handleApiError(error);
  }
};

// =============================================================================
// JOB-RELATED USER SERVICES
// =============================================================================

// Get user's saved jobs
export const getSavedJobs = async (userId) => {
  try {
    const endpoint = userId ? `/users/${userId}/saved-jobs` : '/users/jobs/saved';
    const response = await api.get(endpoint);
    return response.data.jobs || [];
  } catch (error) {
    console.error('Get saved jobs error:', error);
    handleApiError(error);
  }
};

// Get user's applied jobs
export const getAppliedJobs = async (userId) => {
  try {
    const endpoint = userId ? `/users/${userId}/applied-jobs` : '/users/jobs/applied';
    const response = await api.get(endpoint);
    return response.data.jobs || [];
  } catch (error) {
    console.error('Get applied jobs error:', error);
    handleApiError(error);
  }
};

// Get job activity summary
export const getJobActivity = async () => {
  try {
    const response = await api.get('/users/jobs/activity');
    return response.data;
  } catch (error) {
    console.error('Get job activity error:', error);
    handleApiError(error);
  }
};

// =============================================================================
// FILE UPLOAD SERVICES
// =============================================================================

// Upload profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      profilePicture: response.data.profilePicture,
      message: response.data.message
    };
  } catch (error) {
    console.error('Upload profile picture error:', error);
    handleApiError(error);
  }
};

// Upload resume
export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/users/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      resume: response.data.resume,
      message: response.data.message
    };
  } catch (error) {
    console.error('Upload resume error:', error);
    handleApiError(error);
  }
};

// Delete profile picture
export const deleteProfilePicture = async () => {
  try {
    const response = await api.delete('/users/profile/picture');
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Delete profile picture error:', error);
    handleApiError(error);
  }
};

// Delete resume
export const deleteResume = async () => {
  try {
    const response = await api.delete('/users/profile/resume');
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Delete resume error:', error);
    handleApiError(error);
  }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Check if user is authenticated (without API call)
export const isAuthenticated = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return !!token;
};

// Get stored token
export const getToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Set token
export const setToken = (token, remember = true) => {
  if (remember) {
    localStorage.setItem('token', token);
  } else {
    sessionStorage.setItem('token', token);
  }
};

// Clear token
export const clearToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// =============================================================================
// SEARCH AND DISCOVERY
// =============================================================================

// Search users
export const searchUsers = async (query, filters = {}) => {
  try {
    const params = new URLSearchParams({
      q: query,
      ...filters
    });

    const response = await api.get(`/users/search?${params}`);
    return response.data.users || [];
  } catch (error) {
    console.error('Search users error:', error);
    handleApiError(error);
  }
};

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const response = await api.get(`/users/role/${role}`);
    return response.data.users || [];
  } catch (error) {
    console.error('Get users by role error:', error);
    handleApiError(error);
  }
};

// =============================================================================
// EXPORT DEFAULT SERVICE OBJECT
// =============================================================================

const userService = {
  // Auth
  register,
  login,
  logout,
  checkAuth,
  
  // Profile
  getUserProfile,
  getCurrentUserProfile,
  updateProfile,
  updateCurrentProfile,
  
  // Jobs
  getSavedJobs,
  getAppliedJobs,
  getJobActivity,
  
  // Files
  uploadProfilePicture,
  uploadResume,
  deleteProfilePicture,
  deleteResume,
  
  // Utility
  isAuthenticated,
  getToken,
  setToken,
  clearToken,
  
  // Search
  searchUsers,
  getUsersByRole
};

export default userService;