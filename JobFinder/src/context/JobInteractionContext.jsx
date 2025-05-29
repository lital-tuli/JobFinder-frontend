import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import jobService from '../services/jobService';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';

// Create the context
const JobInteractionContext = createContext();

// Export the context for use in hooks
export { JobInteractionContext };

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
  const { isAuthenticated, user } = useAuth();
  
  // State
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  // Initialize data when user logs in
  useEffect(() => {
    if (isAuthenticated && user && !initialized) {
      fetchUserData();
    } else if (!isAuthenticated) {
      // Clear data when user logs out
      setSavedJobs([]);
      setSavedJobIds([]);
      setAppliedJobs([]);
      setInitialized(false);
      setError('');
    }
  }, [isAuthenticated, user, initialized]);

  // Fetch user's saved jobs and applied jobs
  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    setError('');

    try {
      const [savedJobsData, appliedJobsData] = await Promise.allSettled([
        userService.getSavedJobs(),
        userService.getAppliedJobs()
      ]);

      // Handle saved jobs
      if (savedJobsData.status === 'fulfilled') {
        const jobs = Array.isArray(savedJobsData.value) ? savedJobsData.value : [];
        setSavedJobs(jobs);
        setSavedJobIds(jobs.map(job => job._id));
      } else {
        console.warn('Failed to fetch saved jobs:', savedJobsData.reason);
      }

      // Handle applied jobs
      if (appliedJobsData.status === 'fulfilled') {
        const jobs = Array.isArray(appliedJobsData.value) ? appliedJobsData.value : [];
        setAppliedJobs(jobs);
      } else {
        console.warn('Failed to fetch applied jobs:', appliedJobsData.reason);
      }

      setInitialized(true);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Save/unsave job
  const toggleSaveJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to save jobs');
    }

    try {
      await jobService.saveJob(jobId);
      
      // Update local state
      setSavedJobIds(prev => {
        if (prev.includes(jobId)) {
          // Remove from saved
          setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
          return prev.filter(id => id !== jobId);
        } else {
          // Add to saved - we'll need to fetch the job details
          fetchJobDetails(jobId);
          return [...prev, jobId];
        }
      });

    } catch (err) {
      console.error('Error toggling save job:', err);
      throw new Error(err.error || 'Failed to save job');
    }
  }, [isAuthenticated]);

  // Fetch job details and add to saved jobs
  const fetchJobDetails = useCallback(async (jobId) => {
    try {
      const jobDetails = await jobService.getJobById(jobId);
      setSavedJobs(prev => {
        if (!prev.find(job => job._id === jobId)) {
          return [...prev, jobDetails];
        }
        return prev;
      });
    } catch (err) {
      console.error('Error fetching job details:', err);
    }
  }, []);

  // Apply to job
  const applyToJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to apply for jobs');
    }

    try {
      await jobService.applyForJob(jobId);
      
      // Fetch job details and add to applied jobs
      const jobDetails = await jobService.getJobById(jobId);
      setAppliedJobs(prev => {
        if (!prev.find(job => job._id === jobId)) {
          return [...prev, jobDetails];
        }
        return prev;
      });

    } catch (err) {
      console.error('Error applying to job:', err);
      throw new Error(err.error || 'Failed to apply for job');
    }
  }, [isAuthenticated]);

  // Bulk remove saved jobs
  const bulkRemoveSavedJobs = useCallback(async (jobIds) => {
    if (!isAuthenticated || !Array.isArray(jobIds) || jobIds.length === 0) {
      return;
    }

    try {
      // Remove jobs one by one (you might want to implement a bulk API endpoint)
      for (const jobId of jobIds) {
        await jobService.saveJob(jobId); // This toggles, so it will unsave
      }

      // Update local state
      setSavedJobs(prev => prev.filter(job => !jobIds.includes(job._id)));
      setSavedJobIds(prev => prev.filter(id => !jobIds.includes(id)));

    } catch (err) {
      console.error('Error bulk removing saved jobs:', err);
      throw new Error('Failed to remove selected jobs');
    }
  }, [isAuthenticated]);

  // Check if job is saved
  const isJobSaved = useCallback((jobId) => {
    return savedJobIds.includes(jobId);
  }, [savedJobIds]);

  // Check if applied to job
  const hasAppliedToJob = useCallback((jobId) => {
    return appliedJobs.some(job => job._id === jobId);
  }, [appliedJobs]);

  // Refresh data
  const refreshData = useCallback(() => {
    if (isAuthenticated && user) {
      setInitialized(false);
      fetchUserData();
    }
  }, [isAuthenticated, user, fetchUserData]);

  // Clear error
  const clearError = useCallback(() => {
    setError('');
  }, []);

  // Context value
  const value = {
    // State
    savedJobs,
    savedJobIds,
    appliedJobs,
    loading,
    error,
    initialized,
    
    // Actions
    toggleSaveJob,
    applyToJob,
    bulkRemoveSavedJobs,
    isJobSaved,
    hasAppliedToJob,
    refreshData,
    clearError,
    
    // Legacy aliases for backward compatibility
    favorites: savedJobs,
    isFavorited: isJobSaved,
    toggleFavorite: toggleSaveJob,
    addToFavorites: (jobId) => !isJobSaved(jobId) && toggleSaveJob(jobId),
    removeFromFavorites: (jobId) => isJobSaved(jobId) && toggleSaveJob(jobId),
    hasApplied: hasAppliedToJob,
    setLoading
  };

  return (
    <JobInteractionContext.Provider value={value}>
      {children}
    </JobInteractionContext.Provider>
  );
};

// Default export
export default JobInteractionProvider;