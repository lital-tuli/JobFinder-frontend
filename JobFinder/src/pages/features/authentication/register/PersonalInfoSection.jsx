import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../../components/common/FormField/FormField';

const PersonalInfoSection = ({ 
  formData, 
  errors, 
  onChange, 
  showMiddleName = false,
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
    </div>
  );
};

PersonalInfoSection.propTypes = {
  formData: PropTypes.shape({
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  showMiddleName: PropTypes.bool,
  className: PropTypes.string,
};

export default PersonalInfoSection;