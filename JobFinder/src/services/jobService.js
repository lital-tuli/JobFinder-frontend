import axios from 'axios';

// ✅ FIXED: Correct API URL to match backend port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const JOBS_URL = `${API_BASE_URL}/jobs`;

// Request cache for optimization
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API calls for debugging
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} - ${response.config.url}`);
    
    // Validate that we received JSON data
    if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
      console.error('❌ Received HTML instead of JSON data');
      throw new Error('Server returned HTML instead of JSON. Check your API endpoints.');
    }
    
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Utility functions
const createCacheKey = (url, params = {}) => {
  return `${url}${JSON.stringify(params)}`;
};

const isRequestInProgress = (cacheKey) => {
  const cached = requestCache.get(cacheKey);
  return cached && (Date.now() - cached.timestamp < CACHE_DURATION);
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error) => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error('An unexpected error occurred');
  }
};

// Validate response data structure
const validateJobsData = (data) => {
  if (!data) {
    console.warn('⚠️ No data received from API');
    return [];
  }
  
  if (typeof data === 'string') {
    console.error('❌ Received string data instead of array/object:', data.substring(0, 100));
    return [];
  }
  
  if (Array.isArray(data)) {
    console.log(`📊 Received ${data.length} jobs from API`);
    return data;
  }
  
  if (data.jobs && Array.isArray(data.jobs)) {
    console.log(`📊 Received ${data.jobs.length} jobs from nested API response`);
    return data.jobs;
  }
  
  if (data.data && Array.isArray(data.data)) {
    console.log(`📊 Received ${data.data.length} jobs from nested API response`);
    return data.data;
  }
  
  console.warn('⚠️ Unexpected data structure:', data);
  return [];
};

// Main API functions
export const getAllJobs = async (filters = {}) => {
  const cacheKey = createCacheKey(JOBS_URL, filters);
  
  if (isRequestInProgress(cacheKey)) {
    console.log('🔄 Request already in progress, waiting...');
    const cached = requestCache.get(cacheKey);
    return cached.promise;
  }

  try {
    console.log('🔍 Fetching jobs with filters:', filters);
    
    const requestPromise = api.get(JOBS_URL, {
      params: filters,
      headers: getAuthHeaders()
    }).then(response => {
      requestCache.delete(cacheKey);
      console.log('✅ Jobs API response status:', response.status);
      console.log('📊 Jobs data received:', response.data);
      
      // Validate and return data
      const validatedData = validateJobsData(response.data);
      
      if (typeof response.data === 'string') {
        console.error('⚠️ Unexpected data structure:', response.data);
        throw new Error('Server configuration error: receiving HTML instead of JSON');
      }
      
      return validatedData;
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ getAllJobs error:', error);
    
    // Return empty array on error to prevent app crashes
    return [];
  }
};

export const getJobById = async (id) => {
  try {
    const response = await api.get(`${JOBS_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('❌ getJobById error:', error);
    handleApiError(error);
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await api.post(JOBS_URL, jobData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('❌ createJob error:', error);
    handleApiError(error);
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await api.put(`${JOBS_URL}/${id}`, jobData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('❌ updateJob error:', error);
    handleApiError(error);
  }
};

export const deleteJob = async (id) => {
  try {
    await api.delete(`${JOBS_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return true;
  } catch (error) {
    console.error('❌ deleteJob error:', error);
    handleApiError(error);
  }
};

export const saveJob = async (jobId) => {
  try {
    const response = await api.post(`${JOBS_URL}/${jobId}/save`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('❌ saveJob error:', error);
    handleApiError(error);
  }
};

export const unsaveJob = async (jobId) => {
  try {
    await api.delete(`${JOBS_URL}/${jobId}/save`, {
      headers: getAuthHeaders()
    });
    return true;
  } catch (error) {
    console.error('❌ unsaveJob error:', error);
    handleApiError(error);
  }
};

export const applyToJob = async (jobId, applicationData = {}) => {
  try {
    const response = await api.post(`${JOBS_URL}/${jobId}/apply`, applicationData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('❌ applyToJob error:', error);
    handleApiError(error);
  }
};

// ✅ FIXED: Now matches backend endpoint /api/jobs/my-applications
export const getMyApplications = async () => {
  const cacheKey = createCacheKey(`${JOBS_URL}/my-applications`);
  
  if (isRequestInProgress(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    return cached.promise;
  }

  try {
    const requestPromise = api.get(`${JOBS_URL}/my-applications`, {
      headers: getAuthHeaders()
    }).then(response => {
      requestCache.delete(cacheKey);
      return validateJobsData(response.data);
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ getMyApplications error:', error);
    return [];
  }
};

// ✅ FIXED: Now matches backend endpoint /api/jobs/saved
export const getMySavedJobs = async () => {
  const cacheKey = createCacheKey(`${JOBS_URL}/saved`);
  
  if (isRequestInProgress(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    return cached.promise;
  }

  try {
    const requestPromise = api.get(`${JOBS_URL}/saved`, {
      headers: getAuthHeaders()
    }).then(response => {
      requestCache.delete(cacheKey);
      return validateJobsData(response.data);
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ getMySavedJobs error:', error);
    return [];
  }
};

// ✅ FIXED: Now matches backend endpoint /api/jobs/my-jobs
export const getMyJobs = async () => {
  const cacheKey = createCacheKey(`${JOBS_URL}/my-jobs`);
  
  if (isRequestInProgress(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    return cached.promise;
  }

  try {
    const requestPromise = api.get(`${JOBS_URL}/my-jobs`, {
      headers: getAuthHeaders()
    }).then(response => {
      requestCache.delete(cacheKey);
      return validateJobsData(response.data);
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ getMyJobs error:', error);
    return [];
  }
};

// ✅ FIXED: Now matches backend endpoint /api/jobs/search
export const searchJobs = async (searchParams) => {
  const cacheKey = createCacheKey(`${JOBS_URL}/search`, searchParams);
  
  if (isRequestInProgress(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    return cached.promise;
  }

  try {
    const requestPromise = api.get(`${JOBS_URL}/search`, {
      params: searchParams,
      headers: getAuthHeaders()
    }).then(response => {
      requestCache.delete(cacheKey);
      
      // Handle search response structure
      if (response.data.jobs) {
        return response.data; // Return full search response with pagination
      }
      return validateJobsData(response.data);
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ searchJobs error:', error);
    return { jobs: [], pagination: null };
  }
};

// Clear cache function
export const clearJobsCache = () => {
  requestCache.clear();
  console.log('🧹 Jobs cache cleared');
};

// Alternative export names for backward compatibility
export const getMyJobListings = getMyJobs;

// Default export
const jobService = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  saveJob,
  unsaveJob,
  applyToJob,
  getMyApplications,
  getMySavedJobs,
  getMyJobs,
  getMyJobListings,
  searchJobs,
  clearJobsCache
};

export default jobService;