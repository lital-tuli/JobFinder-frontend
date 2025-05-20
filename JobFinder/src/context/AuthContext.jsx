// src/context/AuthContext.jsx - Updated with token validation and auto-logout
import { createContext, useState, useEffect } from 'react';
import userService from '../services/userService';

// Create auth context
const AuthContext = createContext();

// Token expiration (4 hours in milliseconds)
const TOKEN_EXPIRATION_TIME = 4 * 60 * 60 * 1000;

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Auto-logout timer
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Check if token is valid and not expired
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      // Basic JWT decoding to check expiration
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Error validating token:', e);
      return false;
    }
  };

  // Set up auto-logout timer
  const setupAutoLogout = () => {
    // Clear any existing timer
    if (logoutTimer) clearTimeout(logoutTimer);
    
    // Set new timer
    const timer = setTimeout(() => {
      logout();
    }, TOKEN_EXPIRATION_TIME);
    
    setLogoutTimer(timer);
  };

  // Reset the auto-logout timer on user activity
  const resetLogoutTimer = () => {
    if (isAuthenticated) {
      setupAutoLogout();
    }
  };

  // Add event listeners for user activity
  useEffect(() => {
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      resetLogoutTimer();
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Clean up
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
      
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [isAuthenticated, logoutTimer]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      setAuthError(null);
      
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        
        // If token exists but is invalid, clear it
        if (token && !isTokenValid(token)) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }
        
        // If no token, user is not authenticated
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Check authentication with the server
        const { isAuthenticated, user } = await userService.checkAuth();
        setIsAuthenticated(isAuthenticated);
        setUser(user);
        
        // Set up auto-logout if authenticated
        if (isAuthenticated) {
          setupAutoLogout();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthError("Authentication failed. Please try again.");
        
        // Clear invalid tokens
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function with enhanced error handling
  const login = async (email, password, rememberMe = false) => {
    setAuthError(null);
    
    try {
      const data = await userService.login(email, password, rememberMe);
      setIsAuthenticated(true);
      setUser(data.user);
      
      // Set up auto-logout
      setupAutoLogout();
      
      return data;
    } catch (error) {
      const errorMessage = error.error || "Login failed. Please check your credentials.";
      setAuthError(errorMessage);
      throw { error: errorMessage };
    }
  };

  // Register function with error handling
  const register = async (userData) => {
    setAuthError(null);
    
    try {
      return await userService.register(userData);
    } catch (error) {
      const errorMessage = error.error || "Registration failed. Please try again.";
      setAuthError(errorMessage);
      throw { error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    userService.logout();
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear auto-logout timer
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      setLogoutTimer(null);
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    setAuthError(null);
    
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      const errorMessage = error.error || "Profile update failed. Please try again.";
      setAuthError(errorMessage);
      throw { error: errorMessage };
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    authError,
    login,
    register,
    logout,
    updateProfile,
    clearAuthError,
    resetLogoutTimer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;