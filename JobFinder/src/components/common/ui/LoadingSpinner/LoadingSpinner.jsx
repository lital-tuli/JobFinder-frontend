import React from 'react';
import './LoadingSpinner.module.css';

const LoadingSpinner = ({ 
  size = 'md', 
  message = 'Loading...', 
  centered = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  const content = (
    <div className={`loading-spinner ${className}`}>
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-2 text-muted">{message}</p>}
    </div>
  );

  return centered ? (
    <div className="d-flex justify-content-center align-items-center py-5">
      {content}
    </div>
  ) : content;
};

export default LoadingSpinner;