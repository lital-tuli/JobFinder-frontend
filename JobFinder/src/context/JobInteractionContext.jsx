import React, { createContext, useContext, useState, useEffect } from 'react';
import userService from '../services/userService';
import jobService from '../services/jobService';

const JobInteractionContext = createContext();

export const JobInteractionProvider = ({ children }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user's saved jobs and applications on mount
  useEffect(() => {
    loadUserJobData();
  }, []);

  const loadUserJobData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Load both saved jobs and applications in parallel
      const [savedResponse, appliedResponse] = await Promise.all([
        userService.getSavedJobs(),
        userService.getAppliedJobs()
      ]);
      
      setSavedJobs(savedResponse || []);
      setAppliedJobs(appliedResponse || []);
    } catch (error) {
      console.error('Failed to load user job data:', error);
      setSavedJobs([]);
      setAppliedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = async (jobId) => {
    try {
      const response = await jobService.saveJob(jobId);
      
      // Check if job was saved or unsaved
      const isCurrentlySaved = savedJobs.some(job => job._id === jobId);
      
      if (isCurrentlySaved) {
        // Remove from saved jobs
        setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      } else {
        // Add to saved jobs - fetch job details
        try {
          const jobData = await jobService.getJobById(jobId);
          setSavedJobs(prev => [...prev, { ...jobData, savedAt: new Date() }]);
        } catch (fetchError) {
          console.error('Failed to fetch job details:', fetchError);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Failed to toggle save job:', error);
      throw error;
    }
  };

  const applyForJob = async (jobId) => {
    try {
      const response = await jobService.applyForJob(jobId);
      
      // Add to applied jobs if not already there
      if (!appliedJobs.some(job => job._id === jobId)) {
        try {
          const jobData = await jobService.getJobById(jobId);
          setAppliedJobs(prev => [...prev, {
            ...jobData,
            appliedAt: new Date(),
            status: 'pending'
          }]);
        } catch (fetchError) {
          console.error('Failed to fetch job details:', fetchError);
        }
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
    return appliedJobs.some(job => job._id === jobId);
  };

  const value = {
    savedJobs,
    appliedJobs,
    loading,
    toggleSaveJob,
    applyForJob,
    isJobSaved,
    isJobApplied,
    refreshData: loadUserJobData
  };

  return (
    <JobInteractionContext.Provider value={value}>
      {children}
    </JobInteractionContext.Provider>
  );
};

export const useJobInteractions = () => {
  const context = useContext(JobInteractionContext);
  if (!context) {
    throw new Error('useJobInteractions must be used within JobInteractionProvider');
  }
  return context;
};

export default JobInteractionContext;