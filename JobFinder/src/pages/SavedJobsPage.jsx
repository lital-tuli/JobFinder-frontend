// src/pages/SavedJobsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import userService from '../services/userService';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await userService.getSavedJobs();
        setSavedJobs(data);
      } catch (err) {
        setError(err.error || 'Failed to fetch saved jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobId) => {
    try {
      await userService.unsaveJob(jobId);
      // Remove the job from the list
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (err) {
      setError(err.error || 'Failed to unsave job');
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">Saved Jobs</h1>
          <p className="text-muted">Jobs you've saved for later</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your saved jobs...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <i className="bi bi-bookmark mb-3 text-muted" style={{ fontSize: '3rem' }}></i>
          <h3>No Saved Jobs</h3>
          <p className="text-muted mb-4">You haven't saved any jobs yet.</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="row">
          {savedJobs.map(job => (
            <div className="col-md-6 col-lg-4 mb-4" key={job._id}>
              <JobCard 
                job={job} 
                saved={true} 
                onSave={() => handleUnsaveJob(job._id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;