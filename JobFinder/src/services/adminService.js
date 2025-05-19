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

// Get all users (admin only)
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

// Get all jobs for admin (including inactive)
export const getAllJobs = async () => {
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

// Job management functions

// Get job statistics
export const getJobStatistics = async () => {
  try {
    const response = await api.get(`${ADMIN_URL}/jobs/statistics`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
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

// Get job applications for a specific job
export const getJobApplications = async (jobId) => {
  try {
    const response = await api.get(`${ADMIN_URL}/jobs/${jobId}/applications`, {
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

// System maintenance functions
export const cleanupInactiveJobs = async (daysOld = 90) => {
  try {
    const response = await api.post(`${ADMIN_URL}/maintenance/cleanup-jobs`, 
      { daysOld },
      {
        headers: getAuthHeaders()
      }
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
      {
        headers: getAuthHeaders()
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export default {
  getAllUsers,
  getAllJobs,
  getSystemStats,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getJobStatistics,
  updateJob,
  toggleJobStatus,
  deleteJob,
  bulkDeleteJobs,
  getJobApplications,
  bulkDeleteUsers,
  cleanupInactiveJobs,
  cleanupOldApplications
};