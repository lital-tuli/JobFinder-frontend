import { useState, useEffect, createContext, useContext } from 'react';
import api from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const checkAuth = async () => {
          try {
              const token = localStorage.getItem('token');
              if (!token) {
                  setLoading(false);
                  return;
              }
              const response = await api.get('/users/check-auth');
              setIsAuthenticated(response.data.isAuthenticated);
              setUser(response.data.user);
          } catch (error) {
              console.error("Authentication check failed:", error);
              localStorage.removeItem('token'); // Remove invalid token
              setIsAuthenticated(false);
              setUser(null);
          } finally {
              setLoading(false);
          }
      };

      checkAuth();
  }, []); // Added empty dependency array
  const login = async (email, password) => {
      try {
          const data = await api.login(email, password); // Assuming you have a login function in api.js
          localStorage.setItem('token', data.token);
          setIsAuthenticated(true);
          setUser(data.user);
          return true; // Indicate success
      } catch (error) {
          console.error("Login error:", error);
          throw error; // Re-throw to handle in the component
      }
  };

  const logout = () => {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
  };

  const register = async (userData) => {
      return await api.register(userData);
  };



  const value = {
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      register
  };

  return (
      <AuthContext.Provider value={value}>
          {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
    return useContext(AuthContext);
}