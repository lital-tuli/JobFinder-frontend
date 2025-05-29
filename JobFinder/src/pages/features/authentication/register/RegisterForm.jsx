import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import FormField from '../../../components/common/FormField/FormField';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
    profession: '',
    bio: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  // Password validation regex - matches your requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[!@%$#^&*\-_*]).{8,}$/;

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = 'First name cannot exceed 50 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Last name cannot exceed 50 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least 8 characters, one uppercase, one lowercase, 4 numbers, and a special character (!@%$#^&*-_*)';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }

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

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
          first: formData.firstName,
          last: formData.lastName
        },
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profession: formData.profession || 'Not specified',
        bio: formData.bio || 'No bio provided'
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

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d{4,}/.test(password)) strength++;
    if (/[!@%$#^&*\-_*]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const getStrengthColor = (strength) => {
    if (strength < 2) return 'danger';
    if (strength < 4) return 'warning';
    return 'success';
  };

  const getStrengthText = (strength) => {
    if (strength < 2) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Your Account</h2>
                <p className="text-muted">Join JobFinder and start your career journey</p>
              </div>

              {authError && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {authError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-3">Personal Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <FormField
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        error={errors.firstName}
                        onChange={(value) => handleFieldChange('firstName', value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <FormField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        error={errors.lastName}
                        onChange={(value) => handleFieldChange('lastName', value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Account Information Section */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-3">Account Information</h5>
                  
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    error={errors.email}
                    onChange={(value) => handleFieldChange('email', value)}
                    placeholder="your.email@example.com"
                    required
                  />

                  <div className="row">
                    <div className="col-md-6">
                      <FormField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        error={errors.password}
                        onChange={(value) => handleFieldChange('password', value)}
                        placeholder="Create a strong password"
                        required
                      />
                      {formData.password && (
                        <div className="mt-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">Password strength:</small>
                            <small className={`text-${getStrengthColor(passwordStrength)}`}>
                              {getStrengthText(passwordStrength)}
                            </small>
                          </div>
                          <div className="progress" style={{ height: '4px' }}>
                            <div 
                              className={`progress-bar bg-${getStrengthColor(passwordStrength)}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <FormField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        error={errors.confirmPassword}
                        onChange={(value) => handleFieldChange('confirmPassword', value)}
                        placeholder="Repeat your password"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information Section */}
                <div className="mb-4">
                  <h5 className="fw-semibold mb-3">Professional Information</h5>
                  
                  <FormField
                    label="I am a"
                    name="role"
                    type="select"
                    value={formData.role}
                    error={errors.role}
                    onChange={(value) => handleFieldChange('role', value)}
                    required
                  >
                    <option value="jobseeker">Job Seeker - Looking for opportunities</option>
                    <option value="recruiter">Recruiter/Employer - Posting jobs</option>
                  </FormField>

                  <FormField
                    label="Profession"
                    name="profession"
                    type="text"
                    value={formData.profession}
                    error={errors.profession}
                    onChange={(value) => handleFieldChange('profession', value)}
                    placeholder="e.g., Software Developer, Marketing Manager"
                    helpText="Optional - helps us personalize your experience"
                  />

                  <FormField
                    label="Bio"
                    name="bio"
                    type="textarea"
                    value={formData.bio}
                    error={errors.bio}
                    onChange={(value) => handleFieldChange('bio', value)}
                    placeholder="Tell us about yourself and your professional background..."
                    helpText={`${formData.bio.length}/500 characters`}
                    rows={3}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="mb-4">
                  <FormField
                    name="agreeToTerms"
                    type="checkbox"
                    value={formData.agreeToTerms}
                    error={errors.agreeToTerms}
                    onChange={(value) => handleFieldChange('agreeToTerms', value)}
                    label={
                      <>
                        I agree to the <Link to="/terms" className="text-decoration-none" target="_blank">Terms of Service</Link> and{' '}
                        <Link to="/privacy" className="text-decoration-none" target="_blank">Privacy Policy</Link>
                      </>
                    }
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg py-3"
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
                </div>

                {/* Login Link */}
                <div className="text-center">
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