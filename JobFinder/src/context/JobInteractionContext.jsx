import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const JobInteractionContext = createContext();

// Custom hook to use the context
export const useJobInteractions = () => {
  const context = useContext(JobInteractionContext);
  if (!context) {
    throw new Error('useJobInteractions must be used within a JobInteractionProvider');
  }
  return context;
};

// Provider component
export const JobInteractionProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add to favorites
  const addToFavorites = useCallback((jobId) => {
    setFavorites(prev => {
      if (!prev.includes(jobId)) {
        return [...prev, jobId];
      }
      return prev;
    });
  }, []);

  // Remove from favorites
  const removeFromFavorites = useCallback((jobId) => {
    setFavorites(prev => prev.filter(id => id !== jobId));
  }, []);

  // Check if job is favorited
  const isFavorited = useCallback((jobId) => {
    return favorites.includes(jobId);
  }, [favorites]);

  // Apply to job
  const applyToJob = useCallback((jobId) => {
    setAppliedJobs(prev => {
      if (!prev.includes(jobId)) {
        return [...prev, jobId];
      }
      return prev;
    });
  }, []);

  // Check if applied to job
  const hasApplied = useCallback((jobId) => {
    return appliedJobs.includes(jobId);
  }, [appliedJobs]);

  // Toggle favorite status
  const toggleFavorite = useCallback((jobId) => {
    if (isFavorited(jobId)) {
      removeFromFavorites(jobId);
    } else {
      addToFavorites(jobId);
    }
  }, [isFavorited, removeFromFavorites, addToFavorites]);

  const value = {
    // State
    favorites,
    appliedJobs,
    loading,
    
    // Actions
    addToFavorites,
    removeFromFavorites,
    isFavorited,
    applyToJob,
    hasApplied,
    toggleFavorite,
    setLoading,
  };

  return (
    <JobInteractionContext.Provider value={value}>
      {children}
    </JobInteractionContext.Provider>
  );
};

// Default export for the provider
export default JobInteractionProvider;