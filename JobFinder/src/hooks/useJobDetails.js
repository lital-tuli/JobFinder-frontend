import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useApi } from '../../../hooks/useApi';
import jobService from '../../../services/jobService';

export const useJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState('');
  
  const {
    data: job,
    loading,
    error,
    execute: fetchJob
  } = useApi(jobService.getJobById);

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id, fetchJob]);

  useEffect(() => {
    if (job && isAuthenticated && user && job.applicants) {
      const hasApplied = job.applicants.includes(user._id);
      setApplicationStatus(hasApplied ? 'applied' : '');
    }
  }, [job, isAuthenticated, user]);

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
      setApplicationStatus('');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    try {
      await jobService.saveJob(id);
      // Show success message
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
