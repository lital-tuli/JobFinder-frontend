import React, { useState, useRef } from 'react';

// Profile Picture Upload Component
const ProfilePictureUpload = ({ currentPicture, onUpdate, loading = false }) => {
  const [preview, setPreview] = useState(currentPicture);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      // Simulate upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onUpdate) {
        onUpdate(preview);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload profile picture');
      setPreview(currentPicture); // Reset preview on error
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePicture = () => {
    setPreview(null);
    if (onUpdate) {
      onUpdate(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="profile-picture-upload text-center">
      <div className="position-relative d-inline-block">
        <div 
          className="avatar-container position-relative"
          style={{ width: '120px', height: '120px' }}
        >
          {preview ? (
            <img 
              src={preview} 
              alt="Profile" 
              className="rounded-circle w-100 h-100 object-fit-cover border"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="avatar-placeholder bg-light border rounded-circle d-flex align-items-center justify-content-center w-100 h-100"
              style={{ fontSize: '2.5rem', color: '#6c757d' }}
            >
              <i className="bi bi-person"></i>
            </div>
          )}
          
          {/* Upload overlay */}
          <div 
            className="avatar-overlay position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              opacity: uploading || loading ? 1 : 0,
              transition: 'opacity 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => !uploading && !loading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="text-white">
                <div className="spinner-border spinner-border-sm mb-1" role="status">
                  <span className="visually-hidden">Uploading...</span>
                </div>
                <div className="small">Uploading...</div>
              </div>
            ) : (
              <div className="text-white">
                <i className="bi bi-camera-fill fs-4"></i>
              </div>
            )}
          </div>
        </div>
        
        {/* Upload button */}
        <button
          type="button"
          className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle"
          style={{ width: '32px', height: '32px' }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || loading}
        >
          <i className="bi bi-plus"></i>
        </button>
        
        {/* Remove button */}
        {preview && (
          <button
            type="button"
            className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle"
            style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}
            onClick={handleRemovePicture}
            disabled={uploading || loading}
          >
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="d-none"
      />
      
      <div className="mt-2">
        <small className="text-muted">
          Click to upload a profile picture (max 5MB)
        </small>
      </div>

      <style>{`
        .avatar-container:hover .avatar-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};

// Resume Section Component
const ResumeSection = ({ user, onResumeUpdate }) => {
  const [resume, setResume] = useState(user?.resume || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleResumeUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid document file (PDF, DOC, or DOCX)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      // Simulate upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const resumeUrl = URL.createObjectURL(file); // Temporary URL for demo
      setResume({ name: file.name, url: resumeUrl, uploadDate: new Date() });
      
      if (onResumeUpdate) {
        onResumeUpdate(resumeUrl);
      }
    } catch (error) {
      console.error('Resume upload failed:', error);
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveResume = () => {
    setResume(null);
    if (onResumeUpdate) {
      onResumeUpdate(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="resume-section">
      <h6 className="fw-semibold mb-3">Resume</h6>
      
      {resume ? (
        <div className="resume-display">
          <div className="d-flex align-items-center p-3 border rounded bg-light">
            <div className="me-3">
              <i className="bi bi-file-earmark-pdf text-danger fs-2"></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-1">{resume.name || 'Resume.pdf'}</h6>
              <small className="text-muted">
                {resume.uploadDate && `Uploaded ${new Date(resume.uploadDate).toLocaleDateString()}`}
              </small>
            </div>
            <div className="btn-group">
              <a 
                href={resume.url || resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                <i className="bi bi-eye me-1"></i>View
              </a>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <i className="bi bi-upload me-1"></i>Update
              </button>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleRemoveResume}
                disabled={uploading}
              >
                <i className="bi bi-trash me-1"></i>Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="resume-upload">
          <div className="text-center p-4 border-2 border-dashed rounded">
            <i className="bi bi-cloud-upload text-muted fs-1 mb-2"></i>
            <p className="text-muted mb-3">No resume uploaded</p>
            <button 
              className="btn btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Uploading...</span>
                  </div>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  Upload Resume
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => handleResumeUpload(e.target.files[0])}
        className="d-none"
      />
      
      <small className="text-muted d-block mt-2">
        Supported formats: PDF, DOC, DOCX (max 10MB)
      </small>
    </div>
  );
};

// Enhanced Profile Form Component
const EnhancedProfileForm = ({ 
  user, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    firstName: user?.name?.first || '',
    lastName: user?.name?.last || '',
    email: user?.email || '',
    profession: user?.profession || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    location: user?.location || '',
    website: user?.website || '',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    profilePicture: user?.profilePicture || null,
    resume: user?.resume || null
  });
  
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must start with http:// or https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      profession: formData.profession,
      bio: formData.bio,
      phone: formData.phone,
      location: formData.location,
      website: formData.website,
      linkedin: formData.linkedin,
      github: formData.github,
      profilePicture: formData.profilePicture,
      resume: formData.resume
    };
    
    if (onSave) {
      await onSave(profileData);
      setIsDirty(false);
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="enhanced-profile-form">
      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Profile Picture Section */}
          <div className="col-md-4 mb-4">
            <div className="text-center">
              <ProfilePictureUpload
                currentPicture={formData.profilePicture}
                onUpdate={(newPicture) => handleInputChange('profilePicture', newPicture)}
                loading={loading}
              />
            </div>
          </div>
          
          {/* Basic Information */}
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
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
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
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
          </div>
        </div>
        
        {/* Bio Section */}
        <div className="mb-4">
          <label className="form-label">Bio</label>
          <textarea
            className="form-control"
            rows="4"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your experience, and what you're looking for..."
            maxLength="500"
          />
          <div className="form-text">
            {formData.bio.length}/500 characters
          </div>
        </div>
        
        {/* Social Links */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <label className="form-label">
              <i className="bi bi-globe me-2"></i>Website
            </label>
            <input
              type="url"
              className={`form-control ${errors.website ? 'is-invalid' : ''}`}
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://yourwebsite.com"
            />
            {errors.website && (
              <div className="invalid-feedback">{errors.website}</div>
            )}
          </div>
          
          <div className="col-md-4 mb-3">
            <label className="form-label">
              <i className="bi bi-linkedin me-2"></i>LinkedIn
            </label>
            <input
              type="url"
              className="form-control"
              value={formData.linkedin}
              onChange={(e) => handleInputChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          
          <div className="col-md-4 mb-3">
            <label className="form-label">
              <i className="bi bi-github me-2"></i>GitHub
            </label>
            <input
              type="url"
              className="form-control"
              value={formData.github}
              onChange={(e) => handleInputChange('github', e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </div>
        </div>
        
        {/* Resume Section */}
        <div className="mb-4">
          <ResumeSection
            user={{ resume: formData.resume }}
            onResumeUpdate={(newResume) => handleInputChange('resume', newResume)}
          />
        </div>
        
        {/* Action Buttons */}
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
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Profile Management Component
const ProfileManagement = () => {
  const [user, setUser] = useState({
    name: { first: 'John', last: 'Doe' },
    email: 'john.doe@example.com',
    profession: 'Software Developer',
    bio: 'Passionate developer with 5 years of experience...',
    phone: '+1 (555) 123-4567',
    location: 'Tel Aviv, Israel',
    website: 'https://johndoe.dev',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    profilePicture: null,
    resume: null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (profileData) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUser(profileData);
      setIsEditing(false);
      
      // Show success notification (you can integrate with your notification system)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="container py-4">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 pb-0">
                <h3 className="mb-0">Edit Profile</h3>
              </div>
              <div className="card-body">
                <EnhancedProfileForm
                  user={user}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Profile</h3>
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <i className="bi bi-pencil me-2"></i>Edit Profile
              </button>
            </div>
            <div className="card-body">
              {/* Profile Display */}
              <div className="row">
                <div className="col-md-3 text-center mb-4">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="rounded-circle"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center"
                      style={{ width: '120px', height: '120px', fontSize: '2.5rem', color: '#6c757d' }}
                    >
                      <i className="bi bi-person"></i>
                    </div>
                  )}
                </div>
                <div className="col-md-9">
                  <h4>{user.name.first} {user.name.last}</h4>
                  <p className="text-muted">{user.profession}</p>
                  <p>{user.bio}</p>
                  
                  <div className="row">
                    <div className="col-sm-6">
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div className="col-sm-6">
                      <strong>Phone:</strong> {user.phone || 'Not provided'}
                    </div>
                    <div className="col-sm-6">
                      <strong>Location:</strong> {user.location || 'Not provided'}
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="mt-3">
                    {user.website && (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm me-2">
                        <i className="bi bi-globe me-1"></i>Website
                      </a>
                    )}
                    {user.linkedin && (
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm me-2">
                        <i className="bi bi-linkedin me-1"></i>LinkedIn
                      </a>
                    )}
                    {user.github && (
                      <a href={user.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                        <i className="bi bi-github me-1"></i>GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;