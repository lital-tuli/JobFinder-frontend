
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

// Simple ProfilePictureUpload component (since the import might be failing)
const ProfilePictureUpload = ({ currentPicture, onUpdate, loading }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onUpdate && onUpdate(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-picture-upload text-center">
      <div className="mb-3">
        {currentPicture ? (
          <img 
            src={currentPicture} 
            alt="Profile" 
            className="rounded-circle border shadow-sm"
            style={{ 
              width: '120px', 
              height: '120px', 
              objectFit: 'cover',
              cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current?.click()}
          />
        ) : (
          <div 
            className="bg-light rounded-circle border shadow-sm mx-auto d-flex align-items-center justify-content-center"
            style={{ 
              width: '120px', 
              height: '120px', 
              fontSize: '2.5rem', 
              color: '#6c757d',
              cursor: 'pointer'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <i className="bi bi-person"></i>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="d-none"
      />

      <div className="d-flex justify-content-center gap-2">
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <i className="bi bi-camera me-1"></i>
          {currentPicture ? 'Change' : 'Upload'}
        </button>
        {currentPicture && (
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onUpdate && onUpdate(null)}
            disabled={loading}
          >
            <i className="bi bi-trash me-1"></i>
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

ProfilePictureUpload.propTypes = {
  currentPicture: PropTypes.string,
  onUpdate: PropTypes.func,
  loading: PropTypes.bool
};

export default ProfilePictureUpload;
