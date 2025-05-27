// src/components/profile/ProfileForm.jsx
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

// Embedded ProfilePictureUpload component to avoid import issues
const ProfilePictureUpload = ({ currentPicture, onUpdate, loading }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onUpdate && onUpdate(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-picture-upload text-center">
      <div className="mb-3">
        {currentPicture ? (
          <img 
            src={currentPicture} 
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
        onChange={handleFileSelect}
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
          {currentPicture ? 'Change' : 'Upload'}
        </button>
        {currentPicture && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onUpdate && onUpdate(null)}
            disabled={loading}
          >
            <i className="bi bi-trash me-1"></i>
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

const ProfileForm = ({ user, onSave, onCancel, loading = false }) => {
  console.log('ProfileForm rendered with user:', user); // Debug log

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
    resumes: user?.resumes || []
  });
  
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (field, value) => {
    console.log(`Updating field ${field} with value:`, value); // Debug log
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

    if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }

    if (formData.github && !formData.github.includes('github.com')) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData); // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
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
      resumes: formData.resumes
    };
    
    console.log('Calling onSave with:', profileData); // Debug log
    
    if (onSave) {
      try {
        await onSave(profileData);
        setIsDirty(false);
      } catch (error) {
        console.error('Save failed:', error);
      }
    }
  };

  const handleCancel = () => {
    console.log('Cancel clicked'); // Debug log
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Profile Picture Section */}
        <div className="col-md-4 mb-4">
          <ProfilePictureUpload
            currentPicture={formData.profilePicture}
            onUpdate={(newPicture) => handleInputChange('profilePicture', newPicture)}
            loading={loading}
          />
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
        <label className="form-label">Professional Summary</label>
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
            className={`form-control ${errors.linkedin ? 'is-invalid' : ''}`}
            value={formData.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
          {errors.linkedin && (
            <div className="invalid-feedback">{errors.linkedin}</div>
          )}
        </div>
        
        <div className="col-md-4 mb-3">
          <label className="form-label">
            <i className="bi bi-github me-2"></i>GitHub
          </label>
          <input
            type="url"
            className={`form-control ${errors.github ? 'is-invalid' : ''}`}
            value={formData.github}
            onChange={(e) => handleInputChange('github', e.target.value)}
            placeholder="https://github.com/yourusername"
          />
          {errors.github && (
            <div className="invalid-feedback">{errors.github}</div>
          )}
        </div>
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
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  loading: PropTypes.bool
};

export default ProfileForm;