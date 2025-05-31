
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import jobService from '../../../services/jobService';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) {
        setError('Job ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const jobData = await jobService.getJobById(id);
        setJob(jobData);
      } catch (err) {
        setError(err.error || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }

    if (user?.role !== 'jobseeker') {
      setError('Only job seekers can apply for jobs');
      return;
    }
    
    setApplying(true);
    setError('');
    
    try {
      await jobService.applyForJob(id);
      setSuccessMessage('Application submitted successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.error || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      await jobService.saveJob(id);
      setSuccessMessage('Job saved successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.error || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getJobTypeBadgeClass = (jobType) => {
    switch(jobType) {
      case 'Full-time': return 'bg-primary';
      case 'Part-time': return 'bg-info';
      case 'Contract': return 'bg-warning text-dark';
      case 'Internship': return 'bg-secondary';
      case 'Remote': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center">
              <h4>Error Loading Job</h4>
              <p className="mb-3">{error}</p>
              <Link to="/jobs" className="btn btn-primary">
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4>Job Not Found</h4>
              <p className="mb-3">The job you're looking for doesn't exist or has been removed.</p>
              <Link to="/jobs" className="btn btn-primary">
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/jobs" className="text-decoration-none">Jobs</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {job.title}
          </li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-8">
          {/* Job Header */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center">
                  <div className="company-logo bg-primary text-white rounded p-3 me-3">
                    <i className="bi bi-building fs-4"></i>
                  </div>
                  <div>
                    <h1 className="h3 mb-1">{job.title}</h1>
                    <p className="text-muted mb-0">{job.company}</p>
                  </div>
                </div>
                <span className={`badge ${getJobTypeBadgeClass(job.jobType)} px-3 py-2`}>
                  {job.jobType}
                </span>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-geo-alt text-primary me-2"></i>
                    <span>{job.location}</span>
                  </div>
                  {job.salary && (
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-currency-dollar text-success me-2"></i>
                      <span className="text-success fw-medium">{job.salary}</span>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-calendar text-muted me-2"></i>
                    <span>Posted on {formatDate(job.createdAt)}</span>
                  </div>
                  {job.contactEmail && (
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-envelope text-muted me-2"></i>
                      <span>{job.contactEmail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Job Description</h4>
              <div className="job-description">
                {job.description ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {job.description}
                  </div>
                ) : (
                  <p className="text-muted">No description available</p>
                )}
              </div>
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-3">Requirements</h4>
                <div className="job-requirements">
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {job.requirements}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Company Information */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">About {job.company}</h4>
              <div className="d-flex align-items-center">
                <div className="company-logo bg-primary text-white rounded p-3 me-3">
                  <i className="bi bi-building fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-1">{job.company}</h5>
                  <p className="text-muted mb-0">
                    Learn more about this company and other opportunities they offer.
                  </p>
                </div>
              </div>
              {job.contactEmail && (
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="bi bi-envelope me-2"></i>
                    Contact: {job.contactEmail}
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Messages */}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle me-2"></i>
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
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Action Card */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4 text-center">
              <h5 className="fw-bold mb-3">Interested in this position?</h5>
              
              {isAuthenticated && user?.role === 'jobseeker' ? (
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleApply}
                    disabled={applying}
                  >
                    {applying ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Applying...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Apply Now
                      </>
                    )}
                  </button>
                  
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-bookmark me-2"></i>
                        Save Job
                      </>
                    )}
                  </button>
                </div>
              ) : !isAuthenticated ? (
                <div>
                  <p className="text-muted mb-3">Login to apply for this job</p>
                  <div className="d-grid gap-2">
                    <Link to="/login" className="btn btn-primary" state={{ from: `/jobs/${id}` }}>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login to Apply
                    </Link>
                    <Link to="/register" className="btn btn-outline-primary">
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-muted mb-3">
                    This feature is available for job seekers only
                  </p>
                  <Link to="/jobs" className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Jobs
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Job Summary */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Job Summary</h5>
              <div className="job-summary">
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Job Type:</span>
                    <span className="fw-medium">{job.jobType}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Location:</span>
                    <span className="fw-medium">{job.location}</span>
                  </div>
                </div>
                {job.salary && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Salary:</span>
                      <span className="fw-medium text-success">{job.salary}</span>
                    </div>
                  </div>
                )}
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Posted:</span>
                    <span className="fw-medium">{formatDate(job.createdAt)}</span>
                  </div>
                </div>
                <div className="mb-0">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Company:</span>
                    <span className="fw-medium">{job.company}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Share Job */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <h6 className="fw-bold mb-3">Share this job</h6>
              <div className="d-flex justify-content-center gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${job.title} at ${job.company}`,
                        text: `Check out this job opportunity: ${job.title} at ${job.company}`,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      setSuccessMessage('Job link copied to clipboard!');
                    }
                  }}
                  title="Share this job"
                >
                  <i className="bi bi-share"></i>
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setSuccessMessage('Job link copied to clipboard!');
                  }}
                  title="Copy link"
                >
                  <i className="bi bi-link-45deg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Jobs Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="text-center">
            <h4 className="fw-bold mb-4">Find More Opportunities</h4>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/jobs" className="btn btn-primary">
                <i className="bi bi-search me-2"></i>
                Browse All Jobs
              </Link>
              <Link to={`/jobs?company=${encodeURIComponent(job.company)}`} className="btn btn-outline-primary">
                <i className="bi bi-building me-2"></i>
                More Jobs at {job.company}
              </Link>
              <Link to={`/jobs?jobType=${encodeURIComponent(job.jobType)}`} className="btn btn-outline-secondary">
                <i className="bi bi-briefcase me-2"></i>
                More {job.jobType} Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;