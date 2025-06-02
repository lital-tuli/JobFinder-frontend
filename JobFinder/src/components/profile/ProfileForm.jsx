import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormField from '../common/FormField/FormField';
import LoadingSpinner from '../common/LoadingSpinner';

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
    github: '',
    profilePicture: null,
    resumes: []
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // Initialize form data when user prop changes
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
        github: user.github || '',
        profilePicture: user.profilePicture || null,
        resumes: user.resumes || []
      });
      setErrors({});
      setIsDirty(false);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z\s'.-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, apostrophes, periods, and hyphens';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z\s'.-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, spaces, apostrophes, periods, and hyphens';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email cannot exceed 100 characters';
    }

    // Optional field validations
    if (formData.phone && !/^[+]?[1-9][\d\s\-().]{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    if (formData.profession && formData.profession.length > 100) {
      newErrors.profession = 'Profession cannot exceed 100 characters';
    }

    if (formData.location && formData.location.length > 100) {
      newErrors.location = 'Location cannot exceed 100 characters';
    }

    // URL validations
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (starting with http:// or https://)';
    }

    if (formData.linkedin && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    if (formData.github && !/^https?:\/\/(www\.)?github\.com\/.+/.test(formData.github)) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, profilePicture: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, profilePicture: 'Image size must be less than 5MB' }));
      return;
    }

    setUploadingPicture(true);
    setErrors(prev => ({ ...prev, profilePicture: '' }));

    try {
      // Create a promise to handle FileReader
      const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(file);
        });
      };

      const dataURL = await readFileAsDataURL(file);
      handleInputChange('profilePicture', dataURL);
    } catch (error) {
      console.error('Error reading file:', error);
      setErrors(prev => ({ ...prev, profilePicture: 'Failed to process image' }));
    } finally {
      setUploadingPicture(false);
    }
  };

  const removeProfilePicture = () => {
    handleInputChange('profilePicture', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, resume: 'Please select a PDF or Word document' }));
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resume: 'Resume size must be less than 10MB' }));
      return;
    }

    setUploadingResume(true);
    setErrors(prev => ({ ...prev, resume: '' }));

    try {
      // Create new resume object
      const newResume = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file), // This is a demo - in production, upload to server
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
    } catch (error) {
      console.error('Error uploading resume:', error);
      setErrors(prev => ({ ...prev, resume: 'Failed to upload resume' }));
    } finally {
      setUploadingResume(false);
    }
  };

  const removeResume = (resumeId) => {
    const updatedResumes = formData.resumes.filter(resume => resume.id !== resumeId);
    handleInputChange('resumes', updatedResumes);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare profile data
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
      profilePicture: formData.profilePicture,
      resumes: formData.resumes
    };

    // Remove undefined values
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === undefined) {
        delete profileData[key];
      }
    });

    try {
      await onSave(profileData);
      setIsDirty(false);
    } catch (error) {
      console.error('Save failed:', error);
      // Error handling is done in parent component
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      {/* Profile Picture Section */}
      <div className="profile-picture-section mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-camera me-2"></i>
          Profile Picture
        </h6>
        
        <div className="text-center">
          <div className="position-relative d-inline-block mb-3">
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
                onClick={() => !uploadingPicture && fileInputRef.current?.click()}
              />
            ) : (
              <div
                className="bg-light rounded-circle border shadow-sm d-flex align-items-center justify-content-center"
                style={{
                  width: '120px',
                  height: '120px',
                  fontSize: '2.5rem',
                  color: '#6c757d',
                  cursor: 'pointer'
                }}
                onClick={() => !uploadingPicture && fileInputRef.current?.click()}
              >
                <i className="bi bi-person"></i>
              </div>
            )}
            
            {uploadingPicture && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="d-none"
            disabled={uploadingPicture || loading}
          />

          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPicture || loading}
            >
              <i className="bi bi-camera me-1"></i>
              {uploadingPicture ? 'Uploading...' : formData.profilePicture ? 'Change' : 'Upload'}
            </button>
            
            {formData.profilePicture && (
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={removeProfilePicture}
                disabled={uploadingPicture || loading}
              >
                <i className="bi bi-trash me-1"></i>
                Remove
              </button>
            )}
          </div>
          
          {errors.profilePicture && (
            <div className="text-danger small mt-2">{errors.profilePicture}</div>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="basic-info-section mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-person me-2"></i>
          Basic Information
        </h6>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              error={errors.firstName}
              onChange={(value) => handleInputChange('firstName', value)}
              required
              disabled={loading}
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              error={errors.lastName}
              onChange={(value) => handleInputChange('lastName', value)}
              required
              disabled={loading}
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              error={errors.email}
              onChange={(value) => handleInputChange('email', value)}
              required
              disabled={loading}
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              error={errors.phone}
              onChange={(value) => handleInputChange('phone', value)}
              placeholder="+1 (555) 123-4567"
              disabled={loading}
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Profession"
              name="profession"
              value={formData.profession}
              error={errors.profession}
              onChange={(value) => handleInputChange('profession', value)}
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
              onChange={(value) => handleInputChange('location', value)}
              placeholder="e.g., New York, NY"
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
            onChange={(value) => handleInputChange('bio', value)}
            placeholder="Tell us about your professional background and career goals..."
            rows={4}
            helpText={`${formData.bio.length}/500 characters`}
            disabled={loading}
          />
        </div>
      </div>

      {/* Links Section */}
      <div className="links-section mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-link-45deg me-2"></i>
          Professional Links
        </h6>
        
        <div className="row">
          <div className="col-md-4 mb-3">
            <FormField
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              error={errors.website}
              onChange={(value) => handleInputChange('website', value)}
              placeholder="https://yourwebsite.com"
              disabled={loading}
            />
          </div>

          <div className="col-md-4 mb-3">
            <FormField
              label="LinkedIn Profile"
              name="linkedin"
              type="url"
              value={formData.linkedin}
              error={errors.linkedin}
              onChange={(value) => handleInputChange('linkedin', value)}
              placeholder="https://linkedin.com/in/yourprofile"
              disabled={loading}
            />
          </div>

          <div className="col-md-4 mb-3">
            <FormField
              label="GitHub Profile"
              name="github"
              type="url"
              value={formData.github}
              error={errors.github}
              onChange={(value) => handleInputChange('github', value)}
              placeholder="https://github.com/yourusername"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Resume Section */}
      <div className="resume-section mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-file-earmark-text me-2"></i>
          Resume/CV
        </h6>
        
        <div className="upload-area mb-3">
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="d-none"
            disabled={uploadingResume || loading}
          />

          <div
            className="border border-dashed rounded p-4 text-center"
            style={{
              backgroundColor: '#f8f9fa',
              cursor: uploadingResume || loading ? 'not-allowed' : 'pointer',
              opacity: uploadingResume || loading ? 0.6 : 1
            }}
            onClick={() => !uploadingResume && !loading && resumeInputRef.current?.click()}
          >
            {uploadingResume ? (
              <div>
                <LoadingSpinner size="sm" className="mb-2" />
                <p className="mb-1">Uploading resume...</p>
              </div>
            ) : (
              <div>
                <i className="bi bi-cloud-upload fs-1 text-muted mb-2"></i>
                <p className="mb-1">Click to upload resume</p>
                <small className="text-muted">PDF, DOC, DOCX (max 10MB)</small>
              </div>
            )}
          </div>
          
          {errors.resume && (
            <div className="text-danger small mt-2">{errors.resume}</div>
          )}
        </div>

        {/* Resume List */}
        {formData.resumes.length > 0 && (
          <div className="uploaded-resumes">
            <h6 className="fw-semibold mb-2">Uploaded Resumes</h6>
            {formData.resumes.map((resume) => (
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
                        disabled={loading}
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

      {/* Form Actions */}
      <div className="form-actions d-flex justify-content-end gap-2 pt-3 border-top">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          <i className="bi bi-x-circle me-1"></i>
          Cancel
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