// pages/features/authentication/LoginPage.jsx - Fixed Version
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const { login, authError, clearAuthError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  // Clear auth errors when component unmounts or when form values change
  useEffect(() => {
    clearAuthError();
    
    return () => {
      clearAuthError();
    };
  }, [email, password, clearAuthError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Basic validation
  const validateForm = () => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear field errors when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: '' }));
    }
    if (authError) {
      clearAuthError();
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: '' }));
    }
    if (authError) {
      clearAuthError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing errors
    setFormErrors({});
    clearAuthError();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Attempt login - login function now throws on error
      const result = await login(email, password, rememberMe);
      
      // If we get here, login was successful
      console.log('Login successful:', result);
      
      // The redirect will happen automatically via the useEffect above
      // when isAuthenticated changes to true
      
    } catch (error) {
      // Login failed - error is already set in AuthContext
      console.error('Login failed:', error.message || error);
      
      // Optionally set specific form errors based on error type
      if (error.message && error.message.toLowerCase().includes('email')) {
        setFormErrors({ email: 'Invalid email address' });
      } else if (error.message && error.message.toLowerCase().includes('password')) {
        setFormErrors({ password: 'Invalid password' });
      }
      // authError will be set by AuthContext, so we don't need to set it here
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to continue to JobFinder</p>
              </div>
              
              {/* Show auth error from AuthContext */}
              {authError && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {authError}
                </div>
              )}
              
              {/* Show registration success message */}
              {location.state?.registrationSuccess && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {location.state.message || 'Registration successful! Please log in with your credentials.'}
                </div>
              )}
              
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    disabled={loading}
                    required
                    autoComplete="email"
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">
                      {formErrors.email}
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Link 
                      to="/forgot-password" 
                      className="small text-decoration-none"
                      tabIndex={loading ? -1 : 0}
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    required
                    autoComplete="current-password"
                  />
                  {formErrors.password && (
                    <div className="invalid-feedback">
                      {formErrors.password}
                    </div>
                  )}
                </div>
                
                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-decoration-none fw-semibold"
                    tabIndex={loading ? -1 : 0}
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
              
              {/* Development helper - remove in production */}
              {import.meta.env.DEV && (
                <div className="mt-4 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Dev Mode:</strong> Email format required. Password must be 6+ characters.
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;