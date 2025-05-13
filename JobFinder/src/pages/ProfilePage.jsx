// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import userService from "../services/userService";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    profession: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        // Fetch user profile
        const profileData = await userService.getCurrentProfile();
        setProfile(profileData);
        
        // Initialize form data
        setFormData({
          bio: profileData.bio || '',
          profession: profileData.profession || ''
        });
        
      } catch (err) {
        setError(err.error || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedProfile = await userService.updateProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err) {
      setError(err.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="alert alert-warning">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <div className="mb-3">
                <div className="avatar bg-primary text-white mx-auto rounded-circle d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px', fontSize: '2.5rem'}}>
                  {profile.name?.first?.charAt(0) || 'U'}
                </div>
              </div>
              <h4>{profile.name?.first} {profile.name?.last}</h4>
              <p className="text-muted">{profile.profession || 'Not specified'}</p>
              <hr />
              <div className="text-start">
                <p>
                  <strong><i className="bi bi-envelope me-2"></i>Email:</strong><br />
                  {profile.email}
                </p>
                <p>
                  <strong><i className="bi bi-person-badge me-2"></i>Role:</strong><br />
                  {profile.role === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}
                </p>
                <button 
                  className="btn btn-danger w-100 mt-3"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Information</h5>
                {!isEditing && (
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={handleEditClick}
                  >
                    <i className="bi bi-pencil me-1"></i> Edit
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="bio" className="form-label">Bio</label>
                    <textarea 
                      className="form-control" 
                      id="bio" 
                      name="bio" 
                      rows="4"
                      value={formData.bio} 
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profession" className="form-label">Profession</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="profession" 
                      name="profession" 
                      value={formData.profession} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h6>Bio</h6>
                  <p>{profile.bio || 'No bio provided'}</p>
                  
                  <h6 className="mt-4">Profession</h6>
                  <p>{profile.profession || 'Not specified'}</p>
                  
                  {profile.role === 'jobseeker' && (
                    <div className="mt-4">
                      <h6>Resume</h6>
                      {profile.resume ? (
                        <p>Resume uploaded</p>
                      ) : (
                        <p className="text-muted">No resume uploaded yet</p>
                      )}
                      <button className="btn btn-outline-primary">
                        <i className="bi bi-upload me-1"></i> Upload Resume
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {profile.role === 'jobseeker' && (
            <div className="row mt-4">
              <div className="col-md-6 mb-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-bookmark me-2 text-primary"></i>
                      Saved Jobs
                    </h5>
                    <p className="text-muted">View jobs you've saved for later</p>
                    <a href="/saved-jobs" className="btn btn-outline-primary mt-2">View Saved Jobs</a>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="card-title">
                      <i className="bi bi-briefcase me-2 text-primary"></i>
                      Applications
                    </h5>
                    <p className="text-muted">Track your job applications</p>
                    <a href="/applied-jobs" className="btn btn-outline-primary mt-2">View Applications</a>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {profile.role === 'recruiter' && (
            <div className="card shadow-sm border-0 mt-4">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-list-ul me-2 text-primary"></i>
                  Job Listings
                </h5>
                <p className="text-muted">Manage your posted job listings</p>
                <a href="/my-listings" className="btn btn-outline-primary mt-2">View My Listings</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;