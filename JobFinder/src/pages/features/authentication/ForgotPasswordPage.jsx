// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const response = await axios.post(`${API_URL}/users/forgot-password`, {
        email: email.trim()
      });

      setMessage(response.data.message || 'Password reset link sent to your email');
      setEmailSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data || 
        'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 text-center">
                <div className="mb-4">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                </div>
                <h2 className="fw-bold mb-3">Check Your Email</h2>
                <p className="text-muted mb-4">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-muted mb-4">
                  Please check your email and click the link to reset your password. 
                  The link will expire in 1 hour.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/login" className="btn btn-primary">
                    Back to Login
                  </Link>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setEmailSent(false);
                      setEmail('');
                      setMessage('');
                    }}
                  >
                    Send Another Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Forgot Password?</h2>
                <p className="text-muted">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {message && (
                <div className="alert alert-success" role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary py-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending Reset Link...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <p className="mb-0">
                  Remember your password? <Link to="/login" className="text-decoration-none">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;