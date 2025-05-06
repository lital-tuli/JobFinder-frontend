import axios from "axios";

const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:8000/api/v1';
const JOBS_URL = `${API_BASE_URL}/jobs`;

// Get all jobs with optional filters
export const getAllJobs = async (filters = {}) => {
  try {
    const config = {
      method: "get",
      url: JOBS_URL,
      params: filters,
      headers: {}
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

// Get a job by ID
export const getJobById = async (jobId) => {
  try {
    const config = {
      method: "get",
      url: `${JOBS_URL}/${jobId}`,
      headers: {}
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
};

// Get jobs posted by the logged-in recruiter
export const getMyListings = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method: "get",
      url: `${JOBS_URL}/my-listings`,
      headers: {
        "x-auth-token": token
      }
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching your job listings:", error);
    throw error;
  }
};

// Create a new job posting
export const createJob = async (jobData) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method: "post",
      url: JOBS_URL,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      data: jobData
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Update a job
export const updateJob = async (jobId, jobData) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method: "put",
      url: `${JOBS_URL}/${jobId}`,
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token
      },
      data: jobData
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Apply for a job
export const applyForJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method: "post",
      url: `${JOBS_URL}/${jobId}/apply`,
      headers: {
        "x-auth-token": token
      }
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};

// Save a job for later
export const saveJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method: "post",
      url: `${JOBS_URL}/${jobId}/save`,
      headers: {
        "x-auth-token": token
      }
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error saving job:", error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      method: "delete",
      url: `${JOBS_URL}/${jobId}`,
      headers: {
        "x-auth-token": token
      }
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

// Get saved jobs
export const getSavedJobs = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);
    const config = {
      method: "get",
      url: `${API_BASE_URL}/users/${userId}/saved-jobs`,
      headers: {
        "x-auth-token": token
      }
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    throw error;
  }
};

// Get applied jobs
export const getAppliedJobs = async () => {
  try {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);
    const config = {
      method: "get",
      url: `${API_BASE_URL}/users/${userId}/applied-jobs`,
      headers: {
        "x-auth-token": token
      }
    };
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    throw error;
  }
};

// Helper function to get user ID from token
const getUserIdFromToken = (token) => {
  try {
    // You can implement a proper JWT decode function here
    // For now, this is a placeholder
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded._id;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Pagination helper functions
export const setPagesNumber = (jobs, jobsPerPage) => {
  const pages = [];
  const pagesLength = Math.ceil(jobs.length / jobsPerPage);
  for (let i = 0; i < pagesLength; i++) {
    pages[i] = { id: i + 1, value: i + 1, active: true };
  }
  return pages;
};

export const paginateJobs = (jobs, page, jobsPerPage) => {
  const start = (page - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  const displayJobs = jobs.slice(start, end);
  const range = `${start + 1} - ${end > jobs.length ? jobs.length : end}`;
  return { displayJobs, range };
};

// Search/filter helper function
export const filterJobs = (jobs, query) => {
  return jobs.filter((job) => {
    const searchString = `${job.title} ${job.company} ${job.location} ${job.jobType} ${job.description} ${job.requirements}`.toLowerCase();
    return searchString.includes(query.toLowerCase());
  });
};

// Export default object with all functions
export default {
  getAllJobs,
  getJobById,
  getMyListings,
  createJob,
  updateJob,
  applyForJob,
  saveJob,
  deleteJob,
  getSavedJobs,
  getAppliedJobs,
  setPagesNumber,
  paginateJobs,
  filterJobs
};