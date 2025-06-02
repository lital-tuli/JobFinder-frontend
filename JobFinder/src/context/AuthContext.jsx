// src/context/AuthContext.jsx - Fixed version without infinite re-renders
import { createContext, useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Use ref for timer to avoid state-based re-renders
  const logoutTimerRef = useRef(null);

  // Check if token is valid and not expired
  const isTokenValid = useCallback((token) => {
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
  }, []);

  // Logout function (define early so it can be used in setupAutoLogout)
  const logout = useCallback(() => {
    userService.logout();
    setIsAuthenticated(false);
    setUser(null);
    
    // Clear auto-logout timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }, []);

  // Set up auto-logout timer
  const setupAutoLogout = useCallback(() => {
    // Clear any existing timer
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    
    // Set new timer
    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, TOKEN_EXPIRATION_TIME);
  }, [logout]);

  // Reset the auto-logout timer on user activity
  const resetLogoutTimer = useCallback(() => {
    if (isAuthenticated) {
      setupAutoLogout();
    }
  }, [isAuthenticated, setupAutoLogout]);

  // Add event listeners for user activity (only once)
  useEffect(() => {
    const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    const handleUserActivity = () => {
      if (isAuthenticated) {
        setupAutoLogout();
      }
    };
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });
    
    // Clean up on unmount
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, []); // Empty dependency array - only run once

  // Separate effect to handle authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      setupAutoLogout();
    } else {
      // Clear timer when user logs out
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    }
  }, [isAuthenticated, setupAutoLogout]);

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
        const { isAuthenticated: authStatus, user: userData } = await userService.checkAuth();
        setIsAuthenticated(authStatus);
        setUser(userData);
        
        // Auto-logout will be set up by the useEffect above when isAuthenticated changes
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
  }, [isTokenValid]); // Only depend on isTokenValid

  // Login function with enhanced error handling
  const login = useCallback(async (email, password, rememberMe = false) => {
    setAuthError(null);
    
    try {
      const data = await userService.login(email, password, rememberMe);
      setIsAuthenticated(true);
      setUser(data.user);
      
      // Auto-logout will be set up by the useEffect when isAuthenticated changes
      return data;
    } catch (error) {
      const errorMessage = error.error || "Login failed. Please check your credentials.";
      setAuthError(errorMessage);
      throw { error: errorMessage };
    }
  }, []);

  // Register function with error handling
  const register = useCallback(async (userData) => {
    setAuthError(null);
    
    try {
      return await userService.register(userData);
    } catch (error) {
      const errorMessage = error.error || "Registration failed. Please try again.";
      setAuthError(errorMessage);
      throw { error: errorMessage };
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (userData) => {
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
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

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