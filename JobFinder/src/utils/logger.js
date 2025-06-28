const isDevelopment = import.meta.env.DEV;

export const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  },
  
  success: (message, ...args) => {
    if (isDevelopment) {
      console.log(`✅ ${message}`, ...args);
    }
  },
  
  warning: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  },
  
  error: (message, ...args) => {
    // Always log errors, even in production
    console.error(`❌ ${message}`, ...args);
  },
  
  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`🐛 ${message}`, ...args);
    }
  },
  
  api: {
    request: (method, url) => {
      if (isDevelopment) {
        console.log(`🚀 API Request: ${method} ${url}`);
      }
    },
    
    response: (status, url) => {
      if (isDevelopment) {
        console.log(`✅ API Response: ${status} - ${url}`);
      }
    },
    
    error: (error, url) => {
      console.error(`❌ API Error: ${error.message} - ${url}`);
    }
  }
};

export default logger;