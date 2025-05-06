// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import userService from '../services/userService';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { isAuthenticated, user } = await userService.checkAuth();
        setIsAuthenticated(isAuthenticated);
        setUser(user);
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password, rememberMe) => {
    try {
      const data = await userService.login(email, password, rememberMe);
      setIsAuthenticated(true);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      return await userService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    userService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};