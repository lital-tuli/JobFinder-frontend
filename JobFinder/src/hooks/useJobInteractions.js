import { useContext } from 'react';
import { JobInteractionContext } from '../context/JobInteractionContext';

export const useJobInteractions = () => {
  const context = useContext(JobInteractionContext);
  if (!context) {
    throw new Error('useJobInteractions must be used within JobInteractionProvider');
  }
  return context;
};

export default useJobInteractions;