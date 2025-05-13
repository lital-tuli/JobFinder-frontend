// src/pages/AppliedJobsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';

const AppliedJobsPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await userService.getAppliedJobs();
        setAppliedJobs(data);
      } catch (err) {
        setError(err.error || 'Failed to fetch applied jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-warning';
      case 'Reviewed':
        return 'bg-info';
      case 'Interview':
        return 'bg-primary';
      case 'Accepted':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">My Applications</h1>
          <p className="text-muted">Track the status of your job applications</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your applications...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : appliedJobs.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <i className="bi bi-briefcase mb-3 text-muted" style={{ fontSize: '3rem' }}></i>
          <h3>No Applications Yet</h3>
          <p className="text-muted mb-4">You haven't applied to any jobs yet.</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appliedJobs.map((application) => (
                  <tr key={application._id}>
                    <td>
                      <Link to={`/jobs/${application.job._id}`} className="text-decoration-none">
                        {application.job.title}
                      </Link>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="company-logo bg-light rounded p-2 me-2">
                          <i className="bi bi-building fs-5 text-primary"></i>
                        </div>
                        <span>{application.job.company}</span>
                      </div>
                    </td>
                    <td>{formatDate(application.appliedAt || application.createdAt)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(application.status)}`}>
                        {application.status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <Link to={`/jobs/${application.job._id}`} className="btn btn-sm btn-outline-primary">
                          View Job
                        </Link>
                        {application.status === 'Interview' && (
                          <a href="#" className="btn btn-sm btn-outline-success">
                            Prepare
                          </a>
                        )}
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

export default AppliedJobsPage;