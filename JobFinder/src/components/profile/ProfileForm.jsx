import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import FormField from '../common/FormField/FormField';

const ProfileForm = ({ user, onSave, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: user?.name?.first || '',
    lastName: user?.name?.last || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profession: user?.profession || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profilePicture: user?.profilePicture || null,
    resumes: user?.resumes || []
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};

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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+]?[()]?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

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

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF or Word document');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Resume size must be less than 10MB');
      return;
    }

    const newResume = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      size: file.size,
      type: file.type
    };

    const updatedResumes = [...formData.resumes, newResume];
    handleInputChange('resumes', updatedResumes);

    if (resumeInputRef.current) {
      resumeInputRef.current.value = '';
    }
  };

  const removeResume = (resumeId) => {
    const updatedResumes = formData.resumes.filter(resume => resume.id !== resumeId);
    handleInputChange('resumes', updatedResumes);
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

  return (
    <form onSubmit={handleSubmit} className="simple-profile-form">
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

      <div className="basic-fields-section mb-4">
        <h6 className="fw-semibold mb-3">Basic Information</h6>
        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              label="First Name *"
              name="firstName"
              value={formData.firstName}
              error={errors.firstName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Last Name *"
              name="lastName"
              value={formData.lastName}
              error={errors.lastName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              error={errors.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={formData.phone}
              error={errors.phone}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
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
            onChange={handleInputChange}
            rows={4}
            maxLength={500}
          />
          <div className="form-text">
            {formData.bio.length}/500 characters
          </div>
        </div>
      </div>

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
                      style={{
                        backgroundColor: '#f8f9fa',
                        cursor: 'pointer'
                      }}
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      <i className="bi bi-cloud-upload fs-1 text-muted mb-2"></i>
                      <p className="mb-1">Click to upload resume</p>
                      <small className="text-muted">PDF, DOC, DOCX (max 10MB)</small>
                    </div>
                  </div>
          
                  {formData.resumes.length > 0 && (
                    <div className="uploaded-resumes">
                      <h6 className="fw-semibold mb-2">Uploaded Resumes</h6>
                      {formData.resumes.map((resume) => (
                        <div key={resume.id} className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
                          <div>
                            <div className="fw-medium">{resume.name}</div>
                            <small className="text-muted">
                              {(resume.size / (1024 * 1024)).toFixed(2)} MB
                            </small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeResume(resume.id)}
                            disabled={loading}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
          
                <div className="form-actions d-flex justify-content-end gap-2">
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
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
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
 
