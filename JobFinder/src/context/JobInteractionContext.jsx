import { createContext, useState, useEffect, useCallback } from 'react';
import jobService from '../services/jobService';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';

// Create the context
const JobInteractionContext = createContext();

// Provider component
export const JobInteractionProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !initialized) {
      fetchUserData();
    } else if (!isAuthenticated) {
      setSavedJobs([]);
      setSavedJobIds([]);
      setAppliedJobs([]);
      setInitialized(false);
      setError('');
    }
  }, [isAuthenticated, user, initialized]);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    setError('');

    try {
      // ✅ FIX: Use getCurrentUser functions instead of functions that require userId
      const [savedJobsData, appliedJobsData] = await Promise.allSettled([
        userService.getCurrentUserSavedJobs(),    // ✅ No userId required
        userService.getCurrentUserAppliedJobs()   // ✅ No userId required
      ]);

      if (savedJobsData.status === 'fulfilled') {
        const jobs = Array.isArray(savedJobsData.value) ? savedJobsData.value : [];
        setSavedJobs(jobs);
        setSavedJobIds(jobs.map(job => job._id));
      } else {
        console.warn('Failed to fetch saved jobs:', savedJobsData.reason);
        setError('Failed to fetch saved jobs: ' + savedJobsData.reason?.error || savedJobsData.reason?.message || 'Unknown error');
      }

      if (appliedJobsData.status === 'fulfilled') {
        const jobs = Array.isArray(appliedJobsData.value) ? appliedJobsData.value : [];
        setAppliedJobs(jobs);
      } else {
        console.warn('Failed to fetch applied jobs:', appliedJobsData.reason);
        setError('Failed to fetch applied jobs: ' + appliedJobsData.reason?.error || appliedJobsData.reason?.message || 'Unknown error');
      }

      setInitialized(true);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data: ' + (err.error || err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

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

  const toggleSaveJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to save jobs');
    }

    try {
      await jobService.saveJob(jobId);
      setSavedJobIds(prev => {
        if (prev.includes(jobId)) {
          setSavedJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
          return prev.filter(id => id !== jobId);
        } else {
          fetchJobDetails(jobId);
          return [...prev, jobId];
        }
      });
    } catch (err) {
      console.error('Error toggling save job:', err);
      throw new Error(err.error || 'Failed to save job');
    }
  }, [isAuthenticated, fetchJobDetails]);

  const applyToJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to apply for jobs');
    }

    try {
      await jobService.applyForJob(jobId);
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

  const bulkRemoveSavedJobs = useCallback(async (jobIds) => {
    if (!isAuthenticated || !Array.isArray(jobIds) || jobIds.length === 0) {
      return;
    }

    try {
      for (const jobId of jobIds) {
        await jobService.saveJob(jobId); // toggles save/unsave
      }
      setSavedJobs(prev => prev.filter(job => !jobIds.includes(job._id)));
      setSavedJobIds(prev => prev.filter(id => !jobIds.includes(id)));
    } catch (err) {
      console.error('Error bulk removing saved jobs:', err);
      throw new Error(err.error || 'Failed to remove jobs');
    }
  }, [isAuthenticated]);

  // Check if a job is saved
  const isJobSaved = useCallback((jobId) => {
    return savedJobIds.includes(jobId);
  }, [savedJobIds]);

  // Check if a job is applied to
  const isJobAppliedTo = useCallback((jobId) => {
    return appliedJobs.some(job => job._id === jobId);
  }, [appliedJobs]);

  const value = {
    savedJobs,
    savedJobIds,
    appliedJobs,
    loading,
    error,
    initialized,
    toggleSaveJob,
    applyToJob,
    isJobSaved,
    isJobAppliedTo,
    bulkRemoveSavedJobs,
    refetch: fetchUserData  // Allow manual refetch
  };

  return (
    <JobInteractionContext.Provider value={value}>
      {children}
    </JobInteractionContext.Provider>
  );
};

export default JobInteractionContext;