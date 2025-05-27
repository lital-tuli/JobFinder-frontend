// src/pages/ProfilePage.jsx - Optimized version
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';

// Inline components to avoid import issues
const ProfileStats = ({ user, savedJobsCount, appliedJobsCount }) => {
    const completionPercentage = useMemo(() => {
        const fields = [
            user?.name?.first,
            user?.name?.last,
            user?.email,
            user?.profession,
            user?.bio,
            user?.location,
            user?.profilePicture
        ];
        const filledFields = fields.filter(field => field && field.trim && field.trim() !== '').length;
        return Math.round((filledFields / fields.length) * 100);
    }, [user]);

    return (
        <div className="profile-stats mb-4">
            <div className="card bg-light border-0">
                <div className="card-body">
                    <h6 className="fw-semibold mb-3">Profile Overview</h6>
                    
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Profile Completion</small>
                            <small className="fw-semibold">{completionPercentage}%</small>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                            <div 
                                className="progress-bar bg-primary" 
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="row text-center">
                        <div className="col-4">
                            <div className="border-end">
                                <h5 className="text-primary mb-0">{savedJobsCount || 0}</h5>
                                <small className="text-muted">Saved Jobs</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="border-end">
                                <h5 className="text-success mb-0">{appliedJobsCount || 0}</h5>
                                <small className="text-muted">Applications</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <h5 className="text-info mb-0">{user?.resumes?.length || 0}</h5>
                            <small className="text-muted">Resumes</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileDisplay = ({ user }) => {
    return (
        <div className="profile-display">
            <div className="row">
                <div className="col-md-3 text-center mb-4">
                    {user.profilePicture ? (
                        <img 
                            src={user.profilePicture} 
                            alt="Profile" 
                            className="rounded-circle border"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                    ) : (
                        <div 
                            className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center border"
                            style={{ width: '120px', height: '120px', fontSize: '2.5rem', color: '#6c757d' }}
                        >
                            <i className="bi bi-person"></i>
                        </div>
                    )}
                    <h5 className="mt-3 mb-1">{user.name?.first} {user.name?.last}</h5>
                    <p className="text-muted">{user.profession || 'No profession specified'}</p>
                </div>
                
                <div className="col-md-9">
                    {user.bio && (
                        <div className="mb-4">
                            <h6 className="fw-semibold">About</h6>
                            <p className="text-muted">{user.bio}</p>
                        </div>
                    )}

                    <div className="row mb-4">
                        <div className="col-sm-6 mb-3">
                            <h6 className="fw-semibold">Contact Information</h6>
                            <p className="mb-1">
                                <i className="bi bi-envelope me-2 text-primary"></i>
                                {user.email}
                            </p>
                            {user.phone && (
                                <p className="mb-1">
                                    <i className="bi bi-telephone me-2 text-primary"></i>
                                    {user.phone}
                                </p>
                            )}
                            {user.location && (
                                <p className="mb-0">
                                    <i className="bi bi-geo-alt me-2 text-primary"></i>
                                    {user.location}
                                </p>
                            )}
                        </div>
                        
                        {(user.website || user.linkedin || user.github) && (
                            <div className="col-sm-6 mb-3">
                                <h6 className="fw-semibold">Links</h6>
                                <div className="d-flex flex-column gap-2">
                                    {user.website && (
                                        <a 
                                            href={user.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="bi bi-globe me-2"></i>Website
                                        </a>
                                    )}
                                    {user.linkedin && (
                                        <a 
                                            href={user.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="bi bi-linkedin me-2"></i>LinkedIn
                                        </a>
                                    )}
                                    {user.github && (
                                        <a 
                                            href={user.github} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="bi bi-github me-2"></i>GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileForm = ({ user, onSave, onCancel, loading = false }) => {
    const [formData, setFormData] = useState({
        firstName: user?.name?.first || '',
        lastName: user?.name?.last || '',
        email: user?.email || '',
        profession: user?.profession || '',
        bio: user?.bio || '',
        phone: user?.phone || '',
        location: user?.location || '',
        website: user?.website || '',
        linkedin: user?.linkedin || '',
        github: user?.github || '',
        profilePicture: user?.profilePicture || null
    });
    
    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
        
        // Clear error for this field
        setErrors(prev => {
            if (prev[field]) {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            }
            return prev;
        });
    }, []);

    const validateForm = useCallback(() => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            newErrors.website = 'Website must start with http:// or https://';
        }

        if (formData.linkedin && !formData.linkedin.includes('linkedin.com')) {
            newErrors.linkedin = 'Please enter a valid LinkedIn URL';
        }

        if (formData.github && !formData.github.includes('github.com')) {
            newErrors.github = 'Please enter a valid GitHub URL';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const profileData = {
            name: {
                first: formData.firstName,
                last: formData.lastName
            },
            email: formData.email,
            profession: formData.profession,
            bio: formData.bio,
            phone: formData.phone,
            location: formData.location,
            website: formData.website,
            linkedin: formData.linkedin,
            github: formData.github,
            profilePicture: formData.profilePicture
        };
        
        try {
            await onSave(profileData);
            setIsDirty(false);
        } catch (error) {
            console.error('Save failed:', error);
        }
    }, [formData, validateForm, onSave]);

    const handleCancel = useCallback(() => {
        if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
            return;
        }
        onCancel();
    }, [isDirty, onCancel]);

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">First Name *</label>
                    <input
                        type="text"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                    {errors.firstName && (
                        <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                </div>
                
                <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input
                        type="text"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                    {errors.lastName && (
                        <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                </div>
                
                <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                    )}
                </div>
                
                <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+972 50-123-4567"
                    />
                </div>
                
                <div className="col-md-6 mb-3">
                    <label className="form-label">Profession</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        placeholder="e.g., Software Developer"
                    />
                </div>
                
                <div className="col-md-6 mb-3">
                    <label className="form-label">Location</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Tel Aviv, Israel"
                    />
                </div>
            </div>
            
            <div className="mb-4">
                <label className="form-label">Professional Summary</label>
                <textarea
                    className="form-control"
                    rows="4"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself, your experience, and what you're looking for..."
                    maxLength="500"
                />
                <div className="form-text">
                    {formData.bio.length}/500 characters
                </div>
            </div>
            
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <label className="form-label">
                        <i className="bi bi-globe me-2"></i>Website
                    </label>
                    <input
                        type="url"
                        className={`form-control ${errors.website ? 'is-invalid' : ''}`}
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                    />
                    {errors.website && (
                        <div className="invalid-feedback">{errors.website}</div>
                    )}
                </div>
                
                <div className="col-md-4 mb-3">
                    <label className="form-label">
                        <i className="bi bi-linkedin me-2"></i>LinkedIn
                    </label>
                    <input
                        type="url"
                        className={`form-control ${errors.linkedin ? 'is-invalid' : ''}`}
                        value={formData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                    {errors.linkedin && (
                        <div className="invalid-feedback">{errors.linkedin}</div>
                    )}
                </div>
                
                <div className="col-md-4 mb-3">
                    <label className="form-label">
                        <i className="bi bi-github me-2"></i>GitHub
                    </label>
                    <input
                        type="url"
                        className={`form-control ${errors.github ? 'is-invalid' : ''}`}
                        value={formData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/yourusername"
                    />
                    {errors.github && (
                        <div className="invalid-feedback">{errors.github}</div>
                    )}
                </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !isDirty}
                >
                    {loading ? (
                        <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Saving...</span>
                            </div>
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </form>
    );
};

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [jobStats, setJobStats] = useState({
        savedJobsCount: 0,
        appliedJobsCount: 0
    });

    // Load job statistics only once
    useEffect(() => {
        let mounted = true;
        
        const loadJobStats = async () => {
            if (!user) return;
            
            try {
                const [savedJobs, appliedJobs] = await Promise.all([
                    userService.getSavedJobs().catch(() => []),
                    userService.getAppliedJobs().catch(() => [])
                ]);
                
                if (mounted) {
                    setJobStats({
                        savedJobsCount: savedJobs.length,
                        appliedJobsCount: appliedJobs.length
                    });
                }
            } catch (err) {
                console.error('Failed to load job statistics:', err);
            }
        };

        loadJobStats();
        
        return () => {
            mounted = false;
        };
    }, [user?._id]); // Only depend on user ID to prevent unnecessary re-runs

    const handleEditClick = useCallback(() => {
        setIsEditing(true);
        setError('');
    }, []);

    const handleSave = useCallback(async (profileData) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');
        
        try {
            await updateProfile(profileData);
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            
            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setError(error.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [updateProfile]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setError('');
    }, []);

    if (!user) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 text-muted">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    {/* Success/Error Messages */}
                    {successMessage && (
                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                            <i className="bi bi-check-circle me-2"></i>
                            {successMessage}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setSuccessMessage('')}
                                aria-label="Close"
                            ></button>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setError('')}
                                aria-label="Close"
                            ></button>
                        </div>
                    )}

                    {/* Profile Stats */}
                    <ProfileStats 
                        user={user} 
                        savedJobsCount={jobStats.savedJobsCount}
                        appliedJobsCount={jobStats.appliedJobsCount}
                    />

                    {/* Profile Content */}
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
                            <h3 className="mb-0">
                                {isEditing ? 'Edit Profile' : 'My Profile'}
                            </h3>
                            {!isEditing && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleEditClick}
                                    disabled={loading}
                                >
                                    <i className="bi bi-pencil me-2"></i>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        
                        <div className="card-body p-4">
                            {isEditing ? (
                                <ProfileForm
                                    user={user}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    loading={loading}
                                />
                            ) : (
                                <ProfileDisplay user={user} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;