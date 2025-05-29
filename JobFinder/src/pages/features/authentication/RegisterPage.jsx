import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: { first: '', middle: '', last: '' },
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker',
    bio: '',
    profession: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  // Updated password validation - meets all requirements
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = (password.match(/\d/g) || []).length >= 4;
    const hasSpecialChar = /[!@%$#^&*\-_*]/.test(password);
    
    return {
      isValid: minLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChar,
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChar
    };
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(email),
      message: emailRegex.test(email) ? '' : 'Please enter a valid email address'
    };
  };

  // Name validation
  const validateName = (name, fieldName) => {
    const isValid = name.length >= 2;
    return {
      isValid,
      message: isValid ? '' : `${fieldName} must be at least 2 characters long`
    };
  };

  // Real-time validation
  const validateField = (name, value) => {
    let validation = { isValid: true, message: '' };

    switch (name) {
      case 'first':
      case 'last':
        validation = validateName(value, name === 'first' ? 'First name' : 'Last name');
        break;
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        const passwordCheck = validatePassword(value);
        validation = {
          isValid: passwordCheck.isValid,
          message: passwordCheck.isValid ? '' : 'Password does not meet requirements',
          details: passwordCheck
        };
        break;
      case 'confirmPassword':
        validation = {
          isValid: value === formData.password,
          message: value === formData.password ? '' : 'Passwords do not match'
        };
        break;
      default:
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: validation
    }));

    return validation.isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      name: {
        ...prev.name,
        [name]: value
      }
    }));

    // Real-time validation if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleNameBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const isFormValid = () => {
    const requiredFields = ['first', 'last', 'email', 'password', 'confirmPassword'];
    return requiredFields.every(field => {
      if (field === 'first' || field === 'last') {
        return formData.name[field] && (!fieldErrors[field] || fieldErrors[field].isValid);
      }
      return formData[field] && (!fieldErrors[field] || fieldErrors[field].isValid);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched for validation display
    setTouched({
      first: true,
      last: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validate all fields
    const firstValid = validateField('first', formData.name.first);
    const lastValid = validateField('last', formData.name.last);
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    const confirmPasswordValid = validateField('confirmPassword', formData.confirmPassword);

    if (!firstValid || !lastValid || !emailValid || !passwordValid || !confirmPasswordValid) {
      setError('Please fix the errors below before submitting');
      return;
    }
    
    setLoading(true);
    try {
      // Create a new object without confirmPassword to send to API
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/login', { 
        state: { 
          registrationSuccess: true,
          message: 'Registration successful! Please log in with your credentials.'
        } 
      });
    } catch (err) {
      setError(err.error || 'Registration failed');
      setLoading(false);
    }
  };

  // Helper function to get input class based on validation
  const getInputClass = (fieldName) => {
    const baseClass = 'form-control';
    if (!touched[fieldName]) return baseClass;
    
    const error = fieldErrors[fieldName];
    if (!error) return baseClass;
    
    return `${baseClass} ${error.isValid ? 'is-valid' : 'is-invalid'}`;
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join JobFinder and find your dream job</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Registration success message from location state */}
              {location.state?.registrationSuccess && (
                <div className="alert alert-success" role="alert">
                  Registration completed successfully! Please login to continue.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="first" className="form-label">First Name*</label>
                    <input 
                      type="text" 
                      className={getInputClass('first')}
                      id="first" 
                      name="first" 
                      value={formData.name.first} 
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      required 
                    />
                    {touched.first && fieldErrors.first && !fieldErrors.first.isValid && (
                      <div className="invalid-feedback">
                        {fieldErrors.first.message}
                      </div>
                    )}
                    {touched.first && fieldErrors.first && fieldErrors.first.isValid && (
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                    )}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="middle" className="form-label">Middle Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="middle" 
                      name="middle" 
                      value={formData.name.middle} 
                      onChange={handleNameChange} 
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="last" className="form-label">Last Name*</label>
                    <input 
                      type="text" 
                      className={getInputClass('last')}
                      id="last" 
                      name="last" 
                      value={formData.name.last} 
                      onChange={handleNameChange}
                      onBlur={handleNameBlur}
                      required 
                    />
                    {touched.last && fieldErrors.last && !fieldErrors.last.isValid && (
                      <div className="invalid-feedback">
                        {fieldErrors.last.message}
                      </div>
                    )}
                    {touched.last && fieldErrors.last && fieldErrors.last.isValid && (
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address*</label>
                  <input 
                    type="email" 
                    className={getInputClass('email')}
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required 
                  />
                  {touched.email && fieldErrors.email && !fieldErrors.email.isValid && (
                    <div className="invalid-feedback">
                      {fieldErrors.email.message}
                    </div>
                  )}
                  {touched.email && fieldErrors.email && fieldErrors.email.isValid && (
                    <div className="valid-feedback">
                      Looks good!
                    </div>
                  )}
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">Password*</label>
                    <input 
                      type="password" 
                      className={getInputClass('password')}
                      id="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required 
                    />
                    {touched.password && (
                      <div className="mt-2">
                        <div className="form-text">
                          <small className="d-block">Password must contain:</small>
                          <div className="row">
                            <div className="col-6">
                              <small className={`d-block ${fieldErrors.password?.details?.minLength ? 'text-success' : 'text-danger'}`}>
                                <i className={`bi bi-${fieldErrors.password?.details?.minLength ? 'check' : 'x'}-circle me-1`}></i>
                                At least 8 characters
                              </small>
                              <small className={`d-block ${fieldErrors.password?.details?.hasUppercase ? 'text-success' : 'text-danger'}`}>
                                <i className={`bi bi-${fieldErrors.password?.details?.hasUppercase ? 'check' : 'x'}-circle me-1`}></i>
                                One uppercase letter
                              </small>
                              <small className={`d-block ${fieldErrors.password?.details?.hasLowercase ? 'text-success' : 'text-danger'}`}>
                                <i className={`bi bi-${fieldErrors.password?.details?.hasLowercase ? 'check' : 'x'}-circle me-1`}></i>
                                One lowercase letter
                              </small>
                            </div>
                            <div className="col-6">
                              <small className={`d-block ${fieldErrors.password?.details?.hasNumbers ? 'text-success' : 'text-danger'}`}>
                                <i className={`bi bi-${fieldErrors.password?.details?.hasNumbers ? 'check' : 'x'}-circle me-1`}></i>
                                At least 4 numbers
                              </small>
                              <small className={`d-block ${fieldErrors.password?.details?.hasSpecialChar ? 'text-success' : 'text-danger'}`}>
                                <i className={`bi bi-${fieldErrors.password?.details?.hasSpecialChar ? 'check' : 'x'}-circle me-1`}></i>
                                Special character (!@%$#^&*-_*)
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
                    <input 
                      type="password" 
                      className={getInputClass('confirmPassword')}
                      id="confirmPassword" 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required 
                    />
                    {touched.confirmPassword && fieldErrors.confirmPassword && !fieldErrors.confirmPassword.isValid && (
                      <div className="invalid-feedback">
                        {fieldErrors.confirmPassword.message}
                      </div>
                    )}
                    {touched.confirmPassword && fieldErrors.confirmPassword && fieldErrors.confirmPassword.isValid && (
                      <div className="valid-feedback">
                        Passwords match!
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">I am a*</label>
                  <select 
                    className="form-select" 
                    id="role" 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange}
                  >
                    <option value="jobseeker">Job Seeker</option>
                    <option value="recruiter">Recruiter / Employer</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="profession" className="form-label">Profession</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="profession" 
                    name="profession" 
                    placeholder="e.g., Software Developer, HR Manager"
                    value={formData.profession} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="bio" className="form-label">Bio (Optional)</label>
                  <textarea 
                    className="form-control" 
                    id="bio" 
                    name="bio" 
                    rows="3"
                    placeholder="Tell us a bit about yourself"
                    value={formData.bio} 
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <div className="mb-3 form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="termsCheck" 
                    required 
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I agree to the <Link to="/terms" className="text-decoration-none">Terms of Service</Link> and <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                  </label>
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary py-2" 
                    disabled={loading || !isFormValid()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-decoration-none">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;