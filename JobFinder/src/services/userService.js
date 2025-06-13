import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USERS_URL = `${API_BASE_URL}/users`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  validateStatus: function (status) {
    // Accept status codes from 200-399 (including 304)
    return status >= 200 && status < 400;
  }
});

api.interceptors.response.use(
  (response) => {
    // Handle 304 responses as success
    if (response.status === 304) {
      console.log('304 Not Modified - user data unchanged');
      response.data = response.data || {};
    }
    return response;
  },
  (error) => {
    // Don't treat 304 as error
    if (error.response && error.response.status === 304) {
      console.log('304 intercepted in user service - returning success');
      return Promise.resolve({
        ...error.response,
        data: error.response.data || {}
      });
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  if (error.response && error.response.status === 304) {
    console.log('User data not modified (304), using cached data');
    return error.response.data || {};
  }
  
  const errorMessage = 
    error.response?.data?.message || 
    error.response?.data || 
    error.message || 
    'An unexpected error occurred';
  
  console.error("User API Error:", {
    message: errorMessage,
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method
  });
  
  throw { error: errorMessage, status: error.response?.status };
};

// Helper to add auth token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { "x-auth-token": token } : {};
};

export const login = async (email, password, rememberMe = false) => {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    console.log('Attempting login for:', email);

    const response = await api.post(`${USERS_URL}/login`, { email, password });
    const responseData = response.data;
    
    console.log('Login response status:', response.status);
    
    if (responseData && responseData.token) {
      // Store token based on remember me option
      if (rememberMe) {
        localStorage.setItem("token", responseData.token);
        // Remove from session storage if it exists
        sessionStorage.removeItem("token");
      } else {
        sessionStorage.setItem("token", responseData.token);
        // Remove from local storage if it exists
        localStorage.removeItem("token");
      }
      
      console.log('Login successful, token stored');
    }
    
    return responseData;
  } catch (error) {
    console.error('Login error:', error);
    return handleApiError(error);
  }
};
    
// Register user
export const register = async (userData) => {
  try {
    // Set default values if not provided
    const dataWithDefaults = {
      ...userData,
      role: userData.role || 'jobseeker',
      profession: userData.profession || 'Not specified',
      bio: userData.bio || 'No bio provided'
    };

    console.log('Attempting registration with data:', dataWithDefaults);

    const response = await api.post(USERS_URL, dataWithDefaults);
    
    console.log('Registration response status:', response.status);
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    return handleApiError(error);
  }
};

export const getUserById = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await api.get(`${USERS_URL}/${userId}`, {
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

// Update user profile
export const updateUser = async (userId, userData) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await api.put(`${USERS_URL}/${userId}`, userData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "No authentication token found" };
    }

    const response = await api.get(`${USERS_URL}/profile/me`, {
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

// Update current user profile
export const updateCurrentUser = async (userData) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to update your profile" };
    }

    const response = await api.put(`${USERS_URL}/profile/me`, userData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getSavedJobs = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

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
    if (!userId) {
      throw new Error("User ID is required");
    }

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

// Get current user's saved jobs
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

// Get current user's applied jobs
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

// Get job activity summary
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
    // ✅ FIX: Handle 304 for job activity
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Upload profile picture
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

// Upload resume
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

// Delete profile picture
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

// Delete resume
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

// Get user files information
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
    // ✅ FIX: Handle 304 for user files
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Download resume
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
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
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

// Check authentication status
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
    // ✅ FIX: Handle 304 for auth check
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Logout user
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

// Default export with all functions
const userService = {
  login,
  register,
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
  downloadResume,
  checkAuth,
  logout
};

export default userService;