import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobCard = ({ job, saved, onSave }) => {
  // Helper function for formatted time since job posted
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
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
  };

  // Helper for job type badge
  const getJobTypeBadgeClass = (jobType) => {
    switch(jobType) {
      case 'Full-time': return 'job-badge-full-time';
      case 'Part-time': return 'job-badge-part-time';
      case 'Contract': return 'job-badge-contract';
      case 'Internship': return 'job-badge-internship';
      case 'Remote': return 'job-badge-remote';
      default: return 'bg-secondary';
    }
  };

  // Create company logo placeholder (first letter of company name)
  const getCompanyInitial = (company) => {
    return company && company.length > 0 ? company.charAt(0).toUpperCase() : 'C';
  };

  // Truncate description for the card
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="card job-card mb-4 h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex">
            <div className="company-logo-placeholder me-3">
              {getCompanyInitial(job.company)}
            </div>
            <div>
              <h5 className="card-title mb-1">{job.title}</h5>
              <h6 className="card-subtitle text-muted">{job.company}</h6>
            </div>
          </div>
          <div className="text-end">
            <span className={`badge ${getJobTypeBadgeClass(job.jobType)}`}>{job.jobType}</span>
            <div className="mt-2">
              <small className="text-muted">{getTimeAgo(job.createdAt)}</small>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-geo-alt me-2 text-primary"></i>
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="d-flex align-items-center">
              <i className="bi bi-currency-dollar me-2 text-primary"></i>
              <span>{job.salary}</span>
            </div>
          )}
        </div>
        
        <p className="card-text mb-3">
          {truncateDescription(job.description)}
        </p>
        
        <div className="d-flex mt-auto pt-3 border-top">
          <Link to={`/jobs/${job._id}`} className="btn btn-primary flex-grow-1">
            View Details
          </Link>
          
          <button 
            className={`btn ms-2 ${saved ? 'btn-tertiary' : 'btn-outline-secondary'}`}
            onClick={() => onSave && onSave(job._id)}
            title={saved ? "Saved" : "Save for later"}
          >
            <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    salary: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string
  }).isRequired,
  saved: PropTypes.bool,
  onSave: PropTypes.func
};

JobCard.defaultProps = {
  saved: false,
  onSave: () => {}
};

export default JobCard;