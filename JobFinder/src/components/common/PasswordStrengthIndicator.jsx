import React from 'react';
import PropTypes from 'prop-types';

const PasswordStrengthIndicator = ({ password, className = '' }) => {
  // Password validation regex - matches your requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[!@%$#^&*\-_*]).{8,}$/;

  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    const checks = [
      password.length >= 8,                    // At least 8 characters
      /[a-z]/.test(password),                 // Has lowercase
      /[A-Z]/.test(password),                 // Has uppercase
      /\d{4,}/.test(password),                // Has at least 4 numbers
      /[!@%$#^&*\-_*]/.test(password)         // Has special character
    ];
    
    strength = checks.filter(Boolean).length;
    return strength;
  };

  // Get individual requirement status
  const getRequirements = (password) => {
    return [
      {
        text: 'At least 8 characters',
        met: password.length >= 8,
        icon: 'bi-check-circle-fill',
        iconFailed: 'bi-x-circle'
      },
      {
        text: 'One lowercase letter (a-z)',
        met: /[a-z]/.test(password),
        icon: 'bi-check-circle-fill',
        iconFailed: 'bi-x-circle'
      },
      {
        text: 'One uppercase letter (A-Z)',
        met: /[A-Z]/.test(password),
        icon: 'bi-check-circle-fill',
        iconFailed: 'bi-x-circle'
      },
      {
        text: 'At least 4 numbers',
        met: /\d{4,}/.test(password),
        icon: 'bi-check-circle-fill',
        iconFailed: 'bi-x-circle'
      },
      {
        text: 'One special character (!@%$#^&*-_*)',
        met: /[!@%$#^&*\-_*]/.test(password),
        icon: 'bi-check-circle-fill',
        iconFailed: 'bi-x-circle'
      }
    ];
  };

  const strength = getPasswordStrength(password);
  const requirements = getRequirements(password);
  const isValid = passwordRegex.test(password);

  // Get strength color and text
  const getStrengthColor = (strength) => {
    if (strength === 0) return 'secondary';
    if (strength < 2) return 'danger';
    if (strength < 4) return 'warning';
    if (strength === 5) return 'success';
    return 'info';
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return 'Enter password';
    if (strength < 2) return 'Very Weak';
    if (strength < 3) return 'Weak';
    if (strength < 4) return 'Fair';
    if (strength < 5) return 'Good';
    return 'Strong';
  };

  const strengthColor = getStrengthColor(strength);
  const strengthText = getStrengthText(strength);

  // Don't render anything if no password
  if (!password) return null;

  return (
    <div className={`password-strength-indicator ${className}`}>
      {/* Strength Bar */}
      <div className="mb-2">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <small className="text-muted">Password strength:</small>
          <small className={`text-${strengthColor} fw-medium`}>
            {strengthText}
            {isValid && <i className="bi bi-check-circle-fill ms-1"></i>}
          </small>
        </div>
        <div className="progress" style={{ height: '6px' }}>
          <div 
            className={`progress-bar bg-${strengthColor} transition-all`}
            style={{ 
              width: `${(strength / 5) * 100}%`,
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }}
          ></div>
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="password-requirements">
        <div className="small text-muted mb-1">Password must contain:</div>
        <div className="row g-1">
          {requirements.map((req, index) => (
            <div key={index} className="col-12">
              <div className={`d-flex align-items-center small ${req.met ? 'text-success' : 'text-muted'}`}>
                <i className={`bi ${req.met ? req.icon : req.iconFailed} me-2`}></i>
                <span style={{ fontSize: '0.75rem' }}>{req.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Status */}
      {password && (
        <div className="mt-2">
          {isValid ? (
            <div className="alert alert-success py-1 px-2 mb-0">
              <small>
                <i className="bi bi-shield-check me-1"></i>
                Password meets all requirements
              </small>
            </div>
          ) : (
            <div className="alert alert-warning py-1 px-2 mb-0">
              <small>
                <i className="bi bi-exclamation-triangle me-1"></i>
                Please satisfy all requirements above
              </small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

PasswordStrengthIndicator.propTypes = {
  password: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default PasswordStrengthIndicator;