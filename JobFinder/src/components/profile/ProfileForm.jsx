import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormField from '../common/FormField/FormField';

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
        github: user.github || ''
      });
      setErrors({});
      setIsDirty(false);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate all fields using the same validators
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Individual field validators for real-time validation
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
          return 'Please enter a valid website URL (starting with http:// or https://)';
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
      github: formData.github.trim() || undefined
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
      {/* Basic Information */}
      <div className="mb-4">
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
              validator={(value) => validateField('firstName', value)}
              validateOnBlur={true}
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
              onChange={(value) => handleInputChange('lastName', value)}
              validator={(value) => validateField('lastName', value)}
              validateOnBlur={true}
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
              onChange={(value) => handleInputChange('email', value)}
              validator={(value) => validateField('email', value)}
              validateOnBlur={true}
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
              onChange={(value) => handleInputChange('phone', value)}
              validator={(value) => validateField('phone', value)}
              validateOnBlur={true}
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
              onChange={(value) => handleInputChange('profession', value)}
              validator={(value) => validateField('profession', value)}
              validateOnBlur={true}
              placeholder="e.g., Software Engineer"
              disabled={loading}
              helpText="Your current or desired job title"
            />
          </div>

          <div className="col-md-6 mb-3">
            <FormField
              label="Location"
              name="location"
              value={formData.location}
              error={errors.location}
              onChange={(value) => handleInputChange('location', value)}
              validator={(value) => validateField('location', value)}
              validateOnBlur={true}
              placeholder="e.g., New York, NY"
              disabled={loading}
              helpText="City, State or Remote"
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
            validator={(value) => validateField('bio', value)}
            validateOnChange={true}
            placeholder="Tell us about your professional background, key achievements, and career goals..."
            rows={4}
            helpText={`${formData.bio.length}/500 characters`}
            disabled={loading}
          />
        </div>
      </div>

      {/* Professional Links */}
      <div className="mb-4">
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
              validator={(value) => validateField('website', value)}
              validateOnBlur={true}
              placeholder="https://yourwebsite.com"
              disabled={loading}
              helpText="Your personal or professional website"
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
              validator={(value) => validateField('linkedin', value)}
              validateOnBlur={true}
              placeholder="https://linkedin.com/in/yourprofile"
              disabled={loading}
              helpText="Your LinkedIn profile URL"
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
              validator={(value) => validateField('github', value)}
              validateOnBlur={true}
              placeholder="https://github.com/yourusername"
              disabled={loading}
              helpText="Your GitHub profile URL"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="d-flex justify-content-end gap-2 pt-3 border-top">
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