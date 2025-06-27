import { createContext, useReducer, useEffect, useCallback, useMemo } from 'react';
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

// ✅ Create the context (this is not a component, so it's fine to export)
const AuthContext = createContext(null);

// ✅ This is the only component in this file
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ✅ FIXED: checkAuth with no dependencies to prevent infinite loops
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
  }, []); // ✅ Empty dependencies - this function doesn't need to be recreated

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
      
      const result = await userService.updateCurrentUserProfile(userData);
      
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

  // ✅ FIXED: Use useMemo instead of useCallback for role checking functions
  // These are derived values that only depend on state, not functions
  const roleCheckers = useMemo(() => {
    const hasRole = (role) => state.user?.role === role;
    const isAdmin = () => hasRole('admin');
    const isRecruiter = () => hasRole('recruiter');
    const isJobSeeker = () => hasRole('jobSeeker');

    return { hasRole, isAdmin, isRecruiter, isJobSeeker };
  }, [state.user?.role]);

  // ✅ FIXED: Simplified canPerformAction with direct role checking
  const canPerformAction = useCallback((action, resource = null) => {
    if (!state.isAuthenticated) return false;

    const { isAdmin, isRecruiter, isJobSeeker } = roleCheckers;

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
  }, [state.isAuthenticated, state.user?._id, roleCheckers]);

  // ✅ FIXED: Only run checkAuth once on mount, not on every checkAuth change
  useEffect(() => {
    console.log('AuthContext: Checking authentication on mount');
    checkAuth();
  }, [checkAuth]); // ✅ Include checkAuth dependency

  // ✅ Auto-logout functionality (unchanged)
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

  // ✅ FIXED: Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
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
    hasRole: roleCheckers.hasRole,
    isAdmin: roleCheckers.isAdmin,
    isRecruiter: roleCheckers.isRecruiter,
    isJobSeeker: roleCheckers.isJobSeeker,
    canPerformAction
  }), [
    state.user,
    state.isAuthenticated,
    state.isLoading,
    state.error,
    login,
    register,
    logout,
    checkAuth,
    updateUser,
    refreshUser,
    clearError,
    roleCheckers.hasRole,
    roleCheckers.isAdmin,
    roleCheckers.isRecruiter,
    roleCheckers.isJobSeeker,
    canPerformAction
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;