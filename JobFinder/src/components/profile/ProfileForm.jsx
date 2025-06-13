import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FormField from '../common/FormField/FormField';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/messages/ErrorMessage';
import SuccessMessage from '../common/messages/SuccessMessage';
import { uploadProfilePicture } from '../../services/userService';

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
  
  // Profile picture upload states
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState('');
  const [profileUploadLoading, setProfileUploadLoading] = useState(false);
  const [profileUploadError, setProfileUploadError] = useState('');
  const [profileUploadSuccess, setProfileUploadSuccess] = useState('');
  
  // File input ref
  const profileImageInputRef = useRef(null);

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
      
      // Set profile picture preview with proper URL handling
      if (user.profilePicture) {
        setProfilePicturePreview(
          user.profilePicture.startsWith('http') 
            ? user.profilePicture 
            : `/uploads/${user.profilePicture}`
        );
      }
      
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
      // Use the proper userService function
      const response = await uploadProfilePicture(file);
      
      if (response.error) {
        throw new Error(response.message || 'Failed to upload profile picture');
      }

      setProfileUploadSuccess('Profile image uploaded successfully!');
      
      // Update the preview with the new image
      if (response.profilePicture) {
        setProfilePicturePreview(`/uploads/${response.profilePicture}`);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setProfileUploadSuccess(''), 3000);
      
      return response.profilePicture;
    } catch (error) {
      setProfileUploadError(error.message || 'Failed to upload profile picture');
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
        profilePicture: imageUrl || undefined
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
          <div className="col-md-6">
            <FormField
              label="First Name"
              type="text"
              value={formData.firstName}
              onChange={(value) => handleInputChange('firstName', value)}
              error={errors.firstName}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <FormField
              label="Last Name"
              type="text"
              value={formData.lastName}
              onChange={(value) => handleInputChange('lastName', value)}
              error={errors.lastName}
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              error={errors.email}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <FormField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => handleInputChange('phone', value)}
              error={errors.phone}
              placeholder="e.g., +1-555-123-4567"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-briefcase me-2"></i>Professional Information
        </h6>
        
        <div className="row">
          <div className="col-md-6">
            <FormField
              label="Profession"
              type="text"
              value={formData.profession}
              onChange={(value) => handleInputChange('profession', value)}
              error={errors.profession}
              placeholder="e.g., Software Developer"
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <FormField
              label="Location"
              type="text"
              value={formData.location}
              onChange={(value) => handleInputChange('location', value)}
              error={errors.location}
              placeholder="e.g., New York, NY"
              disabled={loading}
            />
          </div>
        </div>
        
        <FormField
          label="Bio"
          type="textarea"
          value={formData.bio}
          onChange={(value) => handleInputChange('bio', value)}
          error={errors.bio}
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={500}
          disabled={loading}
        />
      </div>

      {/* Social Links */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">
          <i className="bi bi-globe me-2"></i>Social Links
        </h6>
        
        <FormField
          label="Website"
          type="url"
          value={formData.website}
          onChange={(value) => handleInputChange('website', value)}
          error={errors.website}
          placeholder="https://your-website.com"
          disabled={loading}
        />
        
        <div className="row">
          <div className="col-md-6">
            <FormField
              label="LinkedIn"
              type="url"
              value={formData.linkedin}
              onChange={(value) => handleInputChange('linkedin', value)}
              error={errors.linkedin}
              placeholder="https://linkedin.com/in/your-profile"
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <FormField
              label="GitHub"
              type="url"
              value={formData.github}
              onChange={(value) => handleInputChange('github', value)}
              error={errors.github}
              placeholder="https://github.com/your-username"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
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
              <LoadingSpinner size="sm" inline />
              <span className="ms-2">Saving...</span>
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