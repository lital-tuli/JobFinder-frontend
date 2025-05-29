
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[!@%$#^&*\-_*]).{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_MESSAGES = {
  REQUIRED: (field) => `${field} is required`,
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_WEAK: 'Password must contain at least 8 characters, one uppercase, one lowercase, 4 numbers, and a special character',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  MIN_LENGTH: (field, length) => `${field} must be at least ${length} characters`
};
