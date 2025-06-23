// src/pages/features/authentication/register/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import PersonalInfoSection from './PersonalInfoSection';
import AccountInfoSection from './AccountInfoSection';
import ProfessionalInfoSection from './ProfessionalInfoSection';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information - matches backend name schema
    firstName: '',
    lastName: '',
    middleName: '', // Optional field in backend
    email: '',
    
    // Account Information
    password: '',
    confirmPassword: '',
    
    // Professional Information - only fields that exist in backend
    role: 'jobseeker', // enum: ["jobseeker", "recruiter", "admin"]
    profession: '', // exists in backend
    bio: '', // exists in backend
    
    // Terms
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const { register, authError, clearError();  } = useAuth();
  const navigate = useNavigate();

  // Password validation regex - matches requirements exactly
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[!@%$#^&*\-_*]).{8,}$/;

  // Clear auth errors when component mounts or form changes
  useEffect(() => {
    clearError(); ();
    return () => clearError(); ();
  }, [clearError(); ]);

  // Comprehensive validation function
  const validateForm = (step = null) => {
    const newErrors = {};
    const stepToValidate = step || currentStep;

    // Step 1: Personal Information
    if (stepToValidate === 1 || step === null) {
      // First Name validation - matches backend: minLength: 2, maxLength: 256
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      } else if (formData.firstName.length > 256) {
        newErrors.firstName = 'First name cannot exceed 256 characters';
      }

      // Last Name validation - matches backend: minLength: 2, maxLength: 256
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      } else if (formData.lastName.length < 2) {
        newErrors.lastName = 'Last name must be at least 2 characters';
      } else if (formData.lastName.length > 256) {
        newErrors.lastName = 'Last name cannot exceed 256 characters';
      }

      // Middle Name validation - optional, maxLength: 256
      if (formData.middleName && formData.middleName.length > 256) {
        newErrors.middleName = 'Middle name cannot exceed 256 characters';
      }

      // Email validation - matches backend regex
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Step 2: Account Information
    if (stepToValidate === 2 || step === null) {
      // Password validation - backend requires minLength: 6, but we'll use stronger validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must contain at least 8 characters, one uppercase, one lowercase, 4 numbers, and a special character (!@%$#^&*-_*)';
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
      // Role validation - must be one of: ["jobseeker", "recruiter", "admin"]
      if (!formData.role) {
        newErrors.role = 'Please select your role';
      } else if (!['jobseeker', 'recruiter', 'admin'].includes(formData.role)) {
        newErrors.role = 'Invalid role selected';
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
      clearError(); ();
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

  // Handle form submission - ONLY send fields that exist in backend schema
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearError(); ();

    try {
      // Create user data object that EXACTLY matches backend schema
      const userData = {
        name: {
          first: formData.firstName.trim(),
          middle: formData.middleName.trim() || "", // Optional field, default empty string
          last: formData.lastName.trim()
        },
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role, // enum: ["jobseeker", "recruiter", "admin"]
        profession: formData.profession.trim() || "Not specified", // Default matches backend
        bio: formData.bio.trim() || "No bio provided" // Default matches backend
      };

      console.log('Sending user data:', userData); // Debug log

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
                    showMiddleName={true} // Enable middle name field
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
                      showOnlyBasicFields={true} // Only show role, profession, bio
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