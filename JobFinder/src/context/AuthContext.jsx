import { createContext, useState, useEffect, useCallback } from 'react';
import * as userService from '../services/userService';

const AuthContext = createContext();

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
      
      console.log('User logged out successfully');
    }
  }, [logoutTimer]);

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
  }, [logout]); // Fixed: only depend on logout, not logoutTimer

  // Reset logout timer (call this on user activity)
  const resetLogoutTimer = useCallback(() => {
    if (isAuthenticated) {
      setupAutoLogout();
    }
  }, [isAuthenticated, setupAutoLogout]);

  // Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    
    try {
      const data = await userService.checkAuth();
      
      if (data.isAuthenticated && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        setupAutoLogout(); // Start auto-logout timer
        console.log('Auth check successful for user:', data.user.email);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        console.log('Auth check failed - user not authenticated');
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

  const login = useCallback(async (email, password, rememberMe = false) => {
    setAuthError(null);
    
    try {
      console.log('Attempting login for user:', email);
      
      // userService.login now throws on error, so we catch it here
      const data = await userService.login({ email, password, rememberMe });
      
      if (!data || !data.token || !data.user || !data.user._id) {
        console.error('Login response validation failed:', {
          hasData: !!data,
          hasToken: !!(data?.token),
          hasUser: !!(data?.user),
          hasUserId: !!(data?.user?._id)
        });
        throw new Error('Invalid response from server - incomplete login data');
      }
      
      if (!data.user.email || !data.user.role) {
        console.error('User data validation failed:', {
          hasEmail: !!data.user.email,
          hasRole: !!data.user.role,
          userId: data.user._id
        });
        throw new Error('Invalid user data received from server');
      }
      
      setIsAuthenticated(true);
      setUser(data.user);
      setupAutoLogout(); // Start auto-logout timer
      
      console.log('Login successful for user:', data.user.email);
      return data;
      
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      
      const errorMessage = error.message || "Login failed. Please check your credentials.";
      setAuthError(errorMessage);
      
      setIsAuthenticated(false);
      setUser(null);
      
      // Re-throw for component to handle
      throw error;
    }
  }, [setupAutoLogout]);

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
  }, []); 

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