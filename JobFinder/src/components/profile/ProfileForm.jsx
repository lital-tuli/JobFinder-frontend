import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FormField from '../common/FormField/FormField';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/messages/ErrorMessage';
import SuccessMessage from '../common/messages/SuccessMessage';

const ProfileForm = ({ user, onSave, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  
  // File upload states
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [profileUploadLoading, setProfileUploadLoading] = useState(false);
  const [profileUploadError, setProfileUploadError] = useState('');
  const [profileUploadSuccess, setProfileUploadSuccess] = useState('');
  
  const [resumeFiles, setResumeFiles] = useState([]);
  const [resumeUploadLoading, setResumeUploadLoading] = useState(false);
  const [resumeUploadError, setResumeUploadError] = useState('');
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState('');
  
  // File input refs
  const profileImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.name?.first || '',
        lastName: user.name?.last || '',
        email: user.email || '',
        phone: user.phone || '',
        profession: user.profession || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
        linkedin: user.linkedin || '',
        github: user.github || ''
      });
      setProfilePicturePreview(user.profilePicture || '');
      setResumeFiles(user.resumes || []);
      setErrors({});
      setIsDirty(false);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    const fieldsToValidate = [
      'firstName', 'lastName', 'email', 'phone',
      'profession', 'location', 'bio', 'website',
      'linkedin', 'github'
    ];
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) return `${field === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.length < 2) return `${field === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        if (value.length > 50) return `${field === 'firstName' ? 'First' : 'Last'} name cannot exceed 50 characters`;
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        if (value.length > 100) return 'Email cannot exceed 100 characters';
        return '';
      case 'phone':
        if (value && !/^[+]?[1-9][\d\s\-().]{7,15}$/.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid phone number';
        }
        return '';
      case 'bio':
        if (value && value.length > 500) return 'Bio cannot exceed 500 characters';
        return '';
      case 'profession':
      case 'location':
        if (value && value.length > 100) return `${field.charAt(0).toUpperCase() + field.slice(1)} cannot exceed 100 characters`;
        return '';
      case 'website':
        if (value && !/^https?:\/\/.+\..+/.test(value)) {
          return 'Please enter a valid website URL';
        }
        return '';
      case 'linkedin':
        if (value && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(value)) {
          return 'Please enter a valid LinkedIn URL';
        }
        return '';
      case 'github':
        if (value && !/^https?:\/\/(www\.)?github\.com\/.+/.test(value)) {
          return 'Please enter a valid GitHub URL';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Profile Image Upload Functions
  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, GIF, or WebP)';
    }

    if (file.size > maxSize) {
      return 'Image file size must be less than 5MB';
    }

    return null;
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileUploadError('');
    setProfileUploadSuccess('');

    const validationError = validateImageFile(file);
    if (validationError) {
      setProfileUploadError(validationError);
      if (profileImageInputRef.current) {
        profileImageInputRef.current.value = '';
      }
      return;
    }

    setProfilePictureFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfilePicturePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    setIsDirty(true);
  };

  const uploadProfileImage = async (file) => {
    setProfileUploadLoading(true);
    setProfileUploadError('');

    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('userId', user._id);

      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      setProfileUploadSuccess('Profile image uploaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileUploadSuccess(''), 3000);
      
      return data.imageUrl;
    } catch (error) {
      setProfileUploadError(error.message || 'Failed to upload profile image');
      throw error;
    } finally {
      setProfileUploadLoading(false);
    }
  };

  const removeProfileImage = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview('');
    setProfileUploadError('');
    setProfileUploadSuccess('');
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
    setIsDirty(true);
  };

  // Resume Upload Functions
  const validateResumeFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid resume file (PDF, DOC, or DOCX)';
    }

    if (file.size > maxSize) {
      return 'Resume file size must be less than 10MB';
    }

    return null;
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeUploadError('');
    setResumeUploadSuccess('');

    const validationError = validateResumeFile(file);
    if (validationError) {
      setResumeUploadError(validationError);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
      return;
    }

    await uploadResume(file);
  };

  const uploadResume = async (file) => {
    setResumeUploadLoading(true);
    setResumeUploadError('');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('userId', user._id);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload resume');
      }

      const data = await response.json();
      
      const newResume = {
        id: data.id || Date.now().toString(),
        name: file.name,
        url: data.fileUrl,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      setResumeFiles(prev => [...prev, newResume]);
      setResumeUploadSuccess('Resume uploaded successfully!');
      setIsDirty(true);
      
      // Clear the file input
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setResumeUploadSuccess(''), 3000);
      
    } catch (error) {
      setResumeUploadError(error.message || 'Failed to upload resume');
    } finally {
      setResumeUploadLoading(false);
    }
  };

  const removeResume = async (resumeId) => {
    try {
      const response = await fetch(`/api/upload/resume/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      setResumeFiles(prev => prev.filter(resume => resume.id !== resumeId));
      setResumeUploadSuccess('Resume removed successfully!');
      setIsDirty(true);
      
      setTimeout(() => setResumeUploadSuccess(''), 3000);
    } catch (error) {
      setResumeUploadError(error.message || 'Failed to remove resume');
    }
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return 'bi-file-earmark-pdf text-danger';
    } else if (type.includes('word')) {
      return 'bi-file-earmark-word text-primary';
    }
    return 'bi-file-earmark text-secondary';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let imageUrl = user.profilePicture || '';

    try {
      // Upload profile image if new file selected
      if (profilePictureFile) {
        imageUrl = await uploadProfileImage(profilePictureFile);
      }

      const profileData = {
        name: {
          first: formData.firstName.trim(),
          last: formData.lastName.trim()
        },
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        profession: formData.profession.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        location: formData.location.trim() || undefined,
        website: formData.website.trim() || undefined,
        linkedin: formData.linkedin.trim() || undefined,
        github: formData.github.trim() || undefined,
        profilePicture: imageUrl || undefined,
        resumes: resumeFiles
      };

      // Remove undefined values
      Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined) delete profileData[key];
      });

      await onSave(profileData);
      setIsDirty(false);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) return;
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="enhanced-profile-form">
      {/* Profile Image Section */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-camera me-2"></i>Profile Picture
        </h6>
        
        <div className="row align-items-center">
          <div className="col-md-4">
            <div className="profile-image-container text-center">
              {profilePicturePreview ? (
                <div className="position-relative d-inline-block">
                  <img
                    src={profilePicturePreview}
                    alt="Profile Preview"
                    className="rounded-circle border"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                    onClick={removeProfileImage}
                    style={{ width: '30px', height: '30px' }}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              ) : (
                <div 
                  className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center border"
                  style={{ width: '120px', height: '120px', fontSize: '2.5rem', color: '#6c757d' }}
                >
                  <i className="bi bi-person"></i>
                </div>
              )}
            </div>
          </div>
          
          <div className="col-md-8">
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="form-control mb-2"
              onChange={handleProfileImageChange}
              disabled={loading || profileUploadLoading}
            />
            <small className="text-muted d-block mb-2">
              Supported formats: JPEG, PNG, GIF, WebP • Max size: 5MB
            </small>
            
            {profileUploadLoading && (
              <LoadingSpinner size="sm" message="Uploading image..." inline />
            )}
            
            {profileUploadError && (
              <ErrorMessage error={profileUploadError} className="mt-2" />
            )}
            
            {profileUploadSuccess && (
              <SuccessMessage message={profileUploadSuccess} className="mt-2" />
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-person me-2"></i>Basic Information
        </h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              error={errors.firstName}
              onChange={(val) => handleInputChange('firstName', val)}
              validator={(val) => validateField('firstName', val)}
              validateOnBlur
              required
              disabled={loading}
              placeholder="Enter your first name"
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              error={errors.lastName}
              onChange={(val) => handleInputChange('lastName', val)}
              validator={(val) => validateField('lastName', val)}
              validateOnBlur
              required
              disabled={loading}
              placeholder="Enter your last name"
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              error={errors.email}
              onChange={(val) => handleInputChange('email', val)}
              validator={(val) => validateField('email', val)}
              validateOnBlur
              required
              disabled={loading}
              placeholder="your.email@example.com"
              helpText="This will be your login email"
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              error={errors.phone}
              onChange={(val) => handleInputChange('phone', val)}
              validator={(val) => validateField('phone', val)}
              validateOnBlur
              placeholder="+1 (555) 123-4567"
              disabled={loading}
              helpText="Optional - for contact purposes"
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Profession"
              name="profession"
              value={formData.profession}
              error={errors.profession}
              onChange={(val) => handleInputChange('profession', val)}
              validator={(val) => validateField('profession', val)}
              validateOnBlur
              placeholder="e.g., Software Engineer"
              disabled={loading}
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              error={errors.location}
              onChange={(val) => handleInputChange('location', val)}
              validator={(val) => validateField('location', val)}
              validateOnBlur
              placeholder="e.g., Tel Aviv, IL"
              disabled={loading}
            />
          </div>
        </div>

        <div className="mb-3">
          <FormField
            label="Professional Summary"
            name="bio"
            type="textarea"
            value={formData.bio}
            error={errors.bio}
            onChange={(val) => handleInputChange('bio', val)}
            validator={(val) => validateField('bio', val)}
            validateOnChange
            rows={4}
            helpText={`${formData.bio.length}/500 characters`}
            disabled={loading}
            placeholder="Tell us about your background, goals, and achievements..."
          />
        </div>
      </div>

      {/* Professional Links */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-link-45deg me-2"></i>Professional Links
        </h6>
        <div className="row">
          <div className="col-md-4 mb-3">
            <FormField
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              error={errors.website}
              onChange={(val) => handleInputChange('website', val)}
              validator={(val) => validateField('website', val)}
              validateOnBlur
              disabled={loading}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="col-md-4 mb-3">
            <FormField
              label="LinkedIn"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              error={errors.linkedin}
              onChange={(val) => handleInputChange('linkedin', val)}
              validator={(val) => validateField('linkedin', val)}
              validateOnBlur
              disabled={loading}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="col-md-4 mb-3">
            <FormField
              label="GitHub"
              name="github"
              type="url"
              value={formData.github}
              error={errors.github}
              onChange={(val) => handleInputChange('github', val)}
              validator={(val) => validateField('github', val)}
              validateOnBlur
              disabled={loading}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-file-earmark-text me-2"></i>Resume & Documents
        </h6>
        
        <div className="upload-area mb-3">
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="form-control mb-2"
            onChange={handleResumeChange}
            disabled={loading || resumeUploadLoading}
          />
          <small className="text-muted d-block mb-2">
            Supported formats: PDF, DOC, DOCX • Max size: 10MB
          </small>
          
          {resumeUploadLoading && (
            <LoadingSpinner size="sm" message="Uploading resume..." inline />
          )}
          
          {resumeUploadError && (
            <ErrorMessage error={resumeUploadError} className="mt-2" />
          )}
          
          {resumeUploadSuccess && (
            <SuccessMessage message={resumeUploadSuccess} className="mt-2" />
          )}
        </div>

        {/* Resume List */}
        {resumeFiles.length > 0 && (
          <div className="resume-list">
            <h6 className="fw-semibold mb-3">Uploaded Resumes ({resumeFiles.length})</h6>
            <div className="row">
              {resumeFiles.map(resume => (
                <div key={resume.id} className="col-md-6 mb-3">
                  <div className="card border">
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
                            title="Download resume"
                          >
                            <i className="bi bi-download"></i>
                          </a>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to remove this resume?')) {
                                removeResume(resume.id);
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="d-flex justify-content-end gap-2 pt-3 border-top">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          <i className="bi bi-x-circle me-1"></i>Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !isDirty}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-1"></i>
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ProfileForm;