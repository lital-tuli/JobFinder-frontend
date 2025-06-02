import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ 
  error, 
  type = 'danger', 
  onDismiss, 
  showIcon = true,
  className = '',
  id 
}) => {
  if (!error) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning': return 'bi-exclamation-triangle';
      case 'info': return 'bi-info-circle';
      case 'success': return 'bi-check-circle';
      default: return 'bi-exclamation-triangle';
    }
  };

  return (
    <div 
      className={`alert alert-${type} alert-dismissible fade show ${className}`} 
      role="alert"
      id={id}
    >
      {showIcon && (
        <i className={`bi ${getIcon()} me-2`} aria-hidden="true"></i>
      )}
      <span>{error}</span>
      {onDismiss && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onDismiss}
          aria-label="Close error message"
        ></button>
      )}
    </div>
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'info', 'success']),
  onDismiss: PropTypes.func,
  showIcon: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string
};

export default ErrorMessage;
