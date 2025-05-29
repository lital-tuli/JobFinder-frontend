import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import jobService from '../services/jobService';

export const useJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const jobData = await jobService.getJobById(id);
        setJob(jobData);
        
        // Check if user has already applied
        if (isAuthenticated && user && jobData.applicants) {
          const hasApplied = jobData.applicants.includes(user._id);
          setApplicationStatus(hasApplied ? 'applied' : '');
        }
      } catch (err) {
        setError(err.error || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id, isAuthenticated, user]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    setApplicationStatus('loading');
    try {
      await jobService.applyForJob(id);
      setApplicationStatus('applied');
    } catch (err) {
      console.error('Failed to apply:', err);
      setApplicationStatus('error');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    try {
      await jobService.saveJob(id);
      // Handle success (maybe show toast)
    } catch (err) {
      console.error('Failed to save job:', err);
    }
  };

  return {
    job,
    loading,
    error,
    applicationStatus,
    handleApply,
    handleSave
  };
};

export default useJobDetails;