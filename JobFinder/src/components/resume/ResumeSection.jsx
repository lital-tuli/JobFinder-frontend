// src/components/resume/ResumeSection.jsx - Frontend-only version
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ResumeSection = ({ userId, className = '' }) => {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Load resumes from localStorage on component mount
  useEffect(() => {
    if (userId) {
      const savedResumes = localStorage.getItem(`resumes_${userId}`);
      if (savedResumes) {
        try {
          const parsedResumes = JSON.parse(savedResumes);
          setResumes(parsedResumes);
        } catch (error) {
          console.error('Error loading saved resumes:', error);
          localStorage.removeItem(`resumes_${userId}`);
        }
      }
    }
  }, [userId]);

  // Save resumes to localStorage whenever resumes change
  useEffect(() => {
    if (userId && resumes.length > 0) {
      localStorage.setItem(`resumes_${userId}`, JSON.stringify(resumes));
    } else if (userId && resumes.length === 0) {
      localStorage.removeItem(`resumes_${userId}`);
    }
  }, [resumes, userId]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF or Word document');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);

    // Process file and create resume object
    const newResume = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file), // Create blob URL for local viewing
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type,
      file: file // Store file object for potential future use
    };

    setTimeout(() => {
      setResumes(prev => [...prev, newResume]);
      setUploading(false);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1000); // Simulate upload delay
  };

  const handleRemoveResume = (resumeId) => {
    const resumeToRemove = resumes.find(resume => resume.id === resumeId);
    
    // Revoke object URL to free memory
    if (resumeToRemove && resumeToRemove.url) {
      URL.revokeObjectURL(resumeToRemove.url);
    }
    
    setResumes(prev => prev.filter(resume => resume.id !== resumeId));
  };

  const handleDownloadResume = (resume) => {
    // Create a download link
    const link = document.createElement('a');
    link.href = resume.url;
    link.download = resume.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const clearAllResumes = () => {
    if (window.confirm('Are you sure you want to remove all resumes? This action cannot be undone.')) {
      // Revoke all object URLs
      resumes.forEach(resume => {
        if (resume.url) {
          URL.revokeObjectURL(resume.url);
        }
      });
      
      setResumes([]);
      if (userId) {
        localStorage.removeItem(`resumes_${userId}`);
      }
    }
  };

  return (
    <div className={`resume-section ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">Resume/CV Management</h6>
        {resumes.length > 0 && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={clearAllResumes}
            title="Clear all resumes"
          >
            <i className="bi bi-trash me-1"></i>
            Clear All
          </button>
        )}
      </div>
      
      <div className="alert alert-info small mb-3">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Note:</strong> Resumes are stored locally in your browser. They won't be shared with other devices or saved to your account.
      </div>
      
      {/* Upload Area */}
      <div className="upload-area mb-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="d-none"
        />
        
        <div 
          className="border border-dashed rounded p-4 text-center"
          style={{ 
            borderColor: '#dee2e6', 
            cursor: uploading ? 'not-allowed' : 'pointer',
            backgroundColor: uploading ? '#f8f9fa' : 'transparent'
          }}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <div>
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
              <p className="text-muted mb-0">Processing resume...</p>
            </div>
          ) : (
            <div>
              <i className="bi bi-cloud-upload text-primary fs-2 mb-2"></i>
              <p className="mb-1">Click to upload your resume</p>
              <small className="text-muted">PDF, DOC, DOCX (Max 10MB)</small>
            </div>
          )}
        </div>
      </div>

      {/* Resume List */}
      {resumes.length > 0 ? (
        <div className="resume-list">
          <h6 className="fw-semibold mb-3">
            Your Resumes ({resumes.length})
          </h6>
          {resumes.map(resume => (
            <div key={resume.id} className="card mb-2 resume-card">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center flex-grow-1">
                    <i className={`bi ${getFileIcon(resume.type)} fs-4 me-3`}></i>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{resume.name}</h6>
                      <div className="d-flex align-items-center gap-3">
                        <small className="text-muted">
                          {formatFileSize(resume.size)}
                        </small>
                        {resume.uploadedAt && (
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {new Date(resume.uploadedAt).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => window.open(resume.url, '_blank')}
                      title="View resume"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleDownloadResume(resume)}
                      title="Download resume"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveResume(resume.id)}
                      title="Remove resume"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-light rounded">
          <i className="bi bi-file-earmark text-muted fs-1 mb-3"></i>
          <h6 className="text-muted mb-2">No resumes uploaded yet</h6>
          <p className="text-muted small mb-3">
            Upload your resume to keep it handy for job applications
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Upload Your First Resume
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4">
        <div className="card bg-light border-0">
          <div className="card-body p-3">
            <h6 className="fw-semibold mb-2">
              <i className="bi bi-lightbulb text-warning me-2"></i>
              Resume Tips
            </h6>
            <div className="row">
              <div className="col-md-6 mb-2">
                <small className="text-muted">
                  <strong>Multiple Versions:</strong> Upload different versions for different job types.
                </small>
              </div>
              <div className="col-md-6 mb-2">
                <small className="text-muted">
                  <strong>Keep Updated:</strong> Regular updates help you stay ready for opportunities.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .resume-card {
          transition: all 0.2s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }
        
        .resume-card:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        
        .upload-area:hover {
          border-color: #007bff !important;
          background-color: rgba(0,123,255,0.05);
        }
      `}</style>
    </div>
  );
};

ResumeSection.propTypes = {
  userId: PropTypes.string,
  className: PropTypes.string
};

export default ResumeSection;