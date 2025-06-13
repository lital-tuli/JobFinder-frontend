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
      // Optionally redirect to login
      window.location.href = '/login';
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

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      error: true,
      message: error.response.data?.message || error.response.data?.error || 'An error occurred',
      status: error.response.status,
      details: error.response.data
    };
  } else if (error.request) {
    // Network error
    return {
      error: true,
      message: 'Network error. Please check your connection.',
      status: 0
    };
  } else {
    // Other error
    return {
      error: true,
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
};

// Authentication Functions
export const login = async (credentials) => {
  try {
    const response = await api.post(`${USERS_URL}/login`, credentials);
    
    // Store token if provided
    if (response.data.token) {
      if (credentials.rememberMe) {
        localStorage.setItem('token', response.data.token);
      } else {
        sessionStorage.setItem('token', response.data.token);
      }
    }
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post(`${USERS_URL}/`, userData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (token) {
      // Call logout endpoint if token exists
      await api.post(`${USERS_URL}/logout`, {}, {
        headers: getAuthHeaders()
      });
    }
    
    // Clear tokens regardless of API call success
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    // Still clear tokens even if API call fails
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    
    console.error('Logout error:', error);
    return { success: true, message: "Logged out successfully" };
  }
};

export const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "No authentication token found" };
    }

    const response = await api.get(`${USERS_URL}/check-auth`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    // Handle 304 for auth check
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// User Profile Functions
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`${USERS_URL}/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await api.put(`${USERS_URL}/${userId}`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to view profile" };
    }

    const response = await api.get(`${USERS_URL}/profile/me`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateCurrentUser = async (userData) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to update profile" };
    }

    const response = await api.put(`${USERS_URL}/profile/me`, userData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Job Related Functions
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
    return handleApiError(error);
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
    return handleApiError(error);
  }
};

export const getCurrentUserSavedJobs = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to view saved jobs" };
    }

    const response = await api.get(`${USERS_URL}/jobs/saved`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    return handleApiError(error);
  }
};

export const getCurrentUserAppliedJobs = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to view applied jobs" };
    }

    const response = await api.get(`${USERS_URL}/jobs/applied`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    return handleApiError(error);
  }
};

export const getJobActivitySummary = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to view job activity" };
    }

    const response = await api.get(`${USERS_URL}/jobs/activity`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// File Upload Functions
export const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to upload profile picture" };
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
    return handleApiError(error);
  }
};

export const uploadResume = async (file) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to upload resume" };
    }

    if (!file) {
      throw new Error("File is required");
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only PDF and Word documents are allowed");
    }

    // Validate file size (10MB limit)
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
    return handleApiError(error);
  }
};

export const deleteProfilePicture = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to delete profile picture" };
    }

    const response = await api.delete(`${USERS_URL}/profile/picture`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteResume = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to delete resume" };
    }

    const response = await api.delete(`${USERS_URL}/profile/resume`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getUserFiles = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to view files" };
    }

    const response = await api.get(`${USERS_URL}/profile/files`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

export const downloadResume = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to download resume" };
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
    return handleApiError(error);
  }
};

// Default export with all functions
const userService = {
  login,
  register,
  logout,
  checkAuth,
  getUserById,
  updateUser,
  getCurrentUser,
  updateCurrentUser,
  getSavedJobs,
  getAppliedJobs,
  getCurrentUserSavedJobs,
  getCurrentUserAppliedJobs,
  getJobActivitySummary,
  uploadProfilePicture,
  uploadResume,
  deleteProfilePicture,
  deleteResume,
  getUserFiles,
  downloadResume
};

export default userService;