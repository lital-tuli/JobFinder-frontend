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
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let imageUrl = user.profilePicture || '';

    // Upload image if new file selected
    if (profilePictureFile) {
      const imageData = new FormData();
      imageData.append('image', profilePictureFile);

      try {
        const res = await fetch('/api/upload/profile-picture', {
          method: 'POST',
          body: imageData
        });
        const data = await res.json();
        imageUrl = data.url;
      } catch (err) {
        console.error('Image upload failed:', err);
        return;
      }
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
      profilePicture: imageUrl || undefined
    };

    Object.keys(profileData).forEach(key => {
      if (profileData[key] === undefined) delete profileData[key];
    });

    try {
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
    <form onSubmit={handleSubmit} className="profile-form">
      {/* Basic Information */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3"><i className="bi bi-person me-2"></i>Basic Information</h6>
        <div className="row">

          {/* תמונת פרופיל */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Profile Picture</label>
            {profilePicturePreview && (
              <div className="mb-2">
                <img
                  src={profilePicturePreview}
                  alt="Profile"
                  style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="form-control"
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfilePictureFile(file);
                  setProfilePicturePreview(URL.createObjectURL(file));
                  setIsDirty(true);
                }
              }}
            />
          </div>

          {/* First Name */}
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
        <h6 className="fw-semibold mb-3"><i className="bi bi-link-45deg me-2"></i>Professional Links</h6>
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

      {/* Buttons */}
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
