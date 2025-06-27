import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import userService from '../services/userService';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user },
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading
      };

    default:
      return state;
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkAuth = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });
      
      const result = await userService.checkAuth();
      
      if (result.isAuthenticated) {
        dispatch({ 
          type: AUTH_ACTIONS.AUTH_SUCCESS, 
          payload: { user: result.user }
        });
        console.log('Auth check successful:', result.user);
      } else {
        dispatch({ 
          type: AUTH_ACTIONS.AUTH_FAILURE, 
          payload: { error: 'Not authenticated' }
        });
        console.log('Auth check failed - user not authenticated');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE, 
        payload: { error: error.message }
      });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });
      console.log('Attempting login for user:', email);

      const result = await userService.login(email, password);
      
      if (result.success) {
        dispatch({ 
          type: AUTH_ACTIONS.AUTH_SUCCESS, 
          payload: { user: result.user }
        });
        console.log('Login successful:', result.user);
        return { success: true, user: result.user };
      } else {
        const errorMessage = result.message || 'Login failed';
        dispatch({ 
          type: AUTH_ACTIONS.AUTH_FAILURE, 
          payload: { error: errorMessage }
        });
        console.error('Login failed:', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      console.error('Login error in AuthContext:', error);
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE, 
        payload: { error: errorMessage }
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });
      console.log('Attempting registration for user:', userData.email);

      const result = await userService.register(userData);
      
      if (result.success) {
        dispatch({ 
          type: AUTH_ACTIONS.AUTH_SUCCESS, 
          payload: { user: result.user }
        });
        console.log('Registration successful:', result.user);
        return { success: true, user: result.user };
      } else {
        const errorMessage = result.message || 'Registration failed';
        dispatch({ 
          type: AUTH_ACTIONS.AUTH_FAILURE, 
          payload: { error: errorMessage }
        });
        console.error('Registration failed:', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      console.error('Registration error in AuthContext:', error);
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAILURE, 
        payload: { error: errorMessage }
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('Logging out user');
      await userService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      console.log('Updating user data:', userData);
      
      const result = await userService.updateCurrentProfile(userData);
      
      if (result.success) {
        dispatch({ 
          type: AUTH_ACTIONS.UPDATE_USER, 
          payload: { user: result.user }
        });
        console.log('User updated successfully:', result.user);
        return { success: true, user: result.user };
      } else {
        const errorMessage = result.message || 'Update failed';
        console.error('User update failed:', errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = error.message || 'Update failed';
      console.error('User update error:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { isLoading: true } });
      
      const user = await userService.getCurrentUserProfile();
      dispatch({ 
        type: AUTH_ACTIONS.UPDATE_USER, 
        payload: { user }
      });
      
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { isLoading: false } });
      return user;
    } catch (error) {
      console.error('Refresh user error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { isLoading: false } });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const hasRole = useCallback((role) => {
    return state.user?.role === role;
  }, [state.user?.role]);

  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  const isRecruiter = useCallback(() => {
    return hasRole('recruiter');
  }, [hasRole]);

  const isJobSeeker = useCallback(() => {
    return hasRole('jobSeeker');
  }, [hasRole]);

  const canPerformAction = useCallback((action, resource = null) => {
    if (!state.isAuthenticated) return false;

    switch (action) {
      case 'CREATE_JOB':
      case 'EDIT_JOB':
      case 'DELETE_JOB':
        return isRecruiter() || isAdmin();
      
      case 'APPLY_TO_JOB':
      case 'SAVE_JOB':
        return isJobSeeker() || isAdmin();
      
      case 'MANAGE_USERS':
      case 'DELETE_USER':
        return isAdmin();
      
      case 'EDIT_PROFILE':
        if (resource && resource.userId) {
          return resource.userId === state.user?._id || isAdmin();
        }
        return true;
      
      default:
        return false;
    }
  }, [state.isAuthenticated, state.user?._id, isRecruiter, isAdmin, isJobSeeker]);

  useEffect(() => {
    console.log('AuthContext: Checking authentication on mount');
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!state.isAuthenticated) return;

    let inactivityTimer;
    const INACTIVITY_TIME = 4 * 60 * 60 * 1000;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log('Auto-logout due to inactivity');
        logout();
      }, INACTIVITY_TIME);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    resetTimer();

    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [state.isAuthenticated, logout]);

  const contextValue = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    refreshUser,
    clearError,
    hasRole,
    isAdmin,
    isRecruiter,
    isJobSeeker,
    canPerformAction
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
