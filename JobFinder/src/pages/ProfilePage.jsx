// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth"; // Updated path to use the new hook location
import userService from "../services/userService"; // Updated to use userService
import JobCard from "../components/JobCard";

function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [savedJobs, setSavedJobs] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
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
                
                // Fetch saved and applied jobs
                const savedJobsData = await userService.getSavedJobs();
                setSavedJobs(savedJobsData);
                
                const appliedJobsData = await userService.getAppliedJobs();
                setAppliedJobs(appliedJobsData);
                
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

    const handleTabChange = (tab) => {
        setActiveTab(tab);
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
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <div className="list-group">
                        <button 
                            className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => handleTabChange('profile')}
                        >
                            Profile
                        </button>
                        <button 
                            className={`list-group-item list-group-item-action ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => handleTabChange('saved')}
                        >
                            Saved Jobs
                        </button>
                        <button 
                            className={`list-group-item list-group-item-action ${activeTab === 'applied' ? 'active' : ''}`}
                            onClick={() => handleTabChange('applied')}
                        >
                            Applied Jobs
                        </button>
                    </div>
                    <button className="btn btn-danger w-100 mt-3" onClick={logout}>
                        Logout
                    </button>
                </div>
                
                <div className="col-md-9">
                    {activeTab === 'profile' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Your Profile</h3>
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
                                        <button type="submit" className="btn btn-primary me-2">Save</button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <p><strong>Name:</strong> {profile.name.first} {profile.name.middle ? profile.name.middle + ' ' : ''}{profile.name.last}</p>
                                        <p><strong>Email:</strong> {profile.email}</p>
                                        <p><strong>Role:</strong> {profile.role}</p>
                                        <p><strong>Bio:</strong> {profile.bio || 'No bio provided'}</p>
                                        <p><strong>Profession:</strong> {profile.profession || 'Not specified'}</p>
                                        <button className="btn btn-primary" onClick={handleEditClick}>
                                            Edit Profile
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'saved' && (
                        <div>
                            <h3>Saved Jobs</h3>
                            {savedJobs.length === 0 ? (
                                <div className="alert alert-info">
                                    You haven't saved any jobs yet.
                                </div>
                            ) : (
                                savedJobs.map(job => (
                                    <JobCard key={job._id} job={job} />
                                ))
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'applied' && (
                        <div>
                            <h3>Applied Jobs</h3>
                            {appliedJobs.length === 0 ? (
                                <div className="alert alert-info">
                                    You haven't applied to any jobs yet.
                                </div>
                            ) : (
                                appliedJobs.map(job => (
                                    <JobCard key={job._id} job={job} />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;