import React from 'react';
import ValidationMessage from '../ValidationMessage';
import './FormField.module.css';

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
  ...inputProps
}) => {
  const fieldId = `field-${name}`;
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success && !error);

  const getInputClasses = () => {
    const baseClass = type === 'select' ? 'form-select' : 'form-control';
    const validationClass = hasError ? 'is-invalid' : hasSuccess ? 'is-valid' : '';
    return `${baseClass} ${validationClass}`.trim();
  };

  const handleChange = (e) => {
    const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
    onChange?.(newValue, e);
  };

  const renderInput = () => {
    const commonProps = {
      id: fieldId,
      name,
      className: getInputClasses(),
      disabled,
      onChange: handleChange,
      onBlur,
      ...inputProps
    };

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={value || ''}
            placeholder={placeholder}
            rows={inputProps.rows || 3}
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
                {required && <span className="text-danger ms-1">*</span>}
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
    <div className={`form-field ${className}`}>
      {label && type !== 'checkbox' && (
        <label htmlFor={fieldId} className="form-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {helpText && !error && !success && (
        <div className="form-text">{helpText}</div>
      )}
      
      <ValidationMessage error={error} success={success} />
    </div>
  );
};
export default FormField;
