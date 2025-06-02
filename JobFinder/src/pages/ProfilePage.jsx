import React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';
import ResumeSection from '../components/resume/ResumeSection';
import ProfileDisplay from '../components/profile/ProfileDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/messages/ErrorMessage';
import SuccessMessage from '../components/common/messages/SuccessMessage';

const ProfilePage = () => {
  const { user, updateProfile, isAuthenticated, loading: authLoading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [resumes, setResumes] = useState(user?.resumes || []);
  const successTimerRef = useRef(null);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
  }, []);

  const handleSave = useCallback(async (profileData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile(profileData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }, [updateProfile]);

  const handleResumeUpdate = async (updatedResumes) => {
    setResumes(updatedResumes);
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile({ ...user, resumes: updatedResumes });
      setSuccessMessage('Resumes updated successfully!');
      
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      setError(err.message || 'Failed to update resumes');
    } finally {
      setLoading(false);
    }
  };

  const clearError = useCallback(() => {
    setError('');
  }, []);

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage('');
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

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
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center p-5">
                <i className="bi bi-person-x text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <h3 className="fw-bold mb-3">Authentication Required</h3>
                <p className="text-muted mb-4">
                  Please log in to view and manage your profile.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/login" className="btn btn-primary">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-outline-primary">
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </Link>
                </div>
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
            <ErrorMessage 
              error="Unable to load profile data. Please refresh the page and try again." 
              type="warning"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {successMessage && (
            <SuccessMessage 
              message={successMessage} 
              onDismiss={clearSuccessMessage}
              className="mb-4"
            />
          )}

          {error && (
            <ErrorMessage 
              error={error} 
              onDismiss={clearError}
              className="mb-4"
            />
          )}

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">
                  <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-circle'} me-2 text-primary`}></i>
                  {isEditing ? 'Edit Profile' : 'My Profile'}
                </h2>
                
                {!isEditing ? (
                  <button 
                    className="btn btn-primary"
                    onClick={handleEdit}
                    disabled={loading}
                    type="button"
                  >
                    <i className="bi bi-pencil me-2"></i>
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                    type="button"
                  >
                    <i className="bi bi-x-circle me-2"></i>
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
                  loading={loading}
                />
              ) : (
                <>
                  <ProfileDisplay user={user} />

                  <ResumeSection
                    resumes={resumes}
                    onUpdate={handleResumeUpdate}
                    loading={loading}
                  />
                </>
              )}
            </div>
          </div>

          {!isEditing && user?.role === 'jobseeker' && (
            <div className="row mt-4">
              <div className="col-md-4 mb-3">
                <Link to="/saved-jobs" className="btn btn-outline-primary w-100">
                  <i className="bi bi-bookmark me-2"></i>
                  Saved Jobs
                </Link>
              </div>
              <div className="col-md-4 mb-3">
                <Link to="/applied-jobs" className="btn btn-outline-success w-100">
                  <i className="bi bi-briefcase me-2"></i>
                  My Applications
                </Link>
              </div>
              <div className="col-md-4 mb-3">
                <Link to="/jobs" className="btn btn-outline-info w-100">
                  <i className="bi bi-search me-2"></i>
                  Find Jobs
                </Link>
              </div>
            </div>
          )}

          {!isEditing && user?.role === 'recruiter' && (
            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <Link to="/post-job" className="btn btn-outline-primary w-100">
                  <i className="bi bi-plus-circle me-2"></i>
                  Post New Job
                </Link>
              </div>
              <div className="col-md-6 mb-3">
                <Link to="/my-listings" className="btn btn-outline-success w-100">
                  <i className="bi bi-list-ul me-2"></i>
                  My Job Listings
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
