// ProfilePage.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileDisplay from '../components/profile/ProfileDisplay';
import ProfileStats from '../components/profile/ProfileStats';
import ResumeSection from '../components/resume/ResumeSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/messages/ErrorMessage';
import SuccessMessage from '../components/common/messages/SuccessMessage';
import userService from '../services/userService';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, isAuthenticated, loading: authLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [userStats, setUserStats] = useState({
    savedJobsCount: 0,
    appliedJobsCount: 0,
    loading: false,
    errorMessage: null
  });

  const clearMessages = () => {
    setError('');
    setSuccessMessage('');
  };

  useEffect(() => {
    clearMessages();
  }, [isEditing]);

  const fetchUserStats = useCallback(async () => {
    if (!isAuthenticated || !user?.email) return;

    setUserStats(prev => ({ ...prev, loading: true, errorMessage: null }));
    try {
      const [savedJobsResult, appliedJobsResult] = await Promise.allSettled([
        userService.getSavedJobs(),
        userService.getAppliedJobs()
      ]);

      const savedJobsCount = savedJobsResult.status === 'fulfilled' && Array.isArray(savedJobsResult.value) ? savedJobsResult.value.length : 0;
      const appliedJobsCount = appliedJobsResult.status === 'fulfilled' && Array.isArray(appliedJobsResult.value) ? appliedJobsResult.value.length : 0;

      setUserStats({
        savedJobsCount,
        appliedJobsCount,
        loading: false,
        errorMessage: null
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setUserStats(prev => ({ ...prev, loading: false, errorMessage: 'Failed to load statistics' }));
    }
  }, [isAuthenticated, user?.email]);

  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleEditClick = () => {
    setIsEditing(true);
    clearMessages();
  };

  const handleCancel = () => {
    setIsEditing(false);
    clearMessages();
  };

  const handleSave = async (profileData) => {
    const { name, email } = profileData;

    if (!name?.first?.trim()) return setError('First name is required');
    if (!name?.last?.trim()) return setError('Last name is required');
    if (!email?.trim()) return setError('Email is required');

    setSaving(true);
    clearMessages();

    try {
      await updateProfile(profileData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      fetchUserStats();
    } catch (err) {
      console.error('Update failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpdate = async (resumes) => {
    if (!user) return setError('User data not available');

    setSaving(true);
    clearMessages();

    try {
      await updateProfile({ ...user, resumes });
      setSuccessMessage('Resume updated successfully!');
    } catch (err) {
      console.error('Resume update failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update resume');
    } finally {
      setSaving(false);
    }
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
          {successMessage && <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage('')} className="mb-4" />}
          {error && <ErrorMessage error={error} onDismiss={() => setError('')} className="mb-4" />}

          <div className="mb-4">
            {userStats.loading ? (
              <div className="card shadow-sm border-0">
                <div className="card-body text-center py-4">
                  <LoadingSpinner size="sm" message="Loading statistics..." />
                </div>
              </div>
            ) : userStats.errorMessage ? (
              <div className="card shadow-sm border-0">
                <div className="card-body text-center py-4">
                  <ErrorMessage error={userStats.errorMessage} type="warning" showIcon={false} />
                  <button className="btn btn-outline-primary btn-sm mt-2" onClick={fetchUserStats}>
                    <i className="bi bi-arrow-clockwise me-1"></i>Retry
                  </button>
                </div>
              </div>
            ) : (
              <ProfileStats user={user} savedJobsCount={userStats.savedJobsCount} appliedJobsCount={userStats.appliedJobsCount} />
            )}
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h3 className="mb-0">
                <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-circle'} me-2 text-primary`}></i>
                {isEditing ? 'Edit Profile' : 'My Profile'}
              </h3>
              <div className="d-flex gap-2">
                {!isEditing && (
                  <button type="button" className="btn btn-primary" onClick={handleEditClick} disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...</> : <><i className="bi bi-pencil me-2"></i>Edit Profile</>}
                  </button>
                )}
                {isEditing && (
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCancel} disabled={saving}>
                    <i className="bi bi-x-circle me-1"></i>Cancel
                  </button>
                )}
              </div>
            </div>
            <div className="card-body p-4">
              {isEditing ? <ProfileForm user={user} onSave={handleSave} onCancel={handleCancel} loading={saving} /> : <ProfileDisplay user={user} />}
            </div>
          </div>

          {!isEditing && (
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0"><i className="bi bi-file-earmark-text me-2 text-primary"></i>Resume Management</h5>
              </div>
              <div className="card-body p-4">
                <ResumeSection user={user} onResumeUpdate={handleResumeUpdate} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
