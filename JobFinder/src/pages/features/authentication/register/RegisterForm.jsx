// src/pages/features/authentication/register/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import PersonalInfoSection from './PersonalInfoSection';
import AccountInfoSection from './AccountInfoSection';
import ProfessionalInfoSection from './ProfessionalInfoSection';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    
    // Account Information
    password: '',
    confirmPassword: '',
    
    // Professional Information
    role: 'jobseeker',
    profession: '',
    industry: '',
    bio: '',
    jobTypes: {},
    preferredLocation: '',
    companySize: '',
    companyWebsite: '',
    hiringTimeline: '',
    
    // Terms
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const { register, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  // Password validation regex - matches requirements exactly
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[!@%$#^&*\-_*]).{8,}$/;

  // Clear auth errors when component mounts or form changes
  useEffect(() => {
    clearAuthError();
    return () => clearAuthError();
  }, [clearAuthError]);

  // Comprehensive validation function
  const validateForm = (step = null) => {
    const newErrors = {};
    const stepToValidate = step || currentStep;

    // Step 1: Personal Information
    if (stepToValidate === 1 || step === null) {
      // First Name validation
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      } else if (formData.firstName.length > 50) {
        newErrors.firstName = 'First name cannot exceed 50 characters';
      } else if (!/^[a-zA-Z\s'.-]+$/.test(formData.firstName)) {
        newErrors.firstName = 'First name can only contain letters, spaces, apostrophes, periods, and hyphens';
      }

      // Last Name validation
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      } else if (formData.lastName.length > 50) {
        newErrors.lastName = 'Last name cannot exceed 50 characters';
      } else if (!/^[a-zA-Z\s'.-]+$/.test(formData.lastName)) {
        newErrors.lastName = 'Last name can only contain letters, spaces, apostrophes, periods, and hyphens';
      }

      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (formData.email.length > 100) {
        newErrors.email = 'Email cannot exceed 100 characters';
      }
    }

    // Step 2: Account Information
    if (stepToValidate === 2 || step === null) {
      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must contain at least 8 characters, one uppercase, one lowercase, 4 numbers, and a special character (!@%$#^&*-_*)';
      } else if (formData.password.length > 128) {
        newErrors.password = 'Password cannot exceed 128 characters';
      }

      // Confirm Password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords must match';
      }
    }

    // Step 3: Professional Information & Terms
    if (stepToValidate === 3 || step === null) {
      // Role validation
      if (!formData.role) {
        newErrors.role = 'Please select your role';
      }

      // Bio validation (optional but if provided)
      if (formData.bio && formData.bio.length > 500) {
        newErrors.bio = 'Bio cannot exceed 500 characters';
      }

      // Profession validation (optional but if provided)
      if (formData.profession && formData.profession.length > 100) {
        newErrors.profession = 'Profession cannot exceed 100 characters';
      }

      // Company website validation (for recruiters)
      if (formData.role === 'recruiter' && formData.companyWebsite) {
        const urlPattern = /^https?:\/\/.+\..+/;
        if (!urlPattern.test(formData.companyWebsite)) {
          newErrors.companyWebsite = 'Please enter a valid website URL';
        }
      }

      // Terms agreement validation
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form field changes
  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear auth error when user makes changes
    if (authError) {
      clearAuthError();
    }
  };

  // Handle step navigation
  const handleNext = () => {
    if (validateForm(currentStep)) {
      setCurrentStep(prev => Math.min(totalSteps, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearAuthError();

    try {
      const userData = {
        name: {
          first: formData.firstName.trim(),
          last: formData.lastName.trim()
        },
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        profession: formData.profession.trim() || 'Not specified',
        bio: formData.bio.trim() || 'No bio provided',
        industry: formData.industry || undefined,
        preferences: {
          jobTypes: formData.jobTypes || {},
          preferredLocation: formData.preferredLocation || undefined,
        },
        ...(formData.role === 'recruiter' && {
          companyInfo: {
            size: formData.companySize || undefined,
            website: formData.companyWebsite || undefined,
            hiringTimeline: formData.hiringTimeline || undefined
          }
        })
      };

      await register(userData);
      navigate('/login', { 
        state: { 
          registrationSuccess: true, 
          message: 'Registration successful! Please log in with your credentials.' 
        } 
      });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get step progress percentage
  const getProgressPercentage = () => {
    return (currentStep / totalSteps) * 100;
  };

  // Get step title
  const getStepTitle = (step) => {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Account Security';
      case 3: return 'Professional Details';
      default: return '';
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Your Account</h2>
                <p className="text-muted">Join JobFinder and start your career journey</p>
              </div>

              {/* Progress Indicator */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Step {currentStep} of {totalSteps}</small>
                  <small className="text-muted">{getStepTitle(currentStep)}</small>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Error Display */}
              {authError && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {authError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <PersonalInfoSection
                    formData={formData}
                    errors={errors}
                    onChange={handleFieldChange}
                  />
                )}

                {/* Step 2: Account Information */}
                {currentStep === 2 && (
                  <AccountInfoSection
                    formData={formData}
                    errors={errors}
                    onChange={handleFieldChange}
                    showPasswordStrength={true}
                    showConfirmPassword={true}
                  />
                )}

                {/* Step 3: Professional Information */}
                {currentStep === 3 && (
                  <>
                    <ProfessionalInfoSection
                      formData={formData}
                      errors={errors}
                      onChange={handleFieldChange}
                      showCompanyInfo={false}
                      showSkills={false}
                      showExperience={false}
                      showSalaryExpectations={false}
                    />

                    {/* Terms and Conditions */}
                    <div className="border-top pt-4 mt-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className={`form-check-input ${errors.agreeToTerms ? 'is-invalid' : ''}`}
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={(e) => handleFieldChange('agreeToTerms', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="agreeToTerms">
                          I agree to the <Link to="/terms" className="text-decoration-none" target="_blank">Terms of Service</Link> and{' '}
                          <Link to="/privacy" className="text-decoration-none" target="_blank">Privacy Policy</Link>
                        </label>
                        {errors.agreeToTerms && (
                          <div className="invalid-feedback d-block">
                            {errors.agreeToTerms}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handlePrevious}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Previous
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      type="button"
                      className="btn btn-primary px-4"
                      onClick={handleNext}
                      disabled={loading}
                    >
                      Next
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account? <Link to="/login" className="text-decoration-none">Sign In</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;