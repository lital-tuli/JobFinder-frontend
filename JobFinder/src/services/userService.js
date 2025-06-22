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
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
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

// Helper function to handle API errors - FIXED to throw instead of return
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 
                   error.response.data?.error || 
                   'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // Network error
    throw new Error('Network error. Please check your connection.');
  } else {
    // Other error
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// =============================================================================
// AUTHENTICATION FUNCTIONS - FIXED
// =============================================================================

export const login = async (credentials) => {
  try {
    const response = await api.post(`${USERS_URL}/login`, credentials);
    
    // Verify we got a token and user data
    if (!response.data.token || !response.data.user) {
      throw new Error('Invalid response from server - missing token or user data');
    }
    
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
    // Clear any existing tokens on login failure
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    
    // Use our error handler which now throws
    handleApiError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post(`${USERS_URL}/`, userData);
    return response.data;
  } catch (error) {
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
    }
  } catch (error) {
    // Log error but don't throw - logout should always succeed locally
    console.warn('Server logout failed:', error.message);
  } finally {
    // Always clear tokens regardless of API call success/failure
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  }
  
  return { success: true, message: "Logged out successfully" };
};

export const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get(`${USERS_URL}/check-auth`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    // Clear invalid tokens
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    if (error.response?.status === 401) {
      throw new Error("Authentication token expired or invalid");
    } else if (error.response?.status === 304) {
      // Handle 304 Not Modified
      return error.response.data || {};
    }
    handleApiError(error);
  }
};

// =============================================================================
// USER PROFILE FUNCTIONS - FIXED
// =============================================================================

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`${USERS_URL}/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`${USERS_URL}/${userId}`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to view profile");
    }

    const response = await api.get(`${USERS_URL}/profile/me`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCurrentUser = async (userData) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to update profile");
    }

    const response = await api.put(`${USERS_URL}/profile/me`, userData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// =============================================================================
// JOB RELATED FUNCTIONS - FIXED
// =============================================================================

export const getSavedJobs = async (userId) => {
  try {
    const response = await api.get(`${USERS_URL}/${userId}/saved-jobs`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
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
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error);
  }
};

export const getCurrentUserSavedJobs = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to view saved jobs");
    }

    const response = await api.get(`${USERS_URL}/jobs/saved`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error);
  }
};

export const getCurrentUserAppliedJobs = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to view applied jobs");
    }

    const response = await api.get(`${USERS_URL}/jobs/applied`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error);
  }
};

export const getJobActivitySummary = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to view job activity");
    }

    const response = await api.get(`${USERS_URL}/jobs/activity`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error);
  }
};

// =============================================================================
// FILE UPLOAD FUNCTIONS - FIXED
// =============================================================================

export const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to upload profile picture");
    }

    if (!file) {
      throw new Error("File is required");
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, GIF, and WebP images are allowed");
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await api.post(`${USERS_URL}/profile/picture`, formData, {
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
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to upload resume");
    }

    if (!file) {
      throw new Error("File is required");
    }

    // Validate file type for resume
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only PDF and Word documents are allowed for resumes");
    }

    // Validate file size (10MB limit for documents)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File size must be less than 10MB");
    }

    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post(`${USERS_URL}/profile/resume`, formData, {
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

export const deleteProfilePicture = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to delete profile picture");
    }

    const response = await api.delete(`${USERS_URL}/profile/picture`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteResume = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to delete resume");
    }

    const response = await api.delete(`${USERS_URL}/profile/resume`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserFiles = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to view files");
    }

    const response = await api.get(`${USERS_URL}/profile/files`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error);
  }
};

export const downloadResume = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("Please log in to download resume");
    }

    const response = await api.get(`${USERS_URL}/profile/resume/download`, {
      headers: getAuthHeaders(),
      responseType: 'blob'
    });
    
    // Extract filename from response headers or use default
    let filename = 'resume.pdf';
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).+?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    
    // Create download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    handleApiError(error);
  }
};

// =============================================================================
// ALIAS FUNCTIONS FOR COMPATIBILITY
// =============================================================================

// Create aliases for AuthContext compatibility
export const updateProfile = updateCurrentUser; // AuthContext expects this name

// =============================================================================
// DEFAULT EXPORT WITH ALL FUNCTIONS
// =============================================================================

const userService = {
  // Authentication
  login,
  register,
  logout,
  checkAuth,
  
  // User Profile
  getUserById,
  updateUser,
  getCurrentUser,
  updateCurrentUser,
  updateProfile, // Alias for AuthContext
  
  // Job Related
  getSavedJobs,
  getAppliedJobs,
  getCurrentUserSavedJobs,
  getCurrentUserAppliedJobs,
  getJobActivitySummary,
  
  // File Management
  uploadProfilePicture,
  uploadResume,
  deleteProfilePicture,
  deleteResume,
  getUserFiles,
  downloadResume
};

export default userService;