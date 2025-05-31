// src/pages/features/authentication/register/PersonalInfoSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../../components/common/FormField/FormField';

const PersonalInfoSection = ({ 
  formData, 
  errors, 
  onChange, 
  showMiddleName = false,
  showPhoneNumber = false,
  showLocation = false,
  className = '' 
}) => {
  return (
    <div className={`personal-info-section ${className}`}>
      <div className="section-header mb-4">
        <h5 className="fw-semibold mb-2 d-flex align-items-center">
          <i className="bi bi-person-circle me-2 text-primary"></i>
          Personal Information
        </h5>
        <p className="text-muted small mb-0">
          Tell us about yourself so we can personalize your experience
        </p>
      </div>

      <div className="row">
        {/* First Name */}
        <div className={showMiddleName ? "col-md-4 mb-3" : "col-md-6 mb-3"}>
          <FormField
            label="First Name"
            name="firstName"
            type="text"
            value={formData.firstName || ''}
            error={errors.firstName}
            onChange={(value) => onChange('firstName', value)}
            placeholder="Enter your first name"
            required
          />
        </div>

        {/* Middle Name (optional) */}
        {showMiddleName && (
          <div className="col-md-4 mb-3">
            <FormField
              label="Middle Name"
              name="middleName"
              type="text"
              value={formData.middleName || ''}
              error={errors.middleName}
              onChange={(value) => onChange('middleName', value)}
              placeholder="Middle name (optional)"
            />
          </div>
        )}

        {/* Last Name */}
        <div className={showMiddleName ? "col-md-4 mb-3" : "col-md-6 mb-3"}>
          <FormField
            label="Last Name"
            name="lastName"
            type="text"
            value={formData.lastName || ''}
            error={errors.lastName}
            onChange={(value) => onChange('lastName', value)}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="mb-3">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email || ''}
          error={errors.email}
          onChange={(value) => onChange('email', value)}
          placeholder="your.email@example.com"
          helpText="This will be your username for logging in"
          required
        />
      </div>

      {/* Additional Fields Row */}
      {(showPhoneNumber || showLocation) && (
        <div className="row">
          {/* Phone Number */}
          {showPhoneNumber && (
            <div className={showLocation ? "col-md-6 mb-3" : "col-md-12 mb-3"}>
              <FormField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber || ''}
                error={errors.phoneNumber}
                onChange={(value) => onChange('phoneNumber', value)}
                placeholder="+1 (555) 123-4567"
                helpText="We'll use this to contact you about opportunities"
              />
            </div>
          )}

          {/* Location */}
          {showLocation && (
            <div className={showPhoneNumber ? "col-md-6 mb-3" : "col-md-12 mb-3"}>
              <FormField
                label="Location"
                name="location"
                type="text"
                value={formData.location || ''}
                error={errors.location}
                onChange={(value) => onChange('location', value)}
                placeholder="City, State or Remote"
                helpText="Where are you based or looking for work?"
              />
            </div>
          )}
        </div>
      )}

      {/* Date of Birth (if needed for certain applications) */}
      {'dateOfBirth' in formData && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ''}
              error={errors.dateOfBirth}
              onChange={(value) => onChange('dateOfBirth', value)}
              helpText="This information is kept private"
            />
          </div>
          <div className="col-md-6 mb-3">
            <FormField
              label="Gender"
              name="gender"
              type="select"
              value={formData.gender || ''}
              error={errors.gender}
              onChange={(value) => onChange('gender', value)}
              helpText="Optional - for diversity reporting"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </FormField>
          </div>
        </div>
      )}
    </div>
  );
};

PersonalInfoSection.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    location: PropTypes.string,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  showMiddleName: PropTypes.bool,
  showPhoneNumber: PropTypes.bool,
  showLocation: PropTypes.bool,
  className: PropTypes.string,
};

export default PersonalInfoSection;