// src/components/profile/ResumeSection.jsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const ResumeSection = ({ user, onResumeUpdate }) => {
    const [resumes, setResumes] = useState(user?.resumes || []);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

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

        // Simulate file upload (in real app, upload to server/cloud storage)
        setTimeout(() => {
            const newResume = {
                id: Date.now().toString(),
                name: file.name,
                url: URL.createObjectURL(file), // Demo URL
                uploadedAt: new Date().toISOString(),
                size: file.size,
                type: file.type
            };

            const updatedResumes = [...resumes, newResume];
            setResumes(updatedResumes);
            onResumeUpdate && onResumeUpdate(updatedResumes);
            setUploading(false);

            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }, 1500);
    };

    const handleRemoveResume = (resumeId) => {
        const updatedResumes = resumes.filter(resume => resume.id !== resumeId);
        setResumes(updatedResumes);
        onResumeUpdate && onResumeUpdate(updatedResumes);
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

    return (
        <div className="resume-section">
            <h6 className="fw-semibold mb-3">Resume/CV</h6>
            
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
                    style={{ borderColor: '#dee2e6', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div>
                            <div className="spinner-border text-primary mb-2" role="status">
                                <span className="visually-hidden">Uploading...</span>
                            </div>
                            <p className="text-muted mb-0">Uploading resume...</p>
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
                    <h6 className="fw-semibold mb-2">Uploaded Resumes</h6>
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
                                        >
                                            <i className="bi bi-eye"></i>
                                        </a>
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
            )}

            {resumes.length === 0 && (
                <div className="text-center py-3">
                    <i className="bi bi-file-earmark text-muted fs-2 mb-2"></i>
                    <p className="text-muted mb-0">No resumes uploaded yet</p>
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
    onResumeUpdate: PropTypes.func
};

export default ResumeSection;