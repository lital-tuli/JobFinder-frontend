// Global error handling utilities
export class ApiError extends Error {
    constructor(message, status, data = null) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
  }
  
  // Enhanced error handler for API responses
  export const handleApiError = (error, customMessage = '') => {
    // Network error
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        throw new ApiError('Request timeout. Please try again.', 408);
      }
      throw new ApiError('Network error. Please check your connection.', 0);
    }
  
    const { status, data } = error.response;
    let message = customMessage;
  
    // Default error messages based on status
    if (!message) {
      switch (status) {
        case 400:
          message = data?.message || 'Invalid request. Please check your input.';
          break;
        case 401:
          message = 'Authentication required. Please log in.';
          // Clear tokens on 401
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.reload(); // Force re-authentication
          break;
        case 403:
          message = 'Access denied. You don\'t have permission for this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 409:
          message = 'Conflict. ' + (data?.message || 'This action conflicts with existing data.');
          break;
        case 422:
          message = 'Validation error. ' + (data?.message || 'Please check your input.');
          break;
        case 429:
          message = 'Too many requests. Please wait before trying again.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = data?.message || error.message || 'An unexpected error occurred.';
      }
    }
  
    // Log detailed error for debugging (only in development)
    if (import.meta.env.MODE === 'development') {
      console.error('API Error Details:', {
        status,
        message,
        data,
        url: error.config?.url,
        method: error.config?.method
      });
    }
  
    throw new ApiError(message, status, data);
  };
  
  // Retry mechanism for failed requests
  export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        // Don't retry on certain status codes
        if (error.status && [400, 401, 403, 404, 422].includes(error.status)) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  };
  
  // Generic async operation wrapper with error handling
  export const safeApiCall = async (apiCall, errorContext = '') => {
    try {
      return await apiCall();
    } catch (error) {
      handleApiError(error, errorContext);
    }
  };
  
  // Toast notification helper (integrate with your notification system)
  export const showErrorNotification = (error) => {
    const message = error instanceof ApiError ? error.message : 'An unexpected error occurred';
    
    // You can integrate this with a toast library like react-toastify
    console.error('Error:', message);
    
    // For now, we'll use a simple alert
    // In production, replace with proper toast notifications
    if (typeof window !== 'undefined') {
      // Could be replaced with toast notification
      alert(message);
    }
    
    return message;
  };
  
  // Form validation error handler
  export const handleFormErrors = (error, setFieldErrors) => {
    if (error.status === 422 && error.data?.errors) {
      // Handle validation errors
      const fieldErrors = {};
      error.data.errors.forEach(err => {
        if (err.field) {
          fieldErrors[err.field] = err.message;
        }
      });
      setFieldErrors(fieldErrors);
      return true;
    }
    return false;
  };
  
  export default {
    ApiError,
    handleApiError,
    retryRequest,
    safeApiCall,
    showErrorNotification,
    handleFormErrors
  };