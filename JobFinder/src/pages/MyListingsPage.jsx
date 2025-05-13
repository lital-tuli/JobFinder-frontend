// src/pages/MyListingsPage.jsx
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
    if (location.state?.success) {
      setSuccessMessage(location.state.message || 'Operation successful');
      // Clear the state to prevent message from showing again on page refresh
      window.history.replaceState({}, document.title);
    }

    const fetchMyListings = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await jobService.getMyListings();
        setJobs(data);
      } catch (err) {
        setError(err.error || 'Failed to fetch job listings');
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
        <div className="text-center py-5 bg-light rounded">
          <i className="bi bi-clipboard mb-3 text-muted" style={{ fontSize: '3rem' }}></i>
          <h3>No Job Listings</h3>
          <p className="text-muted mb-4">You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn btn-primary">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Job Title</th>
                  <th>Posted Date</th>
                  <th>Status</th>
                  <th>Applications</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div>
                        <h6 className="mb-0">{job.title}</h6>
                        <div className="d-flex align-items-center">
                          <small className="text-muted me-2">{job.company}</small>
                          <span className={`badge ${getJobTypeBadgeClass(job.jobType)}`}>
                            {job.jobType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{formatDate(job.createdAt)}</td>
                    <td>
                      <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/job/${job._id}/applications`} className="text-decoration-none">
                        {job.applicants?.length || 0} applications
                      </Link>
                    </td>
                    <td>
                      <div className="btn-group">
                        <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-outline-primary">
                          View
                        </Link>
                        <Link to={`/edit-job/${job._id}`} className="btn btn-sm btn-outline-secondary">
                          Edit
                        </Link>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteJob(job._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;