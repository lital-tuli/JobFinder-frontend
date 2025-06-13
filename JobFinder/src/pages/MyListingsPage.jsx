import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import jobService from '../services/jobService';

const MyListingsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Check for success message from post job page
    if (location.state?.success || location.state?.message) {
      setSuccessMessage(location.state.message || 'Operation successful');
      // Clear the state to prevent message from showing again on page refresh
      window.history.replaceState({}, document.title);
    }

    const fetchMyListings = async () => {
      setLoading(true);
      setError('');
      try {
        // ✅ FIXED: Use correct function name
        const data = await jobService.getMyJobListings();
        console.log('My listings data:', data);
        
        // ✅ FIXED: Ensure we have an array
        const jobsArray = Array.isArray(data) ? data : [];
        setJobs(jobsArray);
      } catch (err) {
        console.error('Failed to fetch my job listings:', err);
        setError(err.error || err.message || 'Failed to fetch job listings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [location.state]);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      try {
        await jobService.deleteJob(jobId);
        setJobs(jobs.filter(job => job._id !== jobId));
        setSuccessMessage('Job deleted successfully');
      } catch (err) {
        setError(err.error || 'Failed to delete job');
      }
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get job type badge
  const getJobTypeBadgeClass = (jobType) => {
    switch(jobType) {
      case 'Full-time': return 'bg-primary';
      case 'Part-time': return 'bg-info';
      case 'Contract': return 'bg-warning';
      case 'Internship': return 'bg-secondary';
      case 'Remote': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold">My Job Listings</h1>
          <p className="text-muted">Manage your posted job listings</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Post New Job
        </Link>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your job listings...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <i className="bi bi-briefcase text-muted mb-3" style={{ fontSize: '4rem' }}></i>
              <h3 className="fw-bold mb-3">No Job Listings</h3>
              <p className="text-muted mb-4">You haven't posted any jobs yet.</p>
              <Link to="/post-job" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>Post Your First Job
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div key={job._id} className="col-12 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="flex-grow-1">
                      <h5 className="card-title fw-bold mb-2">
                        <Link 
                          to={`/jobs/${job._id}`} 
                          className="text-decoration-none text-dark"
                        >
                          {job.title}
                        </Link>
                      </h5>
                      <p className="text-muted mb-2">
                        <i className="bi bi-building me-2"></i>
                        {job.company}
                      </p>
                      <p className="text-muted mb-2">
                        <i className="bi bi-geo-alt me-2"></i>
                        {job.location}
                      </p>
                      {job.salary && (
                        <p className="text-muted mb-2">
                          <i className="bi bi-currency-dollar me-2"></i>
                          {job.salary}
                        </p>
                      )}
                    </div>
                    <div className="text-end">
                      <span className={`badge ${getJobTypeBadgeClass(job.jobType)} mb-2`}>
                        {job.jobType}
                      </span>
                      <br />
                      <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  <p className="card-text text-muted small">
                    {job.description && job.description.length > 150 
                      ? job.description.substring(0, 150) + '...' 
                      : job.description}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      <i className="bi bi-calendar me-1"></i>
                      Posted: {formatDate(job.createdAt)}
                      {job.applicants && job.applicants.length > 0 && (
                        <span className="ms-3">
                          <i className="bi bi-people me-1"></i>
                          {job.applicants.length} applicant{job.applicants.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    <div className="btn-group">
                      <Link 
                        to={`/jobs/${job._id}`} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="bi bi-eye me-1"></i>View
                      </Link>
                      <Link 
                        to={`/jobs/${job._id}/edit`} 
                        className="btn btn-outline-secondary btn-sm"
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </Link>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        <i className="bi bi-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;