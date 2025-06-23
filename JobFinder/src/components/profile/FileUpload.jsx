import React, { useState, useRef } from 'react';
import axios from 'axios';

const FileUpload = ({ fieldName, accept, onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append(fieldName, file);

    setUploading(true);
    setProgress(0);

    try {
      const response = await axios.post(`/api/upload/${fieldName}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(progress);
        }
      });
      
      onUploadSuccess(response.data);
      setFile(null);
      setPreview(null);
    } catch (error) {
      onUploadError(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="file-upload">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />
      
      <div 
        className="upload-area"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <div className="upload-placeholder">
            <span>Click to upload {fieldName}</span>
          </div>
        )}
      </div>
      
      {file && (
        <div className="file-info">
          <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
          <button onClick={uploadFile} disabled={uploading}>
            {uploading ? `Uploading... ${progress}%` : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
};