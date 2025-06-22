// context/AuthContext.jsx - Fixed Version
import { createContext, useState, useEffect, useCallback } from 'react';
import * as userService from '../services/userService';

const AuthContext = createContext();

// Auto-logout configuration
const TOKEN_EXPIRATION_TIME = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Clear auth error
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Setup auto-logout timer
  const setupAutoLogout = useCallback(() => {
    // Clear existing timer
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      console.log('Auto-logout triggered after 4 hours of inactivity');
      await logout();
    }, TOKEN_EXPIRATION_TIME);

    setLogoutTimer(timer);
  }, [logoutTimer, logout]);

  // Reset logout timer (call this on user activity)
  const resetLogoutTimer = useCallback(() => {
    if (isAuthenticated) {
      setupAutoLogout();
    }
  }, [isAuthenticated, setupAutoLogout]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await userService.logout();
    } catch (error) {
      console.warn('Logout service error:', error.message);
      // Continue with logout even if service fails
    } finally {
      // Clear timer
      if (logoutTimer) {
        clearTimeout(logoutTimer);
        setLogoutTimer(null);
      }
      
      // Clear state
      setIsAuthenticated(false);
      setUser(null);
      setAuthError(null);
    }
  }, [logoutTimer]);

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    
    try {
      const data = await userService.checkAuth();
      
      if (data.isAuthenticated && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        setupAutoLogout(); // Start auto-logout timer
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.warn('Auth check failed:', error.message);
      setIsAuthenticated(false);
      setUser(null);
      
      // Clear invalid tokens
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, [setupAutoLogout]);

  // Login function - FIXED to properly handle errors
  const login = useCallback(async (email, password, rememberMe = false) => {
    setAuthError(null);
    
    try {
      // userService.login now throws on error, so we catch it here
      const data = await userService.login({ email, password, rememberMe });
      
      // Verify we got the expected data
      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }
      
      // Set authenticated state
      setIsAuthenticated(true);
      setUser(data.user);
      setupAutoLogout(); // Start auto-logout timer
      
      console.log('Login successful for user:', data.user.email);
      return data;
      
    } catch (error) {
      // Error is already a proper Error object from userService
      const errorMessage = error.message || "Login failed. Please check your credentials.";
      setAuthError(errorMessage);
      
      // Ensure we're not authenticated on error
      setIsAuthenticated(false);
      setUser(null);
      
      // Re-throw for component to handle
      throw error;
    }
  }, [setupAutoLogout]);

  // Register function - FIXED to properly handle errors
  const register = useCallback(async (userData) => {
    setAuthError(null);
    
    try {
      const result = await userService.register(userData);
      console.log('Registration successful for user:', userData.email);
      return result;
    } catch (error) {
      const errorMessage = error.message || "Registration failed. Please try again.";
      setAuthError(errorMessage);
      throw error;
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (userData) => {
    setAuthError(null);
    
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      resetLogoutTimer(); // Reset timer on activity
      return updatedUser;
    } catch (error) {
      const errorMessage = error.message || "Profile update failed. Please try again.";
      setAuthError(errorMessage);
      throw error;
    }
  }, [resetLogoutTimer]);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
    
    // Cleanup timer on unmount
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [checkAuthStatus, logoutTimer]); // Include dependencies

  // Setup activity listeners for auto-logout reset
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimer = () => {
      resetLogoutTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [isAuthenticated, resetLogoutTimer]);

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
    resetLogoutTimer,
    checkAuthStatus // Export for manual refresh if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;