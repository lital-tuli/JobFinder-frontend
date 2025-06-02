import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ResumeSection = ({ user, onResumeUpdate, viewOnly = false }) => {
  const [resumes, setResumes] = useState(user?.resumes || []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Sync resumes when user prop changes
  useEffect(() => {
    if (user?.resumes) {
      setResumes(user.resumes);
    }
  }, [user?.resumes]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a PDF or Word document');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      // Prepare form data for upload
      const formData = new FormData();
      formData.append('resume', file);

      // Replace with your actual upload API endpoint
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed - please try again');
      }

      const newResume = await response.json();

      const updatedResumes = [...resumes, newResume];
      setResumes(updatedResumes);

      if (onResumeUpdate) {
        onResumeUpdate(updatedResumes);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError(error.message || 'Upload failed - please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveResume = async (resumeId) => {
    try {
      const response = await fetch(`/api/delete-resume/${resumeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove resume');
      }

      const updatedResumes = resumes.filter(resume => resume.id !== resumeId);
      setResumes(updatedResumes);

      if (onResumeUpdate) {
        onResumeUpdate(updatedResumes);
      }
    } catch {
      setUploadError('Failed to remove resume - please try again');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return 'bi-file-earmark-pdf text-danger';
    } else if (type.includes('word')) {
      return 'bi-file-earmark-word text-primary';
    }
    return 'bi-file-earmark text-secondary';
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="resume-section">
      {uploadError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {uploadError}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setUploadError('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {!viewOnly && (
        <div className="upload-area mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="d-none"
            disabled={uploading}
          />
          <div 
            className={`border border-dashed rounded p-4 text-center ${uploading ? 'bg-light' : ''} ${!uploading ? 'hover-effect' : ''}`}
            style={{ 
              borderColor: '#dee2e6', 
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={uploading ? undefined : triggerFileInput}
          >
            {uploading ? (
              <div>
                <div className="spinner-border text-primary mb-2" role="status">
                  <span className="visually-hidden">Uploading...</span>
                </div>
                <p className="text-muted mb-0">Uploading resume...</p>
                <small className="text-muted">Please wait...</small>
              </div>
            ) : (
              <div>
                <i className="bi bi-cloud-upload text-primary fs-2 mb-2"></i>
                <p className="mb-1 fw-semibold">Click to upload your resume</p>
                <small className="text-muted">PDF, DOC, DOCX • Max 10MB</small>
                <br />
                <small className="text-muted">Having an updated resume helps employers evaluate your qualifications</small>
              </div>
            )}
          </div>
        </div>
      )}

      {resumes.length > 0 ? (
        <div className="resume-list">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-semibold mb-0">
              <i className="bi bi-file-earmark-text me-2"></i>
              Uploaded Documents ({resumes.length})
            </h6>
            {viewOnly && (
              <span className="badge bg-success">
                <i className="bi bi-check-circle me-1"></i>
                {resumes.length} Resume{resumes.length > 1 ? 's' : ''} Available
              </span>
            )}
          </div>
          <div className="row">
            {resumes.map(resume => (
              <div key={resume.id} className="col-md-6 mb-3">
                <div className="card border hover-lift">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-start justify-content-between">
                      <div className="d-flex align-items-start">
                        <i className={`bi ${getFileIcon(resume.type)} fs-3 me-3 mt-1`}></i>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{resume.name}</h6>
                          <div className="text-muted small">
                            <div>{formatFileSize(resume.size)}</div>
                            {resume.uploadedAt && (
                              <div>
                                Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-1 ms-2">
                        <a
                          href={resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                          title="View resume"
                          onClick={(e) => {
                            if (!resume.url || resume.url === '#') {
                              e.preventDefault();
                              alert('Resume preview not available');
                            }
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </a>
                        {!viewOnly && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this resume?')) {
                                handleRemoveResume(resume.id);
                              }
                            }}
                            title="Remove resume"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="card bg-light border-0">
            <div className="card-body p-4">
              <i className="bi bi-file-earmark text-muted fs-1 mb-3"></i>
              <h6 className="fw-semibold mb-2">No Resume Uploaded Yet</h6>
              <p className="text-muted mb-0 small">
                {viewOnly 
                  ? "This user hasn't uploaded a resume yet."
                  : "Upload your resume to make job applications faster and help employers evaluate your qualifications."
                }
              </p>
              {!viewOnly && (
                <button 
                  className="btn btn-primary btn-sm mt-3"
                  onClick={triggerFileInput}
                  disabled={uploading}
                >
                 




<i className="bi bi-upload me-1"></i> Upload Resume
</button>
)}
</div>
</div>
</div>
)}
</div>
);
};

ResumeSection.propTypes = {
user: PropTypes.shape({
resumes: PropTypes.arrayOf(PropTypes.shape({
id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
name: PropTypes.string,
url: PropTypes.string,
uploadedAt: PropTypes.string,
size: PropTypes.number,
type: PropTypes.string
}))
}),
onResumeUpdate: PropTypes.func.isRequired,
viewOnly: PropTypes.bool
};

export default ResumeSection;