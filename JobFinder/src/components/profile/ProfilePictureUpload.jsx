import { useState } from 'react';

const ProfilePictureUpload = ({ currentPicture, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentPicture);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await fetch('/api/users/profile/picture', {
        method: 'POST',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setPreview(data.imageUrl);
        onUpdate(data.imageUrl);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-picture-upload text-center">
      <div className="mb-3">
        {preview ? (
          <img 
            src={preview} 
            alt="Profile" 
            className="rounded-circle"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
        ) : (
          <div 
            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '120px', height: '120px', fontSize: '3rem' }}
          >
            👤
          </div>
        )}
      </div>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="profilePictureInput"
      />
      
      <label 
        htmlFor="profilePictureInput" 
        className="btn btn-outline-primary"
        style={{ cursor: 'pointer' }}
      >
        {uploading ? 'Uploading...' : 'Change Picture'}
      </label>
    </div>
  );
};

export default ProfilePictureUpload;