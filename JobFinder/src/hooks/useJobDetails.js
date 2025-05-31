// src/pages/jobs/JobDetailsPage/hooks/useJobDetails.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { useJobInteractions } from '../../../../hooks/useJobInteractions';
import jobService from '../../../../services/jobService';

export const useJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { isJobSaved, toggleSaveJob, hasAppliedToJob, applyToJob } = useJobInteractions();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('Job ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const jobData = await jobService.getJobById(id);
        setJob(jobData);
        
        // Check if user has already applied
        if (isAuthenticated && user) {
          const hasApplied = hasAppliedToJob(id);
          setApplicationStatus(hasApplied ? 'applied' : '');
        }
      } catch (err) {
        console.error('Failed to fetch job:', err);
        setError(err.error || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated, user, hasAppliedToJob]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user?.role !== 'jobseeker') {
      setError('Only job seekers can apply for jobs');
      return;
    }
    
    setApplicationStatus('loading');
    try {
      await applyToJob(id);
      setApplicationStatus('applied');
    } catch (err) {
      console.error('Failed to apply:', err);
      setApplicationStatus('error');
      setError(err.message || 'Failed to apply for job');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    try {
      await toggleSaveJob(id);
    } catch (err) {
      console.error('Failed to save job:', err);
      setError(err.message || 'Failed to save job');
    }
  };

  return {
    job,
    loading,
    error,
    applicationStatus,
    isJobSaved: isJobSaved(id),
    handleApply,
    handleSave,
    clearError: () => setError('')
  };
};

export default useJobDetails;