import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../../components/common/FormField/FormField';
import PasswordStrengthIndicator from '../../../../components/common/PasswordStrengthIndicator';

const AccountInfoSection = ({ 
  formData, 
  errors, 
  onChange, 
  showPasswordStrength = true,
  showConfirmPassword = true,
  isEditMode = false,
  className = '' 
}) => {
  return (
    <div className={`account-info-section ${className}`}>
      <div className="section-header mb-4">
        <h5 className="fw-semibold mb-2 d-flex align-items-center">
          <i className="bi bi-shield-lock me-2 text-primary"></i>
          Account Security
        </h5>
        <p className="text-muted small mb-0">
          {isEditMode 
            ? "Update your login credentials" 
            : "Create a secure password for your account"
          }
        </p>
      </div>

      {/* Password Fields */}
      <div className="row">
        <div className={showConfirmPassword ? "col-md-6 mb-3" : "col-md-12 mb-3"}>
          <FormField
            label={isEditMode ? "New Password" : "Password"}
            name="password"
            type="password"
            value={formData.password || ''}
            error={errors.password}
            onChange={(value) => onChange('password', value)}
            placeholder={isEditMode ? "Enter new password" : "Create a secure password"}
            required={!isEditMode}
            helpText={isEditMode ? "Leave blank to keep current password" : "Must be at least 8 characters with uppercase, lowercase, 4 numbers, and special character"}
          />
          
          {/* Password Strength Indicator */}
          {showPasswordStrength && formData.password && (
            <div className="mt-2">
              <PasswordStrengthIndicator password={formData.password} />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        {showConfirmPassword && (
          <div className="col-md-6 mb-3">
            <FormField
              label={isEditMode ? "Confirm New Password" : "Confirm Password"}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword || ''}
              error={errors.confirmPassword}
              onChange={(value) => onChange('confirmPassword', value)}
              placeholder="Repeat your password"
              required={!isEditMode || (isEditMode && formData.password)}
            />
            
            {/* Password Match Indicator */}
            {formData.password && formData.confirmPassword && (
              <div className="mt-2">
                {formData.password === formData.confirmPassword ? (
                  <div className="alert alert-success py-1 px-2 mb-0">
                    <small>
                      <i className="bi bi-check-circle me-1"></i>
                      Passwords match
                    </small>
                  </div>
                ) : (
                  <div className="alert alert-warning py-1 px-2 mb-0">
                    <small>
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Passwords don't match
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Password Requirements Info */}
      {!showPasswordStrength && (
        <div className="alert alert-info mb-3">
          <small>
            <strong>Password Requirements:</strong>
            <ul className="mb-0 mt-1">
              <li>At least 8 characters long</li>
              <li>One uppercase letter (A-Z)</li>
              <li>One lowercase letter (a-z)</li>
              <li>At least 4 numbers (0-9)</li>
              <li>One special character (!@%$#^&*-_*)</li>
            </ul>
          </small>
        </div>
      )}

      {/* Two-Factor Authentication (if supported) */}
      {'enableTwoFactor' in formData && (
        <div className="mb-3">
          <FormField
            name="enableTwoFactor"
            type="checkbox"
            value={formData.enableTwoFactor || false}
            onChange={(value) => onChange('enableTwoFactor', value)}
            label="Enable Two-Factor Authentication (Recommended)"
            helpText="Add an extra layer of security to your account"
          />
        </div>
      )}

      {/* Security Questions (if used) */}
      {'securityQuestion' in formData && (
        <div className="row">
          <div className="col-md-6 mb-3">
            <FormField
              label="Security Question"
              name="securityQuestion"
              type="select"
              value={formData.securityQuestion || ''}
              error={errors.securityQuestion}
              onChange={(value) => onChange('securityQuestion', value)}
              required
            >
              <option value="">Select a security question</option>
              <option value="pet">What was the name of your first pet?</option>
              <option value="school">What elementary school did you attend?</option>
              <option value="city">In what city were you born?</option>
              <option value="mother">What is your mother's maiden name?</option>
              <option value="car">What was the make of your first car?</option>
              <option value="book">What is your favorite book?</option>
            </FormField>
          </div>
          <div className="col-md-6 mb-3">
            <FormField
              label="Security Answer"
              name="securityAnswer"
              type="text"
              value={formData.securityAnswer || ''}
              error={errors.securityAnswer}
              onChange={(value) => onChange('securityAnswer', value)}
              placeholder="Enter your answer"
              helpText="Keep this answer private and memorable"
              required
            />
          </div>
        </div>
      )}

      {/* Newsletter/Marketing Preferences */}
      {'marketingEmails' in formData && (
        <div className="border-top pt-3 mt-3">
          <h6 className="fw-semibold mb-3">Communication Preferences</h6>
          <FormField
            name="marketingEmails"
            type="checkbox"
            value={formData.marketingEmails || false}
            onChange={(value) => onChange('marketingEmails', value)}
            label="Send me job alerts and career tips via email"
            helpText="You can unsubscribe at any time"
          />
          
          {'smsNotifications' in formData && (
            <FormField
              name="smsNotifications"
              type="checkbox"
              value={formData.smsNotifications || false}
              onChange={(value) => onChange('smsNotifications', value)}
              label="Send me urgent job notifications via SMS"
              helpText="Only for time-sensitive opportunities"
            />
          )}
        </div>
      )}
    </div>
  );
};

AccountInfoSection.propTypes = {
  formData: PropTypes.shape({
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    enableTwoFactor: PropTypes.bool,
    securityQuestion: PropTypes.string,
    securityAnswer: PropTypes.string,
    marketingEmails: PropTypes.bool,
    smsNotifications: PropTypes.bool,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  showPasswordStrength: PropTypes.bool,
  showConfirmPassword: PropTypes.bool,
  isEditMode: PropTypes.bool,
  className: PropTypes.string,
};

export default AccountInfoSection;