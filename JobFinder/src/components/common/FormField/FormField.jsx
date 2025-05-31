import { useState, useId } from 'react';
import PropTypes from 'prop-types';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  error,
  success,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  helpText,
  children,
  onChange,
  onBlur,
  onFocus,
  rows = 3,
  validateOnBlur = true,
  validateOnChange = false,
  validator,
  ...inputProps
}) => {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const fieldId = useId();
  
  const hasError = Boolean(error && touched);
  const hasSuccess = Boolean(success && !error && touched && value);
  const showValidation = touched && (hasError || hasSuccess);

  const getInputClasses = () => {
    const baseClass = type === 'select' ? 'form-select' : 'form-control';
    let validationClass = '';
    
    if (showValidation) {
      validationClass = hasError ? 'is-invalid' : hasSuccess ? 'is-valid' : '';
    }
    
    return `${baseClass} ${validationClass}`.trim();
  };

  const handleChange = (e) => {
    const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
    
    if (validateOnChange && validator) {
      validator(newValue);
    }
    
    onChange?.(newValue, e);
  };

  const handleBlur = (e) => {
    setTouched(true);
    setFocused(false);
    
    if (validateOnBlur && validator) {
      validator(e.target.value);
    }
    onBlur?.(e);
  };

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const renderInput = () => {
    const commonProps = {
      id: fieldId,
      name,
      className: getInputClasses(),
      disabled,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      'aria-describedby': `${fieldId}-help ${fieldId}-validation`,
      'aria-invalid': hasError,
      ...inputProps
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value || ''}
            placeholder={placeholder}
            rows={rows}
          />
        );
      
      case 'select':
        return (
          <select {...commonProps} value={value || ''}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="form-check">
            <input
              {...commonProps}
              type="checkbox"
              className="form-check-input"
              checked={Boolean(value)}
            />
            {label && (
              <label className="form-check-label" htmlFor={fieldId}>
                {label}
                {required && <span className="text-danger ms-1" aria-label="required">*</span>}
              </label>
            )}
          </div>
        );
      
      default:
        return (
          <input
            {...commonProps}
            type={type}
            value={value || ''}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className={`form-field ${className} ${focused ? 'focused' : ''}`}>
      {label && type !== 'checkbox' && (
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper position-relative">
        {renderInput()}
        
        {/* Visual feedback icon */}
        {showValidation && (
          <div className="position-absolute top-50 end-0 translate-middle-y me-3">
            {hasError ? (
              <i className="bi bi-exclamation-circle text-danger" aria-hidden="true"></i>
            ) : (
              <i className="bi bi-check-circle text-success" aria-hidden="true"></i>
            )}
          </div>
        )}
      </div>
      
      {/* Help text */}
      {helpText && !showValidation && (
        <div id={`${fieldId}-help`} className="form-text">
          {helpText}
        </div>
      )}
      
      {/* Validation feedback */}
      <div id={`${fieldId}-validation`} aria-live="polite">
        {hasError && (
          <div className="invalid-feedback d-block">
            <i className="bi bi-exclamation-circle me-1" aria-hidden="true"></i>
            {error}
          </div>
        )}
        {hasSuccess && success && (
          <div className="valid-feedback d-block">
            <i className="bi bi-check-circle me-1" aria-hidden="true"></i>
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
  error: PropTypes.string,
  success: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  helpText: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  rows: PropTypes.number,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  validator: PropTypes.func
};

export default FormField;