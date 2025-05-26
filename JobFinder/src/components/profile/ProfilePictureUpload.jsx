import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const ProfilePictureUpload = ({ currentPicture, onUpdate, loading }) => {
    const [previewUrl, setPreviewUrl] = useState(currentPicture);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            setPreviewUrl(imageUrl);
            
            // For demo purposes, we'll just update with the data URL
            // In a real app, you'd upload to a server or cloud storage
            onUpdate && onUpdate(imageUrl);
        };
        reader.readAsDataURL(file);
    };

    const handleRemovePicture = () => {
        setPreviewUrl(null);
        onUpdate && onUpdate(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="profile-picture-upload text-center">
            <div className="mb-3">
                {previewUrl ? (
                    <img 
                        src={previewUrl} 
                        alt="Profile" 
                        className="rounded-circle border shadow-sm"
                        style={{ 
                            width: '120px', 
                            height: '120px', 
                            objectFit: 'cover',
                            cursor: 'pointer'
                        }}
                        onClick={triggerFileSelect}
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
                        onClick={triggerFileSelect}
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
                    onClick={triggerFileSelect}
                    disabled={loading}
                >
                    <>
                        <i className="bi bi-camera me-1"></i>
                        {previewUrl ? 'Change' : 'Upload'}
                    </>
                </button>
                {previewUrl && (
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleRemovePicture}
                        disabled={loading}
                    >
                        <i className="bi bi-trash me-1"></i>
                        Remove
                    </button>
                )}
            </div>

            <p className="text-muted small mt-2 mb-0">
                JPG, PNG or GIF (Max 5MB)
            </p>
        </div>
    );
};

ProfilePictureUpload.propTypes = {
    currentPicture: PropTypes.string,
    onUpdate: PropTypes.func,
    loading: PropTypes.bool
};

export default ProfilePictureUpload;