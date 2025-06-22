import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;