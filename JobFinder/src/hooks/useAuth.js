import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Custom hook to use the Auth context
 * @returns {Object} Auth context value with user data and auth functions
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// ✅ Export as both named and default for flexibility
export default useAuth;