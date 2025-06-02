// ProfilePage.jsx - Fixed version with debugging
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileDisplay from '../components/profile/ProfileDisplay';
import ResumeSection from '../components/resume/ResumeSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/messages/ErrorMessage';
import SuccessMessage from '../components/common/messages/SuccessMessage';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, isAuthenticated, loading: authLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Debug logging
  useEffect(() => {
    console.log('ProfilePage state:', { isEditing, saving, user: !!user, isAuthenticated });
  }, [isEditing, saving, user, isAuthenticated]);

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  useEffect(() => {
    clearMessages();
  }, [isEditing]);

  // Clear success message after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleEditClick = () => {
    console.log('Edit button clicked'); // Debug log
    setIsEditing(true);
    clearMessages();
  };

  const handleCancel = () => {
    console.log('Cancel clicked'); // Debug log
    setIsEditing(false);
    clearMessages();
  };

  const handleSave = async (profileData) => {
    console.log('Save initiated with data:', profileData); // Debug log
    
    const { name, email } = profileData;

    if (!name?.first?.trim()) {
      setError('First name is required');
      return;
    }
    if (!name?.last?.trim()) {
      setError('Last name is required');
      return;
    }
    if (!email?.trim()) {
      setError('Email is required');
      return;
    }

    setSaving(true);
    clearMessages();

    try {
      await updateProfile(profileData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      console.log('Profile updated successfully'); // Debug log
      
    } catch (err) {
      console.error('Update failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpdate = async (resumes) => {
    console.log('Resume update initiated with:', resumes); // Debug log
    
    if (!user) {
      setError('User data not available');
      return;
    }

    setSaving(true);
    clearMessages();

    try {
      const updatedUserData = { ...user, resumes };
      await updateProfile(updatedUserData);
      setSuccessMessage('Resume updated successfully!');
      console.log('Resume updated successfully'); // Debug log
    } catch (err) {
      console.error('Resume update failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update resume');
    } finally {
      setSaving(false);
    }
  };

  // Enhanced click handler for debugging navigation
  const handleNavigationClick = (path) => {
    console.log('Navigation clicked to:', path);
  };

  if (authLoading) {
    return (
      <div className="container py-5">
        <LoadingSpinner size="lg" message="Loading your profile..." className="py-5" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4><i className="bi bi-shield-exclamation me-2"></i>Access Denied</h4>
              <p className="mb-3">Please log in to view your profile.</p>
              <div className="d-flex justify-content-center gap-2">
                <Link to="/login" className="btn btn-primary">
                  <i className="bi bi-box-arrow-in-right me-1"></i>Sign In
                </Link>
                <Link to="/register" className="btn btn-outline-primary">
                  <i className="bi bi-person-plus me-1"></i>Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <ErrorMessage error="Unable to load user profile. Please try refreshing the page." type="warning" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* Debug Info - Remove in production */}
          {import.meta.env.DEV && (
            <div className="alert alert-info small mb-3">
              <strong>Debug:</strong> isEditing: {isEditing.toString()}, saving: {saving.toString()}
            </div>
          )}

          {/* Messages */}
          {successMessage && (
            <SuccessMessage 
              message={successMessage} 
              onDismiss={() => setSuccessMessage('')} 
              className="mb-4" 
            />
          )}
          
          {error && (
            <ErrorMessage 
              error={error} 
              onDismiss={() => setError('')} 
              className="mb-4" 
            />
          )}

          {/* Profile Card */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h3 className="mb-0">
                <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-circle'} me-2 text-primary`}></i>
                {isEditing ? 'Edit Profile' : 'My Profile'}
              </h3>
              <div className="d-flex gap-2">
                {!isEditing && (
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleEditClick} 
                    disabled={saving}
                    style={{ minWidth: '120px' }} // Prevent button resize
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pencil me-2"></i>
                        Edit Profile
                      </>
                    )}
                  </button>
                )}
                {isEditing && (
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary" 
                    onClick={handleCancel} 
                    disabled={saving}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                )}
              </div>
            </div>
            <div className="card-body p-4">
              {isEditing ? (
                <ProfileForm 
                  user={user} 
                  onSave={handleSave} 
                  onCancel={handleCancel} 
                  loading={saving} 
                />
              ) : (
                <ProfileDisplay user={user} />
              )}
            </div>
          </div>

          {/* Resume Management */}
          {!isEditing && (
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                  Resume Management
                </h5>
              </div>
              <div className="card-body p-4">
                <ResumeSection 
                  user={user} 
                  onResumeUpdate={handleResumeUpdate}
                />
              </div>
            </div>
          )}

          {/* Quick Actions - Enhanced for debugging */}
          {!isEditing && (
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body p-4">
                <h5 className="mb-3">
                  <i className="bi bi-lightning me-2 text-primary"></i>
                  Quick Actions
                </h5>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Link 
                      to="/saved-jobs" 
                      className="btn btn-outline-primary w-100"
                      onClick={() => handleNavigationClick('/saved-jobs')}
                    >
                      <i className="bi bi-bookmark me-2"></i>
                      Saved Jobs
                    </Link>
                  </div>
                  <div className="col-md-4 mb-3">
                    <Link 
                      to="/applied-jobs" 
                      className="btn btn-outline-success w-100"
                      onClick={() => handleNavigationClick('/applied-jobs')}
                    >
                      <i className="bi bi-briefcase me-2"></i>
                      Applications
                    </Link>
                  </div>
                  <div className="col-md-4 mb-3">
                    <Link 
                      to="/jobs" 
                      className="btn btn-outline-info w-100"
                      onClick={() => handleNavigationClick('/jobs')}
                    >
                      <i className="bi bi-search me-2"></i>
                      Find Jobs
                    </Link>
                  </div>
                </div>
                
                {/* Additional debug buttons */}
                {import.meta.env.DEV && (
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted d-block mb-2">Debug Actions:</small>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => console.log('Current user:', user)}
                      >
                        Log User Data
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        Toggle Edit Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;