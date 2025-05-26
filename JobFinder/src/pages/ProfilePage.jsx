// src/pages/ProfilePage.jsx - Refactored and Simplified
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileForm from '../components/Profile/ProfileForm';
import ProfileDisplay from '../components/Profile/ProfileDisplay';

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

  // Load job statistics
  useEffect(() => {
    const loadJobStats = async () => {
      if (!user) return;
      
      try {
        const [savedJobs, appliedJobs] = await Promise.all([
          userService.getSavedJobs().catch(() => []),
          userService.getAppliedJobs().catch(() => [])
        ]);
        
        setJobStats({
          savedJobsCount: savedJobs.length,
          appliedJobsCount: appliedJobs.length
        });
      } catch (err) {
        console.error('Failed to load job statistics:', err);
      }
    };

    loadJobStats();
  }, [user]);

  const handleSave = async (profileData) => {
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
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

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
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil me-2"></i>Edit Profile
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