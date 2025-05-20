import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import jobService from '../services/jobService';
import { useAuth } from '../hooks/useAuth';

const JobCard = ({ job, isFavorite: initialIsFavorite, onFavoriteToggle, onSave, saved }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button

    if (!isAuthenticated) {
      alert('Please log in to favorite jobs.');
      return;
    }

    try {
      await jobService.toggleFavoriteJob(job._id);
      setIsFavorite(!isFavorite);
      if (onFavoriteToggle) {
        onFavoriteToggle(job._id, !isFavorite);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (!job || !job._id) {
    return (
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body d-flex align-items-center justify-content-center">
          <p className="text-muted mb-0">Job data unavailable</p>
        </div>
      </div>
    );
  }

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
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          return `${diffMinutes}m ago`;
        }
        return `${diffHours}h ago`;
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Recently';
    }
  };

  const getJobTypeBadgeClass = (jobType) => {
    switch (jobType) {
      case 'Full-time':
        return 'bg-primary';
      case 'Part-time':
        return 'bg-info';
      case 'Contract':
        return 'bg-warning';
      case 'Internship':
        return 'bg-secondary';
      case 'Remote':
        return 'bg-success';
      case 'Hybrid':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 job-card">
      <div className="d-flex justify-content-between mb-3">
        <div className="company-logo bg-light rounded p-3">
          <i className="bi bi-building fs-4 text-primary"></i>
        </div>
        <div>
          <span className={`badge ${getJobTypeBadgeClass(job.jobType)}`}>
            {job.jobType || 'Not specified'}
          </span>
        </div>
      </div>

      <h5 className="card-title">{job.title || 'Job Title Unavailable'}</h5>
      <p className="card-subtitle text-muted mb-3">{job.company || 'Company Name Unavailable'}</p>

      <div className="d-flex align-items-center mb-1">
        <i className="bi bi-geo-alt text-primary me-2"></i>
        <span>{job.location || 'Location not specified'}</span>
      </div>

      {job.salary && (
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-currency-dollar text-primary me-2"></i>
          <span>{job.salary}</span>
        </div>
      )}

      {job.tags && job.tags.length > 0 && (
        <div className="d-flex flex-wrap gap-1 mb-3">
          {job.tags.map((tag, index) => (
            <span key={index} className="badge bg-light text-dark">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-auto">
        <small className="text-muted">{getTimeAgo(job.createdAt)}</small>
        <div className="d-flex gap-2">
          {onSave && (
            <button
              className={`btn btn-sm ${saved ? 'btn-outline-primary active' : 'btn-outline-secondary'}`}
              onClick={() => onSave(job._id)}
              title={saved ? 'Saved' : 'Save for later'}
            >
              <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
            </button>
          )}
          <button
            className={`btn btn-sm ${isFavorite ? 'btn-outline-danger active' : 'btn-outline-secondary'}`}
            onClick={handleFavoriteToggle}
            title={isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>
          <Link to={`/jobs/${job._id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

JobCard.propTypes = {
  job: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    company: PropTypes.string,
    location: PropTypes.string,
    jobType: PropTypes.string,
    salary: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
  }).isRequired,
  isFavorite: PropTypes.bool,
  onFavoriteToggle: PropTypes.func,
  saved: PropTypes.bool,
  onSave: PropTypes.func,
};

JobCard.defaultProps = {
  isFavorite: false,
  onFavoriteToggle: null,
  saved: false,
  onSave: null,
};

export default JobCard;