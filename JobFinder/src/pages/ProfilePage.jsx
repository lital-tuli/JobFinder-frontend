import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import api from '../services/api';

function ProfilePage() {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ bio: '', profession: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const response = await api.get(`/users/${user._id}`);
                setProfile(response.data);
                setFormData({ bio: response.data.bio || '', profession: response.data.profession || '' });
            } catch (err) {
                setError(err.error || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
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
            await api.put(`/users/${user._id}`, formData);
            // Refresh profile after update
            const response = await api.get(`/users/${user._id}`);
            setProfile(response.data);
            setIsEditing(false);
        } catch (err) {
            setError(err.error || 'Failed to update profile');
        }
    };


    if (loading) return <p>Loading profile...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!user) return <p>Please login to view your profile.</p>;
    if (!profile) return <p>Profile not found.</p>;

    return (
        <div className="container">
            <h2 className="mt-4">Profile</h2>
            <p><strong>Name:</strong> {profile.name.first} {profile.name.last}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="bio" className="form-label">Bio</label>
                        <textarea className="form-control" id="bio" name="bio" value={formData.bio} onChange={handleChange}></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="profession" className="form-label">Profession</label>
                        <input type="text" className="form-control" id="profession" name="profession" value={formData.profession} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <>
                    <p><strong>Bio:</strong> {profile.bio || 'N/A'}</p>
                    <p><strong>Profession:</strong> {profile.profession || 'N/A'}</p>
                    <button className="btn btn-primary me-2" onClick={handleEditClick}>Edit</button>
                </>
            )}

            <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
    );
}

export default ProfilePage;
