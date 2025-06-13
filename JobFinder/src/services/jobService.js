import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const JOBS_URL = `${API_BASE_URL}/jobs`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
  validateStatus: function (status) {
    // Accept status codes from 200-399 (including 304)
    return status >= 200 && status < 400;
  }
});

api.interceptors.response.use(
  (response) => {
    // Handle 304 responses as success
    if (response.status === 304) {
      console.log('304 Not Modified - content unchanged');
      response.data = response.data || [];
    }
    return response;
  },
  (error) => {
    // Don't treat 304 as error
    if (error.response && error.response.status === 304) {
      console.log('304 intercepted in error handler - returning success');
      return Promise.resolve({
        ...error.response,
        data: error.response.data || []
      });
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  
  try {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      if (status === 304) {
        console.log('Content not modified (304), using cached data');
        return data || [];
      }
      
      if (status === 401) {
        errorMessage = 'Unauthorized. Please log in to continue.';
        // Clear tokens on 401
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      } else if (status === 403) {
        errorMessage = 'Access denied. You don\'t have permission for this action.';
      } else if (status === 404) {
        errorMessage = 'Resource not found. The job may have been removed or is no longer available.';
      } else if (status === 409) {
        errorMessage = 'Conflict. You may have already applied for this job.';
      } else if (status === 422) {
        errorMessage = 'Validation error. Please check your input and try again.';
      } else if (status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = data?.message || data || error.message || errorMessage;
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      } else {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage;
    }
  } catch (e) {
    console.error('Error in error handler:', e);
  }
  
  console.error("API Error:", {
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
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
    return handleApiError(error);
  }
};

// Get a job by ID with validation
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
    // ✅ FIX: Handle 304 for individual jobs too
    if (error.response && error.response.status === 304) {
      return error.response.data || {};
    }
    return handleApiError(error);
  }
};

// Create a new job posting with validation
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

    // Validate job type
    const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
    if (!validJobTypes.includes(jobData.jobType)) {
      throw new Error('Invalid job type');
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to post a job" };
    }

    console.log('Creating job with data:', jobData);

    const response = await api.post(JOBS_URL, jobData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('createJob error:', error);
    return handleApiError(error);
  }
};

// Update a job with validation
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

    // Validate email format if provided
    if (jobData.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(jobData.contactEmail)) {
        throw new Error('Invalid contact email format');
      }
    }

    // Validate job type if provided
    if (jobData.jobType) {
      const validJobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
      if (!validJobTypes.includes(jobData.jobType)) {
        throw new Error('Invalid job type');
      }
    }

    const response = await api.put(`${JOBS_URL}/${jobId}`, jobData, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Apply for a job
export const applyForJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Validate jobId format
    if (typeof jobId !== 'string' || jobId.length !== 24) {
      throw new Error('Invalid job ID format');
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to apply for jobs" };
    }

    const response = await api.post(`${JOBS_URL}/${jobId}/apply`, {}, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Save/bookmark a job
export const saveJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Validate jobId format
    if (typeof jobId !== 'string' || jobId.length !== 24) {
      throw new Error('Invalid job ID format');
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to save jobs" };
    }

    const response = await api.post(`${JOBS_URL}/${jobId}/save`, {}, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a job
export const deleteJob = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Validate jobId format
    if (typeof jobId !== 'string' || jobId.length !== 24) {
      throw new Error('Invalid job ID format');
    }

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to delete jobs" };
    }

    const response = await api.delete(`${JOBS_URL}/${jobId}`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Filter jobs (client-side filtering)
export const filterJobs = (jobs, filters) => {
  if (!Array.isArray(jobs)) {
    console.warn('filterJobs: jobs parameter is not an array');
    return [];
  }

  return jobs.filter(job => {
    if (filters.jobType && job.jobType !== filters.jobType) return false;
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.company && !job.company.toLowerCase().includes(filters.company.toLowerCase())) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.requirements.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
};

// Paginate jobs (client-side pagination)
export const paginateJobs = (jobs, page = 1, limit = 10) => {
  if (!Array.isArray(jobs)) {
    console.warn('paginateJobs: jobs parameter is not an array');
    return { jobs: [], totalPages: 0, currentPage: 1, totalJobs: 0 };
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedJobs = jobs.slice(startIndex, endIndex);
  
  return {
    jobs: paginatedJobs,
    totalPages: Math.ceil(jobs.length / limit),
    currentPage: page,
    totalJobs: jobs.length
  };
};

// Search jobs (wrapper for getAllJobs with search)
export const searchJobs = async (query) => {
  try {
    return await getAllJobs({ search: query });
  } catch (error) {
    return handleApiError(error);
  }
};

// Get job statistics
export const getJobStatistics = async () => {
  try {
    const response = await api.get(`${JOBS_URL}/statistics`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get job applicants (for recruiters)
export const getJobApplicants = async (jobId) => {
  try {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const response = await api.get(`${JOBS_URL}/${jobId}/applicants`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Download applicant resume
export const downloadApplicantResume = async (userId, applicantName) => {
  try {
    const response = await api.get(`/users/${userId}/resume/download`, {
      headers: getAuthHeaders(),
      responseType: 'blob'
    });
    
    // Extract filename from response headers or use default
    let filename = `${applicantName.replace(/\s+/g, '_')}_resume.pdf`;
    
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

// Get my job listings (for recruiters)
export const getMyJobListings = async () => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    
    if (!token) {
      throw { response: { status: 401 }, message: "Please log in to view your listings" };
    }

    const response = await api.get(`${JOBS_URL}/my-listings`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    // ✅ FIX: Handle 304 for my listings too
    if (error.response && error.response.status === 304) {
      return error.response.data || [];
    }
    return handleApiError(error);
  }
};

// Advanced search function with query building
export const searchJobsAdvanced = async (searchParams) => {
  try {
    const {
      query = '',
      location = '',
      jobType = '',
      company = '',
      salaryMin = '',
      salaryMax = '',
      sortBy = 'date',
      page = 1,
      limit = 10
    } = searchParams || {};

    const params = new URLSearchParams();
    
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    if (jobType) params.append('jobType', jobType);
    if (company) params.append('company', company);
    if (salaryMin) params.append('salaryMin', salaryMin);
    if (salaryMax) params.append('salaryMax', salaryMax);
    if (sortBy) params.append('sort', sortBy);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const queryString = params.toString();
    const url = queryString ? `${JOBS_URL}?${queryString}` : JOBS_URL;
    
    const response = await api.get(url, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Default export with all functions
const jobService = {
  getAllJobs,
  getJobById,
  getMyJobListings,
  createJob,
  updateJob,
  applyForJob,
  saveJob,
  deleteJob,
  filterJobs,
  paginateJobs,
  searchJobs,
  searchJobsAdvanced,
  getJobStatistics,
  getJobApplicants,
  downloadApplicantResume
};

export default jobService;