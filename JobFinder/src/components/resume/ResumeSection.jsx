import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ResumeSection = ({ user, onResumeUpdate }) => {
  const [resumes, setResumes] = useState(user?.resumes || []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Update resumes when user prop changes
  useEffect(() => {
    if (user?.resumes) {
      setResumes(user.resumes);
    }
  }, [user?.resumes]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file); // Debug log
    
    if (!file) return;

    // Clear any previous errors
    setUploadError('');

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a PDF or Word document');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    console.log('Starting file upload simulation...'); // Debug log

    try {
      // Simulate file upload - in a real app, you'd upload to server/cloud storage
      const uploadPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success/failure (90% success rate for demo)
          if (Math.random() > 0.1) {
            const newResume = {
              id: Date.now().toString(),
              name: file.name,
              url: URL.createObjectURL(file), // Demo URL - in production, use server URL
              uploadedAt: new Date().toISOString(),
              size: file.size,
              type: file.type
            };
            resolve(newResume);
          } else {
            reject(new Error('Upload failed - please try again'));
          }
        }, 1500);
      });

      const newResume = await uploadPromise;
      console.log('Upload successful:', newResume); // Debug log

      const updatedResumes = [...resumes, newResume];
      setResumes(updatedResumes);
      
      // Call the callback to update parent component
      if (onResumeUpdate) {
        console.log('Calling onResumeUpdate with:', updatedResumes); // Debug log
        onResumeUpdate(updatedResumes);
      }

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Upload failed - please try again');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveResume = async (resumeId) => {
    console.log('Removing resume:', resumeId); // Debug log
    
    try {
      const updatedResumes = resumes.filter(resume => resume.id !== resumeId);
      setResumes(updatedResumes);
      
      if (onResumeUpdate) {
        console.log('Calling onResumeUpdate after removal:', updatedResumes); // Debug log
        onResumeUpdate(updatedResumes);
      }
    } catch (error) {
      console.error('Error removing resume:', error);
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
    console.log('Triggering file input click'); // Debug log
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="resume-section">
      <h6 className="fw-semibold mb-3">Resume/CV</h6>
      
      {/* Error Display */}
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
      
      {/* Upload Area */}
      <div className="upload-area mb-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="d-none"
          disabled={uploading}
        />
        
        <div 
          className={`border border-dashed rounded p-4 text-center ${uploading ? 'bg-light' : ''}`}
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
              <p className="mb-1">Click to upload your resume</p>
              <small className="text-muted">PDF, DOC, DOCX (Max 10MB)</small>
            </div>
          )}
        </div>
      </div>

      {/* Resume List */}
      {resumes.length > 0 && (
        <div className="resume-list">
          <h6 className="fw-semibold mb-2">Uploaded Resumes ({resumes.length})</h6>
          {resumes.map(resume => (
            <div key={resume.id} className="card mb-2">
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <i className={`bi ${getFileIcon(resume.type)} fs-4 me-3`}></i>
                    <div>
                      <h6 className="mb-0">{resume.name}</h6>
                      <small className="text-muted">
                        {formatFileSize(resume.size)}
                        {resume.uploadedAt && (
                          <span className="ms-2">
                            • Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                          </span>
                        )}
                      </small>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                      title="View resume"
                      onClick={(e) => {
                        console.log('Viewing resume:', resume.name); // Debug log
                        // Check if URL is valid
                        if (!resume.url || resume.url === '#') {
                          e.preventDefault();
                          alert('Resume preview not available');
                        }
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </a>
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {resumes.length === 0 && !uploading && (
        <div className="text-center py-3">
          <i className="bi bi-file-earmark text-muted fs-2 mb-2"></i>
          <p className="text-muted mb-0">No resumes uploaded yet</p>
          <small className="text-muted">Upload your resume to get started</small>
        </div>
      )}

      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div className="mt-3 p-2 bg-light rounded">
          <small className="text-muted">
            <strong>Debug:</strong> Resumes count: {resumes.length}, Uploading: {uploading.toString()}
            <br />
            onResumeUpdate callback: {onResumeUpdate ? 'Available' : 'Missing'}
          </small>
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
  onResumeUpdate: PropTypes.func.isRequired
};

export default ResumeSection;