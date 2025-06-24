import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const { login, error: authError, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  // ✅ FIX: Memoize clearError to prevent infinite loops
  const memoizedClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // ✅ FIX: Clear auth errors when component mounts - do NOT include clearError in dependencies
  useEffect(() => {
    clearError();
    
    return () => {
      clearError();
    };
  }, []); // ← Empty dependency array - this is the key fix!

  // Clear errors when form values change
  useEffect(() => {
    if (authError) {
      // Only clear if there's an error and user is typing
      const timer = setTimeout(() => {
        clearError();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [email, password]); // ← Don't include clearError here either

  // ✅ FIXED: Only redirect if actually authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Enhanced form validation
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
    // Don't call clearError here to avoid loops
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: '' }));
    }
    // Don't call clearError here to avoid loops
  };

  // ✅ FIXED: Proper login handling - no fake success
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any existing errors
    setFormErrors({});
    memoizedClearError(); // Use memoized version
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      const result = await login(email, password, rememberMe);
      console.log('Login successful:', result);
      
    } catch (error) {
      console.error('Login failed:', error.message || error);
      
      // Optionally set specific form errors based on error type
      if (error.message && error.message.toLowerCase().includes('email')) {
        setFormErrors(prev => ({ ...prev, email: 'Invalid email address' }));
      } else if (error.message && error.message.toLowerCase().includes('password')) {
        setFormErrors(prev => ({ ...prev, password: 'Invalid password' }));
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white text-center py-4">
                <h2 className="mb-0 fw-bold">Welcome Back</h2>
                <p className="mb-0 opacity-75">Sign in to your account</p>
              </div>
              
              <div className="card-body p-5">
                {/* ✅ FIXED: Show auth error prominently */}
                {authError && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{authError}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        id="email"
                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        required
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                    {formErrors.email && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {formErrors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        id="password"
                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                        required
                        disabled={loading}
                        autoComplete="current-password"
                      />
                    </div>
                    {formErrors.password && (
                      <div className="invalid-feedback d-block">
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {formErrors.password}
                      </div>
                    )}
                  </div>

                  <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        className="form-check-input"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={loading}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none small">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-decoration-none fw-semibold">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;