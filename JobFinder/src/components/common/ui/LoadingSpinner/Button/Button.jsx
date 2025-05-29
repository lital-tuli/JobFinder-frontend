import React from 'react';
import LoadingSpinner from '../LoadingSpinner';
import './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  loadingText,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  
  const buttonClasses = [
    baseClass,
    variantClass,
    sizeClass,
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <LoadingSpinner size="sm" centered={false} />
          {loadingText && <span className="ms-2">{loadingText}</span>}
        </>
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <i className={`${icon} me-2`} aria-hidden="true"></i>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <i className={`${icon} ms-2`} aria-hidden="true"></i>
        )}
      </>
    );
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;