import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import jobService from '../services/jobService';

const JobInteractionContext = createContext();

export const JobInteractionProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const { isAuthenticated, user } = useAuth();

  // Load job interactions when user authenticates
  useEffect(() => {
    if (isAuthenticated && user && !initialized) {
      loadJobInteractions();
    } else if (!isAuthenticated) {
      // Clear data when user logs out
      setSavedJobs([]);
      setAppliedJobs([]);
      setInitialized(false);
      setError(null);
    }
  }, [isAuthenticated, user, initialized]);

  const loadJobInteractions = useCallback(async () => {
    if (!isAuthenticated || loading) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Loading job interactions...');
      
      const [savedResponse, appliedResponse] = await Promise.allSettled([
        userService.getSavedJobs(),
        userService.getAppliedJobs()
      ]);

      // Handle saved jobs response
      if (savedResponse.status === 'fulfilled') {
        const savedData = Array.isArray(savedResponse.value) ? savedResponse.value : [];
        setSavedJobs(savedData);
        console.log('Loaded saved jobs:', savedData.length);
      } else {
        console.error('Failed to load saved jobs:', savedResponse.reason);
        setSavedJobs([]);
      }

      // Handle applied jobs response
      if (appliedResponse.status === 'fulfilled') {
        const appliedData = Array.isArray(appliedResponse.value) ? appliedResponse.value : [];
        setAppliedJobs(appliedData);
        console.log('Loaded applied jobs:', appliedData.length);
      } else {
        console.error('Failed to load applied jobs:', appliedResponse.reason);
        setAppliedJobs([]);
      }

      setInitialized(true);
    } catch (err) {
      console.error('Failed to load job interactions:', err);
      setError('Failed to load your job preferences. Please refresh the page.');
      setSavedJobs([]);
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, loading]);

  const toggleSaveJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to save jobs');
    }

    if (!jobId) {
      throw new Error('Job ID is required');
    }

    try {
      setError(null);
      console.log('Toggling save for job:', jobId);

      // Optimistic update - find if job is currently saved
      const isCurrentlySaved = savedJobs.some(job => job._id === jobId);
      
      // Update UI immediately for better UX
      if (isCurrentlySaved) {
        setSavedJobs(prev => {
          const updated = prev.filter(job => job._id !== jobId);
          console.log('Optimistically removed job, new count:', updated.length);
          return updated;
        });
      } else {
        // For adding, we'll update after getting job details
        console.log('Adding job to saved list...');
      }

      // Make API call
      const response = await jobService.saveJob(jobId);
      console.log('Save job API response:', response);

      // If we were adding a job, fetch its details and add to state
      if (!isCurrentlySaved) {
        try {
          const jobData = await jobService.getJobById(jobId);
          setSavedJobs(prev => {
            // Double-check it's not already in the list (race condition protection)
            const exists = prev.some(job => job._id === jobId);
            if (exists) return prev;
            
            const updated = [...prev, {
              ...jobData,
              savedAt: new Date().toISOString()
            }];
            console.log('Added job to saved list, new count:', updated.length);
            return updated;
          });
        } catch (jobFetchError) {
          console.error('Failed to fetch job details:', jobFetchError);
          // Revert optimistic update
          setSavedJobs(prev => prev.filter(job => job._id !== jobId));
          throw new Error('Failed to save job. Please try again.');
        }
      }

      return response;
    } catch (error) {
      console.error('Failed to toggle save job:', error);
      
      // Revert optimistic update on error
      const isCurrentlySaved = savedJobs.some(job => job._id === jobId);
      if (isCurrentlySaved) {
        // Job was removed optimistically, add it back
        try {
          const jobData = await jobService.getJobById(jobId);
          setSavedJobs(prev => [...prev, jobData]);
        } catch (revertError) {
          console.error('Failed to revert optimistic update:', revertError);
        }
      } else {
        // Job was added optimistically, remove it
        setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      }
      
      setError(error.message || 'Failed to update saved jobs');
      throw error;
    }
  }, [isAuthenticated, savedJobs]);

  const applyForJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to apply for jobs');
    }

    if (!jobId) {
      throw new Error('Job ID is required');
    }

    try {
      setError(null);
      console.log('Applying for job:', jobId);

      // Check if already applied
      const isAlreadyApplied = appliedJobs.some(job =>
        (job._id === jobId) || (job.job && job.job._id === jobId)
      );

      if (isAlreadyApplied) {
        throw new Error('You have already applied for this job');
      }

      // Make API call
      const response = await jobService.applyForJob(jobId);
      console.log('Apply job API response:', response);

      // Update applied jobs list
      try {
        const jobData = await jobService.getJobById(jobId);
        setAppliedJobs(prev => {
          const updated = [...prev, {
            _id: jobId,
            job: jobData,
            appliedAt: new Date().toISOString(),
            status: 'pending'
          }];
          console.log('Added job to applied list, new count:', updated.length);
          return updated;
        });
      } catch (jobFetchError) {
        console.error('Failed to fetch job details after application:', jobFetchError);
        // Still consider the application successful, just update without full job data
        setAppliedJobs(prev => [...prev, {
          _id: jobId,
          appliedAt: new Date().toISOString(),
          status: 'pending'
        }]);
      }

      return response;
    } catch (error) {
      console.error('Failed to apply for job:', error);
      setError(error.message || 'Failed to apply for job');
      throw error;
    }
  }, [isAuthenticated, appliedJobs]);

  const removeSavedJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to manage saved jobs');
    }

    try {
      setError(null);
      console.log('Removing saved job:', jobId);

      // Optimistic update
      setSavedJobs(prev => {
        const updated = prev.filter(job => job._id !== jobId);
        console.log('Removed job from saved list, new count:', updated.length);
        return updated;
      });

      // Make API call
      await jobService.saveJob(jobId); // This should toggle/remove the saved job

    } catch (error) {
      console.error('Failed to remove saved job:', error);
      
      // Revert optimistic update
      await loadJobInteractions();
      
      setError(error.message || 'Failed to remove saved job');
      throw error;
    }
  }, [isAuthenticated, loadJobInteractions]);

  const bulkRemoveSavedJobs = useCallback(async (jobIds) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to manage saved jobs');
    }

    if (!Array.isArray(jobIds) || jobIds.length === 0) {
      throw new Error('No jobs selected for removal');
    }

    try {
      setError(null);
      console.log('Bulk removing saved jobs:', jobIds.length);

      // Optimistic update
      setSavedJobs(prev => {
        const updated = prev.filter(job => !jobIds.includes(job._id));
        console.log('Bulk removed jobs, new count:', updated.length);
        return updated;
      });

      // Make API calls
      const promises = jobIds.map(jobId => jobService.saveJob(jobId));
      await Promise.all(promises);

      console.log('Bulk removal completed successfully');
    } catch (error) {
      console.error('Failed to bulk remove saved jobs:', error);
      
      // Revert optimistic update
      await loadJobInteractions();
      
      setError(error.message || 'Failed to remove selected jobs');
      throw error;
    }
  }, [isAuthenticated, loadJobInteractions]);

  // Helper functions
  const isJobSaved = useCallback((jobId) => {
    return savedJobs.some(job => job._id === jobId);
  }, [savedJobs]);

  const isJobApplied = useCallback((jobId) => {
    return appliedJobs.some(job =>
      (job._id === jobId) || (job.job && job.job._id === jobId)
    );
  }, [appliedJobs]);

  // Computed values
  const savedJobIds = savedJobs.map(job => job._id);
  const appliedJobIds = appliedJobs.map(job =>
    job.job ? job.job._id : job._id
  );

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh data function
  const refreshData = useCallback(async () => {
    if (isAuthenticated) {
      setInitialized(false);
      await loadJobInteractions();
    }
  }, [isAuthenticated, loadJobInteractions]);

  const value = {
    // State
    savedJobs,
    appliedJobs,
    savedJobIds,
    appliedJobIds,
    loading,
    error,
    initialized,
    
    // Actions
    toggleSaveJob,
    applyForJob,
    removeSavedJob,
    bulkRemoveSavedJobs,
    
    // Helpers
    isJobSaved,
    isJobApplied,
    
    // Utility
    refreshData,
    clearError,
    
    // Stats
    savedJobCount: savedJobs.length,
    appliedJobCount: appliedJobs.length
  };

  return (
    <JobInteractionContext.Provider value={value}>
      {children}
    </JobInteractionContext.Provider>
  );
};

export default JobInteractionContext;