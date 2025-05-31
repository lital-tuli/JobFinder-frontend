import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  message = 'Loading...',
  className = '',
  inline = false 
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: { width: '3rem', height: '3rem' }
  };

  const containerClass = inline ? 'd-inline-flex align-items-center' : 'text-center';
  const spinnerStyle = size === 'lg' ? sizeClasses.lg : {};

  return (
    <div className={`${containerClass} ${className}`}>
      <div 
        className={`spinner-border text-${color} ${size === 'sm' ? sizeClasses.sm : ''}`}
        style={spinnerStyle}
        role="status"
        aria-label={message}
      >
        <span className="visually-hidden">{message}</span>
      </div>
      {!inline && message && (
        <p className="mt-2 text-muted" aria-live="polite">{message}</p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.string,
  message: PropTypes.string,
  className: PropTypes.string,
  inline: PropTypes.bool
};

export default LoadingSpinner;

