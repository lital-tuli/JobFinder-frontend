import { useContext } from 'react';
import JobInteractionContext from '../context/JobInteractionContext';

export const useJobInteractions = () => {
  const context = useContext(JobInteractionContext);
  
  if (!context) {
    // Don't throw error, return empty object with safe defaults
    console.warn('useJobInteractions must be used within JobInteractionProvider');
    return {
      savedJobs: [],
      savedJobIds: [],
      appliedJobs: [],
      loading: false,
      error: '',
      initialized: false,
      toggleSaveJob: async () => {},
      applyToJob: async () => {},
      bulkRemoveSavedJobs: async () => {},
      isJobSaved: () => false,
      hasAppliedToJob: () => false,
      refreshData: () => {},
      clearError: () => {},
      favorites: [],
      isFavorited: () => false,
      toggleFavorite: async () => {},
      addToFavorites: async () => {},
      removeFromFavorites: async () => {},
      hasApplied: () => false,
      setLoading: () => {}
    };
  }
  
  return context;
};

export default useJobInteractions;