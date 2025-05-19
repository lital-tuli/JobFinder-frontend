import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobTable = ({ jobs, onSave, savedJobs = [] }) => {
  // Helper function for formatted time since job posted
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
          return 'Just now';
        }
        return `${diffHours}h ago`;
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Recently';
    }
  };

  // Helper for job type badge
  const getJobTypeBadgeClass = (jobType) => {
    switch(jobType) {
      case 'Full-time': return 'bg-primary';
      case 'Part-time': return 'bg-info';
      case 'Contract': return 'bg-warning';
      case 'Internship': return 'bg-secondary';
      case 'Remote': return 'bg-success';
      case 'Hybrid': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-briefcase mb-3 text-muted" style={{ fontSize: '3rem' }}></i>
        <h3>No Jobs Found</h3>
        <p className="text-muted">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Location</th>
              <th>Type</th>
              <th>Salary</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const isSaved = savedJobs.includes(job._id);
              return (
                <tr key={job._id}>
                  <td>
                    <div>
                      <h6 className="mb-0">{job.title || 'Job Title Unavailable'}</h6>
                      <small className="text-muted">
                        {job.description ? 
                          `${job.description.substring(0, 60)}...` : 
                          'No description available'
                        }
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="company-logo bg-light rounded p-2 me-2">
                        <i className="bi bi-building fs-6 text-primary"></i>
                      </div>
                      <span>{job.company || 'Company Name Unavailable'}</span>
                    </div>
                  </td>
                  <td>
                    <i className="bi bi-geo-alt text-primary me-1"></i>
                    {job.location || 'Location not specified'}
                  </td>
                  <td>
                    <span className={`badge ${getJobTypeBadgeClass(job.jobType)}`}>
                      {job.jobType || 'Not specified'}
                    </span>
                  </td>
                  <td>
                    {job.salary ? (
                      <span className="text-success fw-medium">{job.salary}</span>
                    ) : (
                      <span className="text-muted">Not specified</span>
                    )}
                  </td>
                  <td>
                    <small className="text-muted">{getTimeAgo(job.createdAt)}</small>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      {onSave && (
                        <button 
                          className={`btn btn-sm ${isSaved ? 'btn-warning' : 'btn-outline-secondary'}`}
                          onClick={() => onSave(job._id)}
                          title={isSaved ? "Remove from saved" : "Save for later"}
                        >
                          <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                        </button>
                      )}
                      <Link 
                        to={`/jobs/${job._id}`} 
                        className="btn btn-sm btn-primary"
                        title="View job details"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

JobTable.propTypes = {
  jobs: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    company: PropTypes.string,
    location: PropTypes.string,
    jobType: PropTypes.string,
    salary: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
  })).isRequired,
  onSave: PropTypes.func,
  savedJobs: PropTypes.arrayOf(PropTypes.string)
};

export default JobTable;