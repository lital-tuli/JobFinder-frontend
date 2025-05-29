
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';
import ResumeWizard from '../components/resume/ResumeWizard/ResumeWizard';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEditClick = () => {
    setIsEditing(true);
    setError('');
  };

  const handleSave = async (profileData) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await updateProfile(profileData);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleResumeSave = (resumeData) => {
    // Add the generated resume to user's resumes
    const newResumes = [...(user.resumes || []), resumeData];
    handleSave({ ...user, resumes: newResumes });
    setShowResumeBuilder(false);
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
          
          {/* Messages */}
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

          {/* Profile Card */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-3">
              <h3 className="mb-0">
                {isEditing ? 'Edit Profile' : 'My Profile'}
              </h3>
              <div className="d-flex gap-2">
                {!isEditing && (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setShowResumeBuilder(true)}
                    >
                      <i className="bi bi-file-text me-2"></i>
                      Resume Builder
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleEditClick}
                      disabled={loading}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </button>
                  </>
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

                      <div className="mb-4">
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

                      {user.resumes && user.resumes.length > 0 && (
                        <div className="mb-4">
                          <h6 className="fw-semibold">Resumes</h6>
                          <div className="d-flex flex-wrap gap-2">
                            {user.resumes.map(resume => (
                              <a
                                key={resume.id}
                                href={resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-secondary btn-sm"
                              >
                                <i className="bi bi-file-earmark-pdf me-1"></i>
                                {resume.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Builder Modal */}
      {showResumeBuilder && (
        <ResumeWizard
          onSave={handleResumeSave}
          onClose={() => setShowResumeBuilder(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;