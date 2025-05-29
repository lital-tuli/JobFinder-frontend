import { PASSWORD_REGEX, EMAIL_REGEX, VALIDATION_MESSAGES } from '../constants/validation';

export const validateEmail = (email) => {
  if (!email) return VALIDATION_MESSAGES.REQUIRED('Email');
  if (!EMAIL_REGEX.test(email)) return VALIDATION_MESSAGES.EMAIL_INVALID;
  return '';
};

export const validatePassword = (password) => {
  if (!password) return VALIDATION_MESSAGES.REQUIRED('Password');
  if (!PASSWORD_REGEX.test(password)) return VALIDATION_MESSAGES.PASSWORD_WEAK;
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return VALIDATION_MESSAGES.REQUIRED(fieldName);
  }
  return '';
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.length < minLength) {
    return VALIDATION_MESSAGES.MIN_LENGTH(fieldName, minLength);
  }
  return '';
};