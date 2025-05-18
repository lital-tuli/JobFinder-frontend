import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const ADMIN_URL = `${API_BASE_URL}/admin`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to handle API errors consistently
const handleApiError = (error) => {
  const errorMessage = 
    error.response?.data?.message || 
    error.response?.data || 
    error.message || 
    'An unexpected error occurred';
  
  console.error("Admin API Error:", errorMessage);
  throw { error: errorMessage };
};

// Helper to add auth token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { "x-auth-token": token } : {};
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/users`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all jobs (including inactive)
export const getAllJobsForAdmin = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/jobs`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get system statistics
export const getSystemStats = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/stats`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update user role
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await api.put(`${ADMIN_URL}/users/${userId}/role`, 
      { role: newRole },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Toggle user status
export const toggleUserStatus = async (userId) => {
  try {
    const response = await api.put(`${ADMIN_URL}/users/${userId}/status`, 
      {},
      { headers: getAuthHeaders() }
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

// Get user activity logs
export const getUserActivityLogs = async (userId) => {
  try {
    const response = await api.get(`${ADMIN_URL}/users/${userId}/activity`, {
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
    const response = await api.post(`${ADMIN_URL}/users/bulk-delete`, 
      { userIds },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// System maintenance operations
export const cleanupInactiveJobs = async (daysOld = 90) => {
  try {
    const response = await api.post(`${ADMIN_URL}/maintenance/cleanup-jobs`, 
      { daysOld },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const cleanupOldApplications = async (daysOld = 180) => {
  try {
    const response = await api.post(`${ADMIN_URL}/maintenance/cleanup-applications`, 
      { daysOld },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Export data for backup
export const exportSystemData = async (dataType = 'all') => {
  try {
    const response = await api.get(`${ADMIN_URL}/export/${dataType}`, {
      headers: getAuthHeaders(),
      responseType: 'blob' // For file downloads
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Import data from backup
export const importSystemData = async (file, dataType = 'all') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataType', dataType);
    
    const response = await api.post(`${ADMIN_URL}/import`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// System health check
export const getSystemHealth = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/health`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get detailed analytics
export const getDetailedAnalytics = async (timeRange = '30d') => {
  try {
    const response = await api.get(`${ADMIN_URL}/analytics?range=${timeRange}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Send system notification to all users
export const sendSystemNotification = async (notificationData) => {
  try {
    const response = await api.post(`${ADMIN_URL}/notifications/system`, 
      notificationData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Default export with all methods
export default {
  getAllUsers,
  getAllJobsForAdmin,
  getSystemStats,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getUserActivityLogs,
  bulkDeleteUsers,
  cleanupInactiveJobs,
  cleanupOldApplications,
  exportSystemData,
  importSystemData,
  getSystemHealth,
  getDetailedAnalytics,
  sendSystemNotification
};