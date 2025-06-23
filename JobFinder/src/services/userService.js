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
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Add authentication header
      config.headers['x-auth-token'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =============================================================================
// RESPONSE INTERCEPTOR
// =============================================================================

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear tokens from storage
      localStorage.removeItem('token');
      
      // Only redirect if not already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// =============================================================================
// AUTHENTICATION SERVICES
// =============================================================================

// Check authentication status
const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    const response = await api.get('/users/check-auth');
    
    return {
      isAuthenticated: true,
      user: response.data.user || response.data
    };
  } catch (error) {
    localStorage.removeItem('token');
    return { 
      isAuthenticated: false, 
      user: null,
      error: error.response?.data?.message || 'Authentication check failed'
    };
  }
};

// User login
const login = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
        message: response.data.message || 'Login successful'
      };
    } else {
      return {
        success: false,
        error: 'No token received from server'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

// User registration
const register = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
        message: response.data.message || 'Registration successful'
      };
    } else {
      return {
        success: false,
        error: 'Registration failed - no token received'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed'
    };
  }
};

// User logout
const logout = async () => {
  try {
    await api.post('/users/logout');
  } catch {
    // Continue with logout even if API call fails
  } finally {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

// =============================================================================
// USER PROFILE SERVICES
// =============================================================================

// Get user profile
const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return {
      success: true,
      user: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get user profile'
    };
  }
};

// Update user profile
const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return {
      success: true,
      user: response.data.user || response.data,
      message: response.data.message || 'Profile updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile'
    };
  }
};

// Get current user profile
const getCurrentUserProfile = async () => {
  try {
    const response = await api.get('/users/profile/me');
    return {
      success: true,
      user: response.data.user || response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get current user profile'
    };
  }
};

// Update current user profile
const updateCurrentUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile/me', userData);
    return {
      success: true,
      user: response.data.user || response.data,
      message: response.data.message || 'Profile updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update profile'
    };
  }
};

// =============================================================================
// FILE UPLOAD SERVICES
// =============================================================================

// Upload profile picture
const uploadProfilePicture = async (file) => {
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
      user: response.data.user,
      message: response.data.message || 'Profile picture uploaded successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload profile picture'
    };
  }
};

// Upload resume
const uploadResume = async (file) => {
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
      user: response.data.user,
      message: response.data.message || 'Resume uploaded successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload resume'
    };
  }
};

// Delete profile picture
const deleteProfilePicture = async () => {
  try {
    const response = await api.delete('/users/profile/picture');
    return {
      success: true,
      message: response.data.message || 'Profile picture deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete profile picture'
    };
  }
};

// Delete resume
const deleteResume = async () => {
  try {
    const response = await api.delete('/users/profile/resume');
    return {
      success: true,
      message: response.data.message || 'Resume deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete resume'
    };
  }
};

// =============================================================================
// JOB SERVICES
// =============================================================================

// Get saved jobs
const getSavedJobs = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/saved-jobs`);
    return {
      success: true,
      jobs: response.data.jobs || response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get saved jobs'
    };
  }
};

// Get applied jobs
const getAppliedJobs = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/applied-jobs`);
    return {
      success: true,
      jobs: response.data.jobs || response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get applied jobs'
    };
  }
};

// Get current user's saved jobs
const getCurrentUserSavedJobs = async () => {
  try {
    const response = await api.get('/users/jobs/saved');
    return {
      success: true,
      jobs: response.data.jobs || response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get saved jobs'
    };
  }
};

// Get current user's applied jobs
const getCurrentUserAppliedJobs = async () => {
  try {
    const response = await api.get('/users/jobs/applied');
    return {
      success: true,
      jobs: response.data.jobs || response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get applied jobs'
    };
  }
};

// Get job activity summary
const getJobActivity = async () => {
  try {
    const response = await api.get('/users/jobs/activity');
    return {
      success: true,
      activity: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get job activity'
    };
  }
};

// =============================================================================
// EXPORT SERVICES
// =============================================================================

const userService = {
  // Authentication
  checkAuth,
  login,
  register,
  logout,
  
  // Profile Management
  getUserProfile,
  updateUserProfile,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  
  // File Upload
  uploadProfilePicture,
  uploadResume,
  deleteProfilePicture,
  deleteResume,
  
  // Job Services
  getSavedJobs,
  getAppliedJobs,
  getCurrentUserSavedJobs,
  getCurrentUserAppliedJobs,
  getJobActivity,
  
  // Direct API access for custom calls
  api
};

export default userService;