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
    console.error('API Error:', {
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

// ✅ FIXED: Get all jobs with proper 304 handling
export const getAllJobs = async (filters = {}, retryCount = 0) => {
  try {
    // Validate filters
    const validFilters = {};
    if (filters.jobType && typeof filters.jobType === 'string') {
      validFilters.jobType = filters.jobType;
    }
    if (filters.location && typeof filters.location === 'string') {
      validFilters.location = filters.location;
    }
    if (filters.company && typeof filters.company === 'string') {
      validFilters.company = filters.company;
    }
    if (filters.search && typeof filters.search === 'string') {
      validFilters.search = filters.search;
    }

    console.log('Fetching jobs with filters:', validFilters);
    
    const response = await api.get(JOBS_URL, { 
      params: validFilters,
      headers: getAuthHeaders()
    });
    
    console.log('Jobs API response status:', response.status);
    
    // The interceptor already handles 304, but double-check
    if (response.status === 304) {
      console.log('Jobs data not modified since last request (304)');
      return response.data || [];
    }
    
    return response.data;
  } catch (error) {
    console.error('getAllJobs error:', error);
    
    // ✅ FIX: Check if it's actually a 304 response before treating as error
    if (error.response && error.response.status === 304) {
      console.log('Handling 304 response in catch block');
      return error.response.data || [];
    }
    
    // Retry once on timeout
    if (retryCount === 0 && error.code === 'ECONNABORTED') {
      console.warn('Request timeout, retrying...');
      return getAllJobs(filters, 1);
    }
    handleApiError(error); 
  }
};

export const getJobById = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Validate jobId format (basic ObjectId validation)
    if (typeof jobId !== 'string' || jobId.length !== 24) {
      throw new Error('Invalid job ID format');
    }

    const response = await api.get(`${JOBS_URL}/${jobId}`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); 
  }
};


export const createJob = async (jobData) => {
  try {
    if (!jobData) {
      throw new Error('Job data is required');
    }

    // Validate required fields
    const requiredFields = ['title', 'company', 'description', 'requirements', 'location', 'jobType', 'contactEmail'];
    const missingFields = requiredFields.filter(field => !jobData[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(jobData.contactEmail)) {
      throw new Error('Invalid contact email format');
    }

    console.log('Creating job with data:', jobData);

    const response = await api.post(JOBS_URL, jobData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('createJob error:', error);
    handleApiError(error); 
  }
};

// ✅ FIXED: Update a job posting
export const updateJob = async (jobId, jobData) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    if (!jobData) {
      throw new Error('Job data is required');
    }

    // Validate jobId format
    if (typeof jobId !== 'string' || jobId.length !== 24) {
      throw new Error('Invalid job ID format');
    }

    // Validate email if provided
    if (jobData.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(jobData.contactEmail)) {
        throw new Error('Invalid contact email format');
      }
    }

    console.log('Updating job:', jobId, 'with data:', jobData);

    const response = await api.put(`${JOBS_URL}/${jobId}`, jobData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('updateJob error:', error);
    handleApiError(error); 
  }
};

export const deleteJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Validate jobId format
    if (typeof jobId !== 'string' || jobId.length !== 24) {
      throw new Error('Invalid job ID format');
    }

    console.log('Deleting job:', jobId);

    const response = await api.delete(`${JOBS_URL}/${jobId}`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('deleteJob error:', error);
    handleApiError(error); 
  }
};

// ✅ FIXED: Save a job to user's saved jobs
export const saveJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.post(`${JOBS_URL}/${jobId}/save`, {}, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('saveJob error:', error);
    handleApiError(error); 
  }
};

// ✅ FIXED: Remove a job from user's saved jobs
export const unsaveJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.delete(`${JOBS_URL}/${jobId}/save`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('unsaveJob error:', error);
    handleApiError(error); 
  }
};

// ✅ FIXED: Apply to a job
export const applyToJob = async (jobId, applicationData = {}) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Validate jobId format
    if (typeof jobId !== 'string' || jobId.length !== 24) {
      throw new Error('Invalid job ID format');
    }

    console.log('Applying to job:', jobId, 'with data:', applicationData);

    const response = await api.post(`${JOBS_URL}/${jobId}/apply`, applicationData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('applyToJob error:', error);
    handleApiError(error);
  }
};

// ✅ FIXED: Get user's job applications
export const getMyApplications = async () => {
  try {
    const response = await api.get(`${JOBS_URL}/my-applications`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('getMyApplications error:', error);
    
    // Handle 304 for applications
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); 
  }
};

// ✅ FIXED: Get user's saved jobs
export const getMySavedJobs = async () => {
  try {
    const response = await api.get(`${JOBS_URL}/my-saved`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('getMySavedJobs error:', error);
    
    // Handle 304 for saved jobs
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); 
  }
};

// ✅ FIXED: Get user's posted jobs
export const getMyJobs = async () => {
  try {
    const response = await api.get(`${JOBS_URL}/my-jobs`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('getMyJobs error:', error);
    
    // Handle 304 for user's jobs
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); 
  }
};

// ✅ FIXED: Search jobs with advanced filters
export const searchJobs = async (searchParams) => {
  try {
    const response = await api.get(`${JOBS_URL}/search`, {
      params: searchParams,
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('searchJobs error:', error);
    
    // Handle 304 for search results
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); 
  }
};

export const getJobStats = async () => {
  try {
    const response = await api.get(`${JOBS_URL}/stats`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('getJobStats error:', error);
    
    // Handle 304 for stats
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    handleApiError(error); 
  }
};

export const getFeaturedJobs = async () => {
  try {
    const response = await api.get(`${JOBS_URL}/featured`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('getFeaturedJobs error:', error);
    
    // Handle 304 for featured jobs
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); 
  }
};

// ✅ FIXED: Get similar jobs
export const getSimilarJobs = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.get(`${JOBS_URL}/${jobId}/similar`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('getSimilarJobs error:', error);
    
    // Handle 304 for similar jobs
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    handleApiError(error); 
  }
};

export default {
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
  searchJobs,
  getJobStats,
  getFeaturedJobs,
  getSimilarJobs
};