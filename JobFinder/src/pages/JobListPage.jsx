// src/pages/JobListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import JobTable from '../components/JobTable';
import jobService from '../services/jobService';
import { useAuth } from '../hooks/useAuth';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salary: ''
  });

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await jobService.getAllJobs(filters);
        setJobs(data);
      } catch (err) {
        setError(err.error || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  // Load saved jobs for logged in users
  useEffect(() => {
    const loadSavedJobs = async () => {
      if (isAuthenticated && user) {
        try {
          const { default: userService } = await import('../services/userService');
          const saved = await userService.getSavedJobs();
          setSavedJobs(saved.map(job => job._id));
        } catch (err) {
          console.error('Failed to load saved jobs:', err);
        }
      }
    };

    loadSavedJobs();
  }, [isAuthenticated, user]);

  // Load view mode preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('jobViewMode');
    if (savedViewMode && ['cards', 'table'].includes(savedViewMode)) {
      setViewMode(savedViewMode);
    }
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('jobViewMode', mode);
  };

  const handleSaveJob = async (jobId) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    try {
      const { default: userService } = await import('../services/userService');
      await userService.saveJob(jobId);
      
      // Update saved jobs state
      setSavedJobs(prev => 
        prev.includes(jobId) 
          ? prev.filter(id => id !== jobId)
          : [...prev, jobId]
      );
    } catch (err) {
      setError(err.error || 'Failed to save job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true;
    
    const searchString = `${job.title} ${job.company} ${job.location} ${job.description}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">Find Jobs</h1>
          <p className="text-muted">Search and filter jobs that match your skills and interests</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search jobs by title, company, or keywords..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-primary w-100">
                <i className="bi bi-search"></i>
              </button>
            </div>
            <div className="col-md-2">
              {/* View Mode Toggle */}
              <div className="btn-group w-100" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewModeChange('cards')}
                  title="Card view"
                >
                  <i className="bi bi-grid-3x3-gap"></i>
                </button>
                <button
                  type="button"
                  className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleViewModeChange('table')}
                  title="Table view"
                >
                  <i className="bi bi-list-ul"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </span>
        <span className="text-muted">
          View: {viewMode === 'cards' ? 'Cards' : 'Table'}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="alert alert-info">
          No jobs found matching your criteria. Try adjusting your search or filters.
        </div>
      ) : viewMode === 'table' ? (
        <JobTable 
          jobs={filteredJobs} 
          onSave={handleSaveJob}
          savedJobs={savedJobs}
        />
      ) : (
        <div className="row">
          {filteredJobs.map((job, index) => (
            <div className="col-md-6 col-lg-4 mb-4" key={job._id || job.id || index}>
              <JobCard 
                job={job} 
                saved={savedJobs.includes(job._id)}
                onSave={handleSaveJob}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListPage;