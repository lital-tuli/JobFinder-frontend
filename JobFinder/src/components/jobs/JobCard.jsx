import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';

const JobCard = ({ job, saved = false, onSave }) => {
  const { isAuthenticated } = useAuth();
  const [saving, setSaving] = useState(false);

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
        if (diffHours === 0) return 'Just now';
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

  const getJobTypeBadgeClass = (jobType) => {
    switch (jobType) {
      case 'Full-time': return 'bg-primary';
      case 'Part-time': return 'bg-info';
      case 'Contract': return 'bg-warning text-dark';
      case 'Internship': return 'bg-secondary';
      case 'Remote': return 'bg-success';
      case 'Hybrid': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert('Please login to save jobs');
      return;
    }

    setSaving(true);
    try {
      if (onSave) {
        await onSave(job._id);
      }
    } catch (error) {
      console.error('Save operation failed:', error);
      alert('Failed to save job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const generateCompanyLogo = (companyName) => {
    if (!companyName) return { initials: 'CO', color: 'secondary' };
    const colors = ['primary', 'success', 'info', 'warning', 'danger', 'dark'];
    const colorIndex = companyName.length % colors.length;
    return {
      initials: companyName.substring(0, 2).toUpperCase(),
      color: colors[colorIndex]
    };
  };

  const companyLogo = generateCompanyLogo(job.company);

  return (
    <div className="card h-100 shadow-sm border-0 job-card position-relative">
      <div className="job-card-accent"></div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`company-logo bg-${companyLogo.color} bg-gradient text-white rounded d-flex align-items-center justify-content-center`} 
               style={{ width: '48px', height: '48px', fontSize: '1.1rem', fontWeight: '600' }}>
            {companyLogo.initials}
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className={`badge ${getJobTypeBadgeClass(job.jobType)} px-2 py-1`}>
              {job.jobType || 'Not specified'}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <h5 className="card-title mb-1 fw-bold">{job.title || 'Job Title Unavailable'}</h5>
          <p className="card-subtitle text-muted mb-0">{job.company || 'Company Name Unavailable'}</p>
        </div>

        <div className="job-details mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-geo-alt-fill text-primary me-2"></i>
            <span className="small">{job.location || 'Location not specified'}</span>
          </div>

          {job.salary && (
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-currency-dollar text-success me-2"></i>
              <span className="small text-success fw-medium">{job.salary}</span>
            </div>
          )}

          <div className="job-description-preview">
            <p className="small text-muted mb-0" style={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {job.description || 'No description available'}
            </p>
          </div>
        </div>

        {job.tags && job.tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {job.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="badge bg-light text-dark small">{tag}</span>
            ))}
            {job.tags.length > 3 && (
              <span className="badge bg-light text-muted small">+{job.tags.length - 3} more</span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <i className="bi bi-clock text-muted me-1"></i>
              <small className="text-muted">{getTimeAgo(job.createdAt)}</small>
            </div>

            <div className="d-flex gap-2">
              {onSave && (
                <button 
                  className={`btn btn-sm ${saved ? 'btn-warning' : 'btn-outline-secondary'} save-btn`}
                  onClick={handleSave}
                  disabled={saving}
                  title={saved ? "Remove from saved" : "Save for later"}
                >
                  {saving ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                  )}
                </button>
              )}

              <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm px-3">
                View Details
                <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </div>
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
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
  }).isRequired,
  saved: PropTypes.bool,
  onSave: PropTypes.func,
};

export default JobCard;