import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const ADMIN_URL = `${API_BASE_URL}/admin`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // ✅ FIX: Configure axios to handle 304 responses properly
  validateStatus: function (status) {
    // Accept status codes from 200-399 (including 304)
    return status >= 200 && status < 400;
  }
});

// ✅ FIX: Add response interceptor to handle 304 responses globally
api.interceptors.response.use(
  (response) => {
    // Handle 304 responses as success
    if (response.status === 304) {
      console.log('304 Not Modified - admin data unchanged');
      response.data = response.data || [];
    }
    return response;
  },
  (error) => {
    // Don't treat 304 as error
    if (error.response && error.response.status === 304) {
      console.log('304 intercepted in admin service - returning success');
      return Promise.resolve({
        ...error.response,
        data: error.response.data || []
      });
    }
    return Promise.reject(error);
  }
);

// ✅ FIXED: Helper to handle API errors consistently, including 304
const handleApiError = (error) => {
  // ✅ FIX: Handle 304 as success, not error
  if (error.response && error.response.status === 304) {
    console.log('Admin data not modified (304), using cached data');
    return error.response.data || [];
  }
  
  const errorMessage = 
    error.response?.data?.message || 
    error.response?.data || 
    error.message || 
    'An unexpected error occurred';
  
  console.error("Admin API Error:", {
    message: errorMessage,
    status: error.response?.status,
    url: error.config?.url,
    method: error.config?.method
  });
  
  throw { error: errorMessage, status: error.response?.status };
};

// Helper to add auth token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { "x-auth-token": token } : {};
};

// ✅ FIXED: Get all users (admin only) with 304 handling
export const getAllUsers = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/users`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for users list
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    return handleApiError(error);
  }
};

// ✅ FIXED: Get all jobs for admin (including inactive) with 304 handling
export const getAllJobs = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/jobs`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for admin jobs list
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    return handleApiError(error);
  }
};

// ✅ FIXED: Get system statistics with 304 handling
export const getSystemStats = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/stats`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for system stats
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Update user role
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await api.put(`${ADMIN_URL}/users/${userId}/role`, 
      { role: newRole },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Toggle user status (active/inactive)
export const toggleUserStatus = async (userId) => {
  try {
    const response = await api.put(`${ADMIN_URL}/users/${userId}/status`, 
      {},
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`${ADMIN_URL}/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Bulk delete users
export const bulkDeleteUsers = async (userIds) => {
  try {
    const response = await api.delete(`${ADMIN_URL}/users/bulk`, {
      data: { userIds },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Job management functions

// ✅ FIXED: Get job statistics with 304 handling
export const getJobStatistics = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/jobs/statistics`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for job statistics
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Update job (admin only)
export const updateJob = async (jobId, jobData) => {
  try {
    const response = await api.put(`${ADMIN_URL}/jobs/${jobId}`, 
      jobData,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Toggle job status (active/inactive)
export const toggleJobStatus = async (jobId) => {
  try {
    const response = await api.put(`${ADMIN_URL}/jobs/${jobId}/status`, 
      {},
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete job (admin only)
export const deleteJob = async (jobId) => {
  try {
    const response = await api.delete(`${ADMIN_URL}/jobs/${jobId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Bulk delete jobs
export const bulkDeleteJobs = async (jobIds) => {
  try {
    const response = await api.delete(`${ADMIN_URL}/jobs/bulk`, {
      data: { jobIds },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// ✅ FIXED: Get job applications for a specific job with 304 handling
export const getJobApplications = async (jobId) => {
  try {
    const response = await api.get(`${ADMIN_URL}/jobs/${jobId}/applications`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for job applications
    if (error.response && error.response.status === 304) {
      return error.response.data || { applications: [], totalApplications: 0 };
    }
    return handleApiError(error);
  }
};

// Get dashboard overview data
export const getDashboardOverview = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/dashboard`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for dashboard data
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Get user activity logs
export const getUserActivityLogs = async (limit = 50) => {
  try {
    const response = await api.get(`${ADMIN_URL}/logs/user-activity`, {
      params: { limit },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for activity logs
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    return handleApiError(error);
  }
};

// Get system health information
export const getSystemHealth = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/health`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for system health
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Backup system data
export const backupSystemData = async () => {
  try {
    const response = await api.post(`${ADMIN_URL}/backup`, {}, {
      headers: getAuthHeaders(),
      responseType: 'blob'
    });
    
    // Extract filename from response headers or use default
    let filename = `jobfinder_backup_${new Date().toISOString().split('T')[0]}.json`;
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    
    // Create download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    return handleApiError(error);
  }
};

// Send system notification to all users
export const sendSystemNotification = async (notificationData) => {
  try {
    const response = await api.post(`${ADMIN_URL}/notifications/system`, 
      notificationData,
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get platform analytics
export const getPlatformAnalytics = async (dateRange = '30days') => {
  try {
    const response = await api.get(`${ADMIN_URL}/analytics`, {
      params: { range: dateRange },
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for analytics data
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Manage featured jobs
export const setFeaturedJob = async (jobId, featured = true) => {
  try {
    const response = await api.put(`${ADMIN_URL}/jobs/${jobId}/featured`, 
      { featured },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get content moderation queue
export const getModerationQueue = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/moderation/queue`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for moderation queue
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    return handleApiError(error);
  }
};

// Approve/reject content
export const moderateContent = async (contentId, action, reason = '') => {
  try {
    const response = await api.put(`${ADMIN_URL}/moderation/${contentId}`, 
      { action, reason },
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Export data for compliance
export const exportUserData = async (userId, dataTypes = ['profile', 'jobs', 'applications']) => {
  try {
    const response = await api.post(`${ADMIN_URL}/export/user-data`, 
      { userId, dataTypes },
      {
        headers: getAuthHeaders(),
        responseType: 'blob'
      }
    );
    
    // Extract filename from response headers or use default
    let filename = `user_data_export_${userId}.json`;
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }
    
    // Create download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true, filename };
  } catch (error) {
    return handleApiError(error);
  }
};

// Default export with all functions
const adminService = {
  // User Management
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  bulkDeleteUsers,
  
  // Job Management
  getAllJobs,
  getJobStatistics,
  updateJob,
  toggleJobStatus,
  deleteJob,
  bulkDeleteJobs,
  getJobApplications,
  setFeaturedJob,
  
  // System Management
  getSystemStats,
  getDashboardOverview,
  getUserActivityLogs,
  getSystemHealth,
  backupSystemData,
  
  // Communication
  sendSystemNotification,
  
  // Analytics
  getPlatformAnalytics,
  
  // Content Moderation
  getModerationQueue,
  moderateContent,
  
  // Compliance
  exportUserData
};

export default adminService;