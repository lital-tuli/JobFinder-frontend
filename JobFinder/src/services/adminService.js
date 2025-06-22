import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens on authentication error
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const ADMIN_URL = '/admin';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { "x-auth-token": token } : {};
};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 
                   error.response.data?.error || 
                   `Server error (${error.response.status})`;
    console.error('Admin API Error:', {
      status: error.response.status,
      message,
      url: error.config?.url,
      method: error.config?.method
    });
    throw new Error(message);
  } else if (error.request) {
    // Network error
    console.error('Network Error:', error.message);
    throw new Error('Network error. Please check your connection.');
  } else {
    // Other error
    console.error('Error:', error.message);
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// =============================================================================
// USER MANAGEMENT FUNCTIONS
// =============================================================================

export const getAllUsers = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/users`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); 
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    if (!newRole) {
      throw new Error('New role is required');
    }

    const validRoles = ['jobseeker', 'recruiter', 'admin'];
    if (!validRoles.includes(newRole)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const response = await api.put(`${ADMIN_URL}/users/${userId}/role`, 
      { role: newRole },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('updateUserRole error:', error);
    handleApiError(error); 
  }
};


export const toggleUserStatus = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await api.put(`${ADMIN_URL}/users/${userId}/status`, 
      {},
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    handleApiError(error); 
  }
};

export const deleteUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const response = await api.delete(`${ADMIN_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('deleteUser error:', error);
    handleApiError(error); 
  }
};

export const bulkDeleteUsers = async (userIds) => {
  try {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      throw new Error('User IDs array is required');
    }

    const response = await api.delete(`${ADMIN_URL}/users/bulk`, {
      data: { userIds },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('bulkDeleteUsers error:', error);
    handleApiError(error); 
  }
};

// =============================================================================
// JOB MANAGEMENT FUNCTIONS
// =============================================================================

export const getAllJobs = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/jobs`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); 
  }
};

export const updateJobForAdmin = async (jobId, jobData) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    if (!jobData) {
      throw new Error('Job data is required');
    }

    const response = await api.put(`${ADMIN_URL}/jobs/${jobId}`, jobData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('updateJobForAdmin error:', error);
    handleApiError(error); 
  }
};

export const toggleJobStatus = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.put(`${ADMIN_URL}/jobs/${jobId}/status`, 
      {},
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    console.error('toggleJobStatus error:', error);
    handleApiError(error); 
  }
};

export const deleteJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.delete(`${ADMIN_URL}/jobs/${jobId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('deleteJob error:', error);
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// ✅ FIXED: Bulk delete jobs
export const bulkDeleteJobs = async (jobIds) => {
  try {
    if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      throw new Error('Job IDs array is required');
    }

    const response = await api.delete(`${ADMIN_URL}/jobs/bulk`, {
      data: { jobIds },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('bulkDeleteJobs error:', error);
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// ✅ FIXED: Get job applications for a specific job with 304 handling
export const getJobApplications = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.get(`${ADMIN_URL}/jobs/${jobId}/applications`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getJobApplications error:', error);
    
    // ✅ FIX: Handle 304 for job applications
    if (error.response && error.response.status === 304) {
      return error.response.data || { applications: [], totalApplications: 0 };
    }
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// ✅ FIXED: Get job statistics with 304 handling
export const getJobStatistics = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/jobs/statistics`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getJobStatistics error:', error);
    
    // ✅ FIX: Handle 304 for job statistics
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// =============================================================================
// SYSTEM MANAGEMENT FUNCTIONS
// =============================================================================

// ✅ FIXED: Get system statistics with 304 handling
export const getSystemStats = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/stats`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getSystemStats error:', error);
    
    // ✅ FIX: Handle 304 for system stats
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// ✅ FIXED: Get dashboard overview data with 304 handling
export const getDashboardOverview = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getDashboardOverview error:', error);
    
    // ✅ FIX: Handle 304 for dashboard data
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// ✅ FIXED: Get user activity logs
export const getUserActivityLogs = async (filters = {}) => {
  try {
    const response = await api.get(`${ADMIN_URL}/logs/user-activity`, {
      params: filters,
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getUserActivityLogs error:', error);
    
    // ✅ FIX: Handle 304 for activity logs
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// ✅ FIXED: Get system logs
export const getSystemLogs = async (filters = {}) => {
  try {
    const response = await api.get(`${ADMIN_URL}/logs/system`, {
      params: filters,
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getSystemLogs error:', error);
    
    // ✅ FIX: Handle 304 for system logs
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// =============================================================================
// ANALYTICS FUNCTIONS
// =============================================================================

// ✅ FIXED: Get user analytics
export const getUserAnalytics = async (timeframe = '30d') => {
  try {
    const response = await api.get(`${ADMIN_URL}/analytics/users`, {
      params: { timeframe },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getUserAnalytics error:', error);
    
    // ✅ FIX: Handle 304 for user analytics
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); // ✅ FIXED: Removed unnecessary return
  }
};

// ✅ FIXED: Get job analytics
export const getJobAnalytics = async (timeframe = '30d') => {
  try {
    const response = await api.get(`${ADMIN_URL}/analytics/jobs`, {
      params: { timeframe },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getJobAnalytics error:', error);
    
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); 
  }
};

export const getApplicationAnalytics = async (timeframe = '30d') => {
  try {
    const response = await api.get(`${ADMIN_URL}/analytics/applications`, {
      params: { timeframe },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getApplicationAnalytics error:', error);
    
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); 
  }
};

// =============================================================================
// CONFIGURATION FUNCTIONS
// =============================================================================

export const getSystemConfig = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/config`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('getSystemConfig error:', error);
    
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); 
  }
};

export const updateSystemConfig = async (configData) => {
  try {
    if (!configData) {
      throw new Error('Configuration data is required');
    }

    const response = await api.put(`${ADMIN_URL}/config`, configData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('updateSystemConfig error:', error);
    handleApiError(error); 
  }
};

export const backupSystemData = async () => {
  try {
    const response = await api.post(`${ADMIN_URL}/backup`, {}, {
      headers: getAuthHeaders(),
      responseType: 'blob' // For file download
    });
    return response.data;
  } catch (error) {
    console.error('backupSystemData error:', error);
    handleApiError(error); 
  }
};

export const sendSystemNotification = async (notificationData) => {
  try {
    if (!notificationData) {
      throw new Error('Notification data is required');
    }

    if (!notificationData.message) {
      throw new Error('Notification message is required');
    }

    const response = await api.post(`${ADMIN_URL}/notifications`, notificationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('sendSystemNotification error:', error);
    handleApiError(error); 
  }
};

export default {
  // User Management
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  bulkDeleteUsers,
  
  // Job Management
  getAllJobs,
  updateJobForAdmin,
  toggleJobStatus,
  deleteJob,
  bulkDeleteJobs,
  getJobApplications,
  getJobStatistics,
  
  // System Management
  getSystemStats,
  getDashboardOverview,
  getUserActivityLogs,
  getSystemLogs,
  
  // Analytics
  getUserAnalytics,
  getJobAnalytics,
  getApplicationAnalytics,
  
  // Configuration
  getSystemConfig,
  updateSystemConfig,
  backupSystemData,
  sendSystemNotification
};