import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const ProfileForm = ({ user, onSave, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    // Basic Profile Fields
    firstName: user?.name?.first || '',
    lastName: user?.name?.last || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profession: user?.profession || '',
    bio: user?.bio || '',
    location: user?.location || '',
    
    // Profile Picture
    profilePicture: user?.profilePicture || null,
    
    // Resume Data
    resumes: user?.resumes || []
  });
  
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // ================================
  // VALIDATION RULES
  // ================================
  const validateForm = () => {
    const newErrors = {};
    
    // Required Fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone Validation (Optional but if provided must be valid)
    if (formData.phone && !/^[+]?[()]?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Bio Length Validation
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================================
  // INPUT HANDLERS
  // ================================
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // ================================
  // PROFILE PICTURE HANDLING
  // ================================
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Convert to base64 and update state
    const reader = new FileReader();
    reader.onload = (e) => {
      handleInputChange('profilePicture', e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    handleInputChange('profilePicture', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ================================
  // RESUME HANDLING
  // ================================
  const handleResumeUpload = (e) => {
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
      alert('Resume size must be less than 10MB');
      return;
    }

    // Add resume to list
    const newResume = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file), // Demo URL - in production, upload to server
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type
    };

    const updatedResumes = [...formData.resumes, newResume];
    handleInputChange('resumes', updatedResumes);

    // Clear file input
    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const removeResume = (resumeId) => {
    const updatedResumes = formData.resumes.filter(resume => resume.id !== resumeId);
    handleInputChange('resumes', updatedResumes);
  };

  // ================================
  // FORM SUBMISSION
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const profileData = {
      name: {
        first: formData.firstName,
        last: formData.lastName
      },
      email: formData.email,
      phone: formData.phone,
      profession: formData.profession,
      bio: formData.bio,
      location: formData.location,
      profilePicture: formData.profilePicture,
      resumes: formData.resumes
    };
    
    try {
      await onSave(profileData);
      setIsDirty(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    onCancel();
  };

  // ================================
  // UTILITY FUNCTIONS
  // ================================
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

  // ================================
  // RENDER COMPONENT
  // ================================
  return (
    <form onSubmit={handleSubmit} className="simple-profile-form">
      
      {/* ================================ */}
      {/* PROFILE PICTURE SECTION */}
      {/* ================================ */}
      <div className="profile-picture-section mb-4">
        <h6 className="fw-semibold mb-3">Profile Picture</h6>
        
        <div className="text-center">
          <div className="mb-3">
            {formData.profilePicture ? (
              <img 
                src={formData.profilePicture} 
                alt="Profile" 
                className="rounded-circle border shadow-sm"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              />
            ) : (
              <div 
                className="bg-light rounded-circle border shadow-sm mx-auto d-flex align-items-center justify-content-center"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  fontSize: '2.5rem', 
                  color: '#6c757d',
                  cursor: 'pointer'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="bi bi-person"></i>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="d-none"
          />

          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              <i className="bi bi-camera me-1"></i>
              {formData.profilePicture ? 'Change' : 'Upload'}
            </button>
            {formData.profilePicture && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={removeProfilePicture}
                disabled={loading}
              >
                <i className="bi bi-trash me-1"></i>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================ */}
      {/* BASIC PROFILE FIELDS */}
      {/* ================================ */}
      <div className="basic-fields-section mb-4">
        <h6 className="fw-semibold mb-3">Basic Information</h6>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+972 50-123-4567"
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Profession</label>
            <input
              type="text"
              className="form-control"
              value={formData.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
              placeholder="e.g., Software Developer"
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-control"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Tel Aviv, Israel"
            />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Professional Summary</label>
          <textarea
            className={`form-control ${errors.bio ? 'is-invalid' : ''}`}
            rows="4"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your experience, and what you're looking for..."
            maxLength="500"
          />
          {errors.bio && (
            <div className="invalid-feedback">{errors.bio}</div>
          )}
          <div className="form-text">
            {formData.bio.length}/500 characters
          </div>
        </div>
      </div>

      {/* ================================ */}
      {/* RESUME SECTION */}
      {/* ================================ */}
      <div className="resume-section mb-4">
        <h6 className="fw-semibold mb-3">Resume/CV</h6>
        
        <div className="upload-area mb-3">
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="d-none"
          />
          
          <div 
            className="border border-dashed rounded p-4 text-center"
            style={{ borderColor: '#dee2e6', cursor: 'pointer' }}
            onClick={() => resumeInputRef.current?.click()}
          >
            <i className="bi bi-cloud-upload text-primary fs-2 mb-2"></i>
            <p className="mb-1">Click to upload your resume</p>
            <small className="text-muted">PDF, DOC, DOCX (Max 10MB)</small>
          </div>
        </div>

        {/* Resume List */}
        {formData.resumes.length > 0 && (
          <div className="resume-list">
            <h6 className="fw-semibold mb-2">Uploaded Resumes</h6>
            {formData.resumes.map(resume => (
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
                        onClick={() => removeResume(resume.id)}
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
      </div>
      
      {/* ================================ */}
      {/* ACTION BUTTONS */}
      {/* ================================ */}
      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !isDirty}
        >
          {loading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Saving...</span>
              </div>
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </div>
    </form>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ProfileForm;
