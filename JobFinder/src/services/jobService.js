// Fixed jobService.js - Prevents duplicate calls and improves error handling

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

const JOBS_URL = '/jobs';

// Cache to prevent duplicate simultaneous requests
const requestCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

// Helper function to create cache key
const createCacheKey = (url, params = {}) => {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${url}?${paramString}`;
};

// Helper function to check if request is in progress
const isRequestInProgress = (cacheKey) => {
  const cached = requestCache.get(cacheKey);
  return cached && cached.timestamp > Date.now() - CACHE_DURATION;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

// Helper function to handle API errors consistently
const handleApiError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }
  
  const message = error.response?.data?.message || error.message || 'An error occurred';
  throw new Error(message);
};

// ✅ FIXED: Get all jobs with caching to prevent duplicate calls
export const getAllJobs = async (filters = {}) => {
  const cacheKey = createCacheKey(`${JOBS_URL}`, filters);
  
  // Check if same request is already in progress
  if (isRequestInProgress(cacheKey)) {
    console.log('🔄 Request already in progress, waiting...');
    const cached = requestCache.get(cacheKey);
    return cached.promise;
  }

  console.log('🔍 Fetching jobs with filters:', filters);
  
  try {
    // Create the request promise
    const requestPromise = api.get(JOBS_URL, {
      params: filters,
      headers: getAuthHeaders()
    }).then(response => {
      console.log('✅ Jobs API response status:', response.status);
      console.log('📊 Jobs data received:', response.data?.length || 0, 'jobs');
      
      // Clear cache entry on success
      requestCache.delete(cacheKey);
      
      // Ensure we return an array
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data?.jobs && Array.isArray(response.data.jobs)) {
        return response.data.jobs;
      } else {
        console.warn('⚠️ Unexpected data structure:', response.data);
        return [];
      }
    });

    // Cache the request
    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
    
  } catch (error) {
    // Clear cache entry on error
    requestCache.delete(cacheKey);
    
    console.error('❌ getAllJobs error:', error);
    
    // Handle 304 Not Modified (data hasn't changed)
    if (error.response?.status === 304) {
      return error.response.data || [];
    }
    
    handleApiError(error);
  }
};

// ✅ FIXED: Get job by ID with better error handling
export const getJobById = async (jobId) => {
  if (!jobId) {
    throw new Error('Job ID is required');
  }

  const cacheKey = createCacheKey(`${JOBS_URL}/${jobId}`);
  
  // Check cache for individual job requests
  if (isRequestInProgress(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    return cached.promise;
  }

  try {
    console.log('🔍 Fetching job by ID:', jobId);
    
    const requestPromise = api.get(`${JOBS_URL}/${jobId}`, {
      headers: getAuthHeaders()
    }).then(response => {
      requestCache.delete(cacheKey);
      console.log('✅ Job details fetched successfully');
      return response.data;
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
    
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ getJobById error:', error);
    handleApiError(error);
  }
};

// ✅ FIXED: Create job with proper validation
export const createJob = async (jobData) => {
  try {
    if (!jobData || typeof jobData !== 'object') {
      throw new Error('Valid job data is required');
    }

    console.log('📝 Creating new job:', jobData.title);
    
    const response = await api.post(JOBS_URL, jobData, {
      headers: getAuthHeaders()
    });
    
    console.log('✅ Job created successfully');
    
    // Clear jobs cache since we have new data
    requestCache.clear();
    
    return response.data;
  } catch (error) {
    console.error('❌ createJob error:', error);
    handleApiError(error);
  }
};

// ✅ FIXED: Update job
export const updateJob = async (jobId, jobData) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }
    
    if (!jobData || typeof jobData !== 'object') {
      throw new Error('Valid job data is required');
    }

    console.log('📝 Updating job:', jobId);
    
    const response = await api.put(`${JOBS_URL}/${jobId}`, jobData, {
      headers: getAuthHeaders()
    });
    
    console.log('✅ Job updated successfully');
    
    // Clear relevant cache entries
    requestCache.clear();
    
    return response.data;
  } catch (error) {
    console.error('❌ updateJob error:', error);
    handleApiError(error);
  }
};

// ✅ FIXED: Delete job
export const deleteJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    console.log('🗑️ Deleting job:', jobId);
    
    const response = await api.delete(`${JOBS_URL}/${jobId}`, {
      headers: getAuthHeaders()
    });
    
    console.log('✅ Job deleted successfully');
    
    // Clear cache
    requestCache.clear();
    
    return response.data;
  } catch (error) {
    console.error('❌ deleteJob error:', error);
    handleApiError(error);
  }
};

// ✅ FIXED: Save/unsave job
export const saveJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.post(`${JOBS_URL}/${jobId}/save`, {}, {
      headers: getAuthHeaders()
    });
    
    console.log('✅ Job saved successfully');
    return response.data;
  } catch (error) {
    console.error('❌ saveJob error:', error);
    handleApiError(error);
  }
};

export const unsaveJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.delete(`${JOBS_URL}/${jobId}/save`, {
      headers: getAuthHeaders()
    });
    
    console.log('✅ Job unsaved successfully');
    return response.data;
  } catch (error) {
    console.error('❌ unsaveJob error:', error);
    handleApiError(error);
  }
};

// ✅ FIXED: Apply to job
export const applyToJob = async (jobId, applicationData = {}) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    console.log('📋 Applying to job:', jobId);

    const response = await api.post(`${JOBS_URL}/${jobId}/apply`, applicationData, {
      headers: getAuthHeaders()
    });
    
    console.log('✅ Application submitted successfully');
    return response.data;
  } catch (error) {
    console.error('❌ applyToJob error:', error);
    handleApiError(error);
  }
};

// ✅ FIXED: Get user's applications with caching
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
      return Array.isArray(response.data) ? response.data : [];
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ getMyApplications error:', error);
    
    if (error.response?.status === 304) {
      return [];
    }
    handleApiError(error);
  }
};

// ✅ FIXED: Get user's saved jobs with caching
export const getMySavedJobs = async () => {
  const cacheKey = createCacheKey(`${JOBS_URL}/my-saved`);
  
  if (isRequestInProgress(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    return cached.promise;
  }

  try {
    const requestPromise = api.get(`${JOBS_URL}/my-saved`, {
      headers: getAuthHeaders()
    }).then(response => {
      requestCache.delete(cacheKey);
      return Array.isArray(response.data) ? response.data : [];
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ getMySavedJobs error:', error);
    
    if (error.response?.status === 304) {
      return [];
    }
    handleApiError(error);
  }
};

// ✅ FIXED: Get user's posted jobs
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
      return Array.isArray(response.data) ? response.data : [];
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ getMyJobs error:', error);
    
    if (error.response?.status === 304) {
      return [];
    }
    handleApiError(error);
  }
};

// Alternative export name for backward compatibility
export const getMyJobListings = getMyJobs;

// ✅ FIXED: Search jobs
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
      return Array.isArray(response.data) ? response.data : [];
    });

    requestCache.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    return await requestPromise;
  } catch (error) {
    requestCache.delete(cacheKey);
    console.error('❌ searchJobs error:', error);
    
    if (error.response?.status === 304) {
      return [];
    }
    handleApiError(error);
  }
};

// Clear cache function for manual cleanup
export const clearJobsCache = () => {
  requestCache.clear();
  console.log('🧹 Jobs cache cleared');
};

// Default export with all functions
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