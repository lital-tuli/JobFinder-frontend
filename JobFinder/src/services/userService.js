import axios from "axios";

const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:8000/api/v1';
const USERS_URL = `${API_BASE_URL}/users`;

// Login user
export const login = async (email, password, rememberMe = false) => {
  try {
    const data = { email, password };
    const config = {
      method: "post",
      url: `${USERS_URL}/login`,
      headers: { "Content-Type": "application/json" },
      data: data
    };
    
    const response = await axios.request(config);
    const token = response.data.token || response.data;
    
    if (!token) {
      throw new Error("No token received from server.");
    }
    
    // Store token based on remember me option
    if (rememberMe) {
      localStorage.setItem("token", token);
    } else {
      sessionStorage.setItem("token", token);
    }
    
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
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
    
    const config = {
      method: "post",
      url: USERS_URL,
      headers: { "Content-Type": "application/json" },
      data: dataWithDefaults
    };
    
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Get current user profile
export const getCurrentProfile = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userId = getUserIdFromToken(token);
    
    const config = {
      method: "get",
      url: `${USERS_URL}/${userId}`,
      headers: {
        "x-auth-token": token
      }
    };
    
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userId = getUserIdFromToken(token);
    
    const config = {
      method: "put",
      url: `${USERS_URL}/${userId}`,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      data: userData
    };
    
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Check if user is authenticated
export const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }
    
    const config = {
      method: "get",
      url: `${USERS_URL}/check-auth`,
      headers: {
        "x-auth-token": token
      }
    };
    
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Auth check error:", error);
    return { isAuthenticated: false, user: null };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.location.href = '/login';
};

// Helper function to decode JWT token
const getUserIdFromToken = (token) => {
  try {
    // Basic JWT decoding
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded._id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Export default object with all functions
export default {
  login,
  register,
  getCurrentProfile,
  updateProfile,
  checkAuth,
  logout
};