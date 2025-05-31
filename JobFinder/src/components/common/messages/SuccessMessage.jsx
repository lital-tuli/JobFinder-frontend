import React from 'react';
import PropTypes from 'prop-types';
import ErrorMessage from './ErrorMessage';

const SuccessMessage = ({ message, onDismiss, ...props }) => (
  <ErrorMessage 
    error={message} 
    type="success" 
    onDismiss={onDismiss}
    {...props}
  />
);

SuccessMessage.propTypes = {
  message: PropTypes.string,
  onDismiss: PropTypes.func
};

export default SuccessMessage;
