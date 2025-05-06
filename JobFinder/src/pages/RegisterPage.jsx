// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Updated import path

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: { first: '', middle: '', last: '' },
        email: '',
        password: '',
        role: 'jobseeker',  // Default role
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
        setLoading(true);
        
        try {
            await register(formData);
            navigate('/login');  // Redirect to login after successful registration
        } catch (err) {
            setError(err.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Create Account</h2>
                            
                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="first" className="form-label">First Name</label>
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
                                <div className="mb-3">
                                    <label htmlFor="middle" className="form-label">Middle Name (Optional)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="middle" 
                                        name="middle" 
                                        value={formData.name.middle} 
                                        onChange={handleNameChange} 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="last" className="form-label">Last Name</label>
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
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
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
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
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
                                        Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label">Role</label>
                                    <select 
                                        className="form-select" 
                                        id="role" 
                                        name="role" 
                                        value={formData.role} 
                                        onChange={handleChange}
                                    >
                                        <option value="jobseeker">Job Seeker</option>
                                        <option value="recruiter">Recruiter</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="bio" className="form-label">Bio (Optional)</label>
                                    <textarea 
                                        className="form-control" 
                                        id="bio" 
                                        name="bio" 
                                        rows="3"
                                        value={formData.bio} 
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="profession" className="form-label">Profession (Optional)</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="profession" 
                                        name="profession" 
                                        value={formData.profession} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100" 
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating Account...
                                        </>
                                    ) : 'Register'}
                                </button>
                            </form>
                            <div className="mt-3 text-center">
                                <p>
                                    Already have an account? <a href="/login" className="text-decoration-none">Login</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;