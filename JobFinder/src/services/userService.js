import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const USERS_URL = `${API_BASE_URL}/users`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to handle API errors consistently
const handleApiError = (error) => {
  const errorMessage = 
    error.response?.data?.message || 
    error.response?.data || 
    error.message || 
    'An unexpected error occurred';
  
  console.error("API Error:", errorMessage);
  throw { error: errorMessage };
};


// Login user
export const login = async (email, password, rememberMe = false) => {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const response = await api.post(`${USERS_URL}/login`, { email, password });
    const responseData = response.data;
    
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
    }
    
    return responseData;
  } catch (error) {
    return handleApiError(error);
  }
};
    
// Register user
export const register = async (userData) => {
  try {
    // Set default values if not provided
    const dataWithDefaults = {
      ...userData,
      bio: userData.bio || "No bio provided",
      profession: userData.profession || "Not specified"
    };
    
    const response = await api.post(USERS_URL, dataWithDefaults);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get current user profile
export const getCurrentProfile = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const userId = getUserIdFromToken(token);
    
    const response = await api.get(`${USERS_URL}/${userId}`, {
      headers: {
        "x-auth-token": token
      }
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const userId = getUserIdFromToken(token);
    
    const response = await api.put(`${USERS_URL}/${userId}`, userData, {
      headers: {
        "x-auth-token": token
      }
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Check if user is authenticated
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }
    
    const response = await api.get(`${USERS_URL}/check-auth`, {
      headers: {
        "x-auth-token": token
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Auth check error:", error);
    // Clear invalid tokens
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    return { isAuthenticated: false, user: null };
  }
};

// Get user's saved jobs
export const getSavedJobs = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const userId = getUserIdFromToken(token);
    
    const response = await api.get(`${USERS_URL}/${userId}/saved-jobs`, {
      headers: {
        "x-auth-token": token
      }
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get user's applied jobs
export const getAppliedJobs = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const userId = getUserIdFromToken(token);
    
    const response = await api.get(`${USERS_URL}/${userId}/applied-jobs`, {
      headers: {
        "x-auth-token": token
      }
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

// Helper function to decode JWT token
const getUserIdFromToken = (token) => {
  try {
    // Basic JWT decoding
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload)._id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await api.get('/admin/users', {
      headers: {
        "x-auth-token": token
      }
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId, newRole) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await api.put(`/admin/users/${userId}/role`, 
      { role: newRole },
      {
        headers: {
          "x-auth-token": token
        }
      }
    );
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default {
  login,
  register,
  getCurrentProfile,
  updateProfile,
  checkAuth,
  logout,
  getSavedJobs,
  getAppliedJobs,
  getAllUsers,
  updateUserRole
};

