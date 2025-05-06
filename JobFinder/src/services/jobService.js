// src/services/jobService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:8000/api/v1';
const JOBS_URL = `${API_BASE_URL}/jobs`;

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
  
  console.error("API Error:", errorMessage);
  throw { error: errorMessage };
};

// Helper to add auth token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { "x-auth-token": token } : {};
};

// Get all jobs with optional filters
export const getAllJobs = async (filters = {}) => {
  try {
    const response = await api.get(JOBS_URL, { params: filters });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a job by ID
export const getJobById = async (jobId) => {
  try {
    const response = await api.get(`${JOBS_URL}/${jobId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get jobs posted by the logged-in recruiter
export const getMyListings = async () => {
  try {
    const response = await api.get(`${JOBS_URL}/my-listings`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new job posting
export const createJob = async (jobData) => {
  try {
    const response = await api.post(JOBS_URL, jobData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update a job
export const updateJob = async (jobId, jobData) => {
  try {
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
    const response = await api.post(`${JOBS_URL}/${jobId}/apply`, {}, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Save a job for later
export const saveJob = async (jobId) => {
  try {
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
    const response = await api.delete(`${JOBS_URL}/${jobId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Search/filter helper function
export const filterJobs = (jobs, query) => {
  if (!query || query.trim() === '') {
    return jobs;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return jobs.filter((job) => {
    const searchString = `${job.title} ${job.company} ${job.location} ${job.jobType} ${job.description}`.toLowerCase();
    return searchString.includes(searchTerm);
  });
};

// Pagination helper
export const paginateJobs = (jobs, page, jobsPerPage) => {
  const startIndex = (page - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  
  return {
    currentPage: page,
    totalPages: Math.ceil(jobs.length / jobsPerPage),
    totalJobs: jobs.length,
    results: jobs.slice(startIndex, endIndex)
  };
};

export default {
  getAllJobs,
  getJobById,
  getMyListings,
  createJob,
  updateJob,
  applyForJob,
  saveJob,
  deleteJob,
  filterJobs,
  paginateJobs
};