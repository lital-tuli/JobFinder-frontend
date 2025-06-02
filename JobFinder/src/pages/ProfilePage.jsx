import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';
import ProfileDisplay from '../components/profile/ProfileDisplay';
import ProfileStats from '../components/profile/ProfileStats';
import ResumeSection from '../components/resume/ResumeSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/messages/ErrorMessage';
import SuccessMessage from '../components/common/messages/SuccessMessage';
import userService from '../services/userService';

const ProfilePage = () => {
  const { user, updateProfile, isAuthenticated, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch additional user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const [savedJobs, appliedJobs] = await Promise.allSettled([
          userService.getSavedJobs(),
          userService.getAppliedJobs()
        ]);

        if (savedJobs.status === 'fulfilled') {
          setSavedJobsCount(Array.isArray(savedJobs.value) ? savedJobs.value.length : 0);
        }

        if (appliedJobs.status === 'fulfilled') {
          setAppliedJobsCount(Array.isArray(appliedJobs.value) ? appliedJobs.value.length : 0);
        }
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
      }
    };

    fetchUserStats();
  }, [isAuthenticated, user, refreshKey]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError('');
    setSuccessMessage('');
  };

  const handleSave = async (profileData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Validate required fields
      if (!profileData.name?.first?.trim()) {
        throw new Error('First name is required');
      }
      if (!profileData.name?.last?.trim()) {
        throw new Error('Last name is required');
      }
      if (!profileData.email?.trim()) {
        throw new Error('Email is required');
      }

      await updateProfile(profileData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setRefreshKey(prev => prev + 1); // Trigger stats refresh
      
      // Auto-hide success message
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Profile update failed:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccessMessage('');
  };

  const handleResumeUpdate = async (resumes) => {
    try {
      const updatedProfile = {
        ...user,
        resumes
      };
      await updateProfile(updatedProfile);
      setSuccessMessage('Resume updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message || 'Failed to update resume');
    }
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="container py-5">
        <LoadingSpinner 
          size="lg" 
          message="Loading your profile..." 
          className="py-5"
        />
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4>Access Denied</h4>
              <p>Please log in to view your profile.</p>
              <div className="d-flex justify-content-center gap-2">
                <a href="/login" className="btn btn-primary">Sign In</a>
                <a href="/register" className="btn btn-outline-primary">Create Account</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No user data
  if (!user) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <ErrorMessage 
              error="Unable to load user profile. Please try refreshing the page."
              type="warning"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* Success Message */}
          {successMessage && (
            <SuccessMessage 
              message={successMessage} 
              onDismiss={() => setSuccessMessage('')}
              className="mb-4"
            />
          )}

          {/* Error Message */}
          {error && (
            <ErrorMessage 
              error={error} 
              onDismiss={() => setError('')}
              className="mb-4"
            />
          )}

          {/* Profile Stats */}
          <ProfileStats 
            user={user}
            savedJobsCount={savedJobsCount}
            appliedJobsCount={appliedJobsCount}
          />

          {/* Main Profile Card */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h3 className="mb-0">
                {isEditing ? (
                  <>
                    <i className="bi bi-pencil-square me-2 text-primary"></i>
                    Edit Profile
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    My Profile
                  </>
                )}
              </h3>
              
              <div className="d-flex gap-2">
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

          {/* Resume Section - Only show when not editing main profile */}
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

          {/* Profile Tips */}
          {!isEditing && (
            <div className="mt-4">
              <div className="card bg-light border-0">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-lightbulb text-warning me-2"></i>
                    Profile Tips
                  </h5>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <h6 className="fw-semibold">Complete Your Profile</h6>
                      <p className="text-muted small mb-0">
                        A complete profile gets more views from recruiters and increases your chances of being found.
                      </p>
                    </div>
                    <div className="col-md-4 mb-3">
                      <h6 className="fw-semibold">Upload Your Resume</h6>
                      <p className="text-muted small mb-0">
                        Keep your resume up to date and upload multiple versions for different types of positions.
                      </p>
                    </div>
                    <div className="col-md-4 mb-3">
                      <h6 className="fw-semibold">Professional Photo</h6>
                      <p className="text-muted small mb-0">
                        A professional profile picture makes your profile more trustworthy and engaging.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;