import React, { createContext, useContext, useReducer, useEffect } from 'react';
import userService from '../services/userService';

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// =============================================================================
// ACTION TYPES
// =============================================================================

const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// =============================================================================
// REDUCER
// =============================================================================

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

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const AuthContext = createContext(null);

// =============================================================================
// CONTEXT PROVIDER
// =============================================================================

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // =============================================================================
  // AUTHENTICATION FUNCTIONS
  // =============================================================================

  // Check authentication status on app load
  const checkAuth = async () => {
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
  };

  // Login function
  const login = async (email, password) => {
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
  };

  // Register function
  const register = async (userData) => {
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
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out user');
      await userService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if server logout fails
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Update user function
  const updateUser = async (userData) => {
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
  };

  // Refresh user data
  const refreshUser = async () => {
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
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is recruiter
  const isRecruiter = () => {
    return hasRole('recruiter');
  };

  // Check if user is job seeker
  const isJobSeeker = () => {
    return hasRole('jobSeeker');
  };

  // Check if user can perform action
  const canPerformAction = (action, resource = null) => {
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
  };

  // =============================================================================
  // EFFECTS
  // =============================================================================

  // Check authentication status on mount
  useEffect(() => {
    console.log('AuthContext: Checking authentication on mount');
    checkAuth();
  }, []);

  // Auto-logout after 4 hours of inactivity (bonus feature)
  useEffect(() => {
    if (!state.isAuthenticated) return;

    let inactivityTimer;
    const INACTIVITY_TIME = 4 * 60 * 60 * 1000; // 4 hours

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log('Auto-logout due to inactivity');
        logout();
      }, INACTIVITY_TIME);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Set initial timer
    resetTimer();

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [state.isAuthenticated]);

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const contextValue = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Auth functions
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    refreshUser,
    clearError,

    // Utility functions
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

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// =============================================================================
// EXPORTS
// =============================================================================

export default AuthContext;