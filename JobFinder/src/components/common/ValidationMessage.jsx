// src/components/common/ValidationMessage/ValidationMessage.jsx
import React from 'react';
import PropTypes from 'prop-types';

const ValidationMessage = ({ error, success, className = '' }) => {
  if (!error && !success) return null;

  if (error) {
    return (
      <div className={`invalid-feedback d-block ${className}`}>
        <i className="bi bi-exclamation-circle me-1"></i>
        {error}
      </div>
    );
  }

  if (success) {
    return (
      <div className={`valid-feedback d-block ${className}`}>
        <i className="bi bi-check-circle me-1"></i>
        {success}
      </div>
    );
  }

  return null;
};

ValidationMessage.propTypes = {
  error: PropTypes.string,
  success: PropTypes.string,
  className: PropTypes.string,
};

export default ValidationMessage;