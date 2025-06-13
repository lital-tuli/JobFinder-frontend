import React, { useState, useEffect } from 'react';

const JobApplicantsList = ({ jobId, onClose }) => {
  const [applicants, setApplicants] = useState([]);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`/api/jobs/${jobId}/applicants`, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applicants');
      }

      const data = await response.json();
      setJobInfo(data.job);
      setApplicants(data.applicants || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async (applicantId, applicantName) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch(`/api/users/${applicantId}/resume/download`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${applicantName.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download resume: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading applicants...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header border-bottom">
            <div>
              <h5 className="modal-title mb-1">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Job Applicants
              </h5>
              {jobInfo && (
                <p className="text-muted mb-0">
                  <strong>{jobInfo.title}</strong> at {jobInfo.company}
                  <span className="badge bg-primary ms-2">
                    {jobInfo.totalApplicants} Total Applicants
                  </span>
                </p>
              )}
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body" style={{maxHeight: '70vh', overflowY: 'auto'}}>
            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            {applicants.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox display-1 text-muted"></i>
                <h5 className="text-muted mt-3">No Applications Yet</h5>
                <p className="text-muted">
                  No one has applied for this position yet. Share your job posting to attract more candidates!
                </p>
              </div>
            ) : (
              <div className="row">
                {applicants.map((applicant, index) => (
                  <div key={applicant._id} className="col-12 mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="row align-items-center">
                          {/* Profile Picture */}
                          <div className="col-md-2 text-center">
                            <img 
                              src={applicant.profilePicture ? 
                                `/uploads/${applicant.profilePicture}` : 
                                '/api/placeholder/80/80'
                              }
                              alt={`${applicant.name.first} ${applicant.name.last}`}
                              className="rounded-circle border"
                              style={{ 
                                width: '80px', 
                                height: '80px', 
                                objectFit: 'cover' 
                              }}
                              onError={(e) => {
                                e.target.src = '/api/placeholder/80/80';
                              }}
                            />
                          </div>

                          {/* Applicant Info */}
                          <div className="col-md-6">
                            <h6 className="card-title mb-1">
                              {applicant.name.first} {applicant.name.last}
                            </h6>
                            <p className="text-primary mb-1">
                              <i className="bi bi-briefcase me-1"></i>
                              {applicant.profession || 'Professional'}
                            </p>
                            <p className="text-muted mb-1">
                              <i className="bi bi-envelope me-1"></i>
                              {applicant.email}
                            </p>
                            <small className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              Applied on {formatDate(applicant.createdAt)}
                            </small>
                            
                            {applicant.bio && (
                              <p className="mt-2 text-muted small" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {applicant.bio}
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="col-md-4 text-end">
                            <div className="d-flex flex-column gap-2">
                              {applicant.resume && (
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => downloadResume(
                                    applicant._id, 
                                    `${applicant.name.first}_${applicant.name.last}`
                                  )}
                                >
                                  <i className="bi bi-download me-1"></i>
                                  Download Resume
                                </button>
                              )}
                              
                              <a 
                                href={`/profile/${applicant._id}`}
                                className="btn btn-primary btn-sm"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <i className="bi bi-person-lines-fill me-1"></i>
                                View Full Profile
                              </a>
                              
                              <a 
                                href={`mailto:${applicant.email}?subject=Regarding your application for ${jobInfo?.title}`}
                                className="btn btn-success btn-sm"
                              >
                                <i className="bi bi-envelope me-1"></i>
                                Contact
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Application Status Badge */}
                        <div className="position-absolute top-0 end-0 m-3">
                          <span className="badge bg-success">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal-footer border-top">
            <div className="w-100 d-flex justify-content-between align-items-center">
              <div className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                {applicants.length > 0 ? 
                  `Showing ${applicants.length} applicant${applicants.length > 1 ? 's' : ''}` :
                  'No applications to show'
                }
              </div>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplicantsList;