// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: { first: '', middle: '', last: '' },
    email: '',
    password: '',
    confirmPassword: '',  // This will be used for validation but not sent to the API
    role: 'jobseeker',
    bio: '',
    profession: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Password matching validation 
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      // Create a new object without confirmPassword to send to API
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err) {
      setError(err.error || 'Registration failed');
      setLoading(false);
    }
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
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="first" className="form-label">First Name*</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="first" 
                      name="first" 
                      value={formData.name.first} 
                      onChange={handleNameChange} 
                      required 
                    />
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
                      className="form-control" 
                      id="last" 
                      name="last" 
                      value={formData.name.last} 
                      onChange={handleNameChange} 
                      required 
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address*</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">Password*</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      required 
                    />
                    <div className="form-text">
                      Password must be at least 6 characters.
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      required 
                    />
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
                    I agree to the <a href="/terms" className="text-decoration-none">Terms of Service</a> and <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
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