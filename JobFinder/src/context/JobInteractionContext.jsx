import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import jobService from '../services/jobService';

const JobInteractionContext = createContext();

export const JobInteractionProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadJobInteractions();
    } else {
      setSavedJobs([]);
      setAppliedJobs([]);
    }
  }, [isAuthenticated, user]);

  const loadJobInteractions = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const [savedResponse, appliedResponse] = await Promise.all([
        userService.getSavedJobs().catch(() => []),
        userService.getAppliedJobs().catch(() => [])
      ]);

      setSavedJobs(Array.isArray(savedResponse) ? savedResponse : []);
      setAppliedJobs(Array.isArray(appliedResponse) ? appliedResponse : []);
    } catch (err) {
      console.error('Failed to load job interactions:', err);
      setError('Failed to load your job preferences');
      setSavedJobs([]);
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to save jobs');
    }

    try {
      const response = await jobService.saveJob(jobId);
      const isCurrentlySaved = savedJobs.some(job => job._id === jobId);

      if (isCurrentlySaved) {
        setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      } else {
        const jobData = await jobService.getJobById(jobId);
        setSavedJobs(prev => [...prev, {
          ...jobData,
          savedAt: new Date().toISOString()
        }]);
      }

      return response;
    } catch (error) {
      console.error('Failed to toggle save job:', error);
      throw error;
    }
  };

  const applyForJob = async (jobId) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to apply for jobs');
    }

    try {
      const response = await jobService.applyForJob(jobId);

      const isAlreadyApplied = appliedJobs.some(job =>
        (job._id === jobId) || (job.job && job.job._id === jobId)
      );

      if (!isAlreadyApplied) {
        const jobData = await jobService.getJobById(jobId);
        setAppliedJobs(prev => [...prev, {
          _id: jobId,
          job: jobData,
          appliedAt: new Date().toISOString(),
          status: 'pending'
        }]);
      }

      return response;
    } catch (error) {
      console.error('Failed to apply for job:', error);
      throw error;
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(job => job._id === jobId);
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.some(job =>
      (job._id === jobId) || (job.job && job.job._id === jobId)
    );
  };

  const savedJobIds = savedJobs.map(job => job._id);
  const appliedJobIds = appliedJobs.map(job =>
    job.job ? job.job._id : job._id
  );

  const value = {
    savedJobs,
    appliedJobs,
    savedJobIds,
    appliedJobIds,
    loading,
    error,
    toggleSaveJob,
    applyForJob,
    isJobSaved,
    isJobApplied,
    refreshData: loadJobInteractions,
    clearError: () => setError(null)
  };

  return (
    <JobInteractionContext.Provider value={value}>
      {children}
    </JobInteractionContext.Provider>
  );
};

export default JobInteractionContext;
