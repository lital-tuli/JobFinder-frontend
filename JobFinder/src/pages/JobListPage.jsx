import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import JobCard from '../components/JobCard';
import JobTable from '../components/JobTable';
import jobService from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import { useJobInteractions } from '../hooks/useJobInteractions';

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('cards');
  const [sortBy, setSortBy] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    company: '',
    salaryMin: '',
    salaryMax: '',
    datePosted: ''
  });

  const { isAuthenticated, user } = useAuth();
  const { savedJobIds, toggleSaveJob, isJobSaved } = useJobInteractions();
  const navigate = useNavigate();
  const location = useLocation();

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load initial state from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlLocation = searchParams.get('location') || '';
    const urlJobType = searchParams.get('jobType') || '';
    const urlCompany = searchParams.get('company') || '';
    const urlSort = searchParams.get('sort') || 'latest';
    const urlView = searchParams.get('view') || localStorage.getItem('jobViewMode') || 'cards';

    setSearchTerm(urlSearch);
    setFilters({
      location: urlLocation,
      jobType: urlJobType,
      company: urlCompany,
      salaryMin: searchParams.get('salaryMin') || '',
      salaryMax: searchParams.get('salaryMax') || '',
      datePosted: searchParams.get('datePosted') || ''
    });
    setSortBy(urlSort);
    setViewMode(urlView);
  }, [searchParams]);

  // Update URL when search/filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchTerm) params.set('search', debouncedSearchTerm);
    if (filters.location) params.set('location', filters.location);
    if (filters.jobType) params.set('jobType', filters.jobType);
    if (filters.company) params.set('company', filters.company);
    if (filters.salaryMin) params.set('salaryMin', filters.salaryMin);
    if (filters.salaryMax) params.set('salaryMax', filters.salaryMax);
    if (filters.datePosted) params.set('datePosted', filters.datePosted);
    if (sortBy !== 'latest') params.set('sort', sortBy);
    if (viewMode !== 'cards') params.set('view', viewMode);

    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, filters, sortBy, viewMode, setSearchParams]);

  // Fetch jobs with filters
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const searchFilters = {
        search: debouncedSearchTerm,
        location: filters.location,
        jobType: filters.jobType,
        company: filters.company,
        salaryMin: filters.salaryMin,
        salaryMax: filters.salaryMax,
        datePosted: filters.datePosted
      };

      // Remove empty filters
      const cleanFilters = Object.fromEntries(
        Object.entries(searchFilters).filter(([_, value]) => value)
      );

      const data = await jobService.getAllJobs(cleanFilters);
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.error || 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filters]);

  // Fetch jobs when filters change
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Filter and sort jobs locally for better performance
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];

    // Client-side sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        case 'salary_high':
          return (parseSalary(b.salary) || 0) - (parseSalary(a.salary) || 0);
        case 'salary_low':
          return (parseSalary(a.salary) || 0) - (parseSalary(b.salary) || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [jobs, sortBy]);

  // Parse salary for sorting
  const parseSalary = (salaryString) => {
    if (!salaryString) return 0;
    const numbers = salaryString.match(/\d+/g);
    if (!numbers) return 0;
    return parseInt(numbers[0]);
  };

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Handle search change
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handle view mode change
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    localStorage.setItem('jobViewMode', mode);
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  // Handle save job
  const handleSaveJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }

    try {
      await toggleSaveJob(jobId);
    } catch (err) {
      setError(err.message || 'Failed to save job');
    }
  }, [isAuthenticated, toggleSaveJob, navigate, location]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({
      location: '',
      jobType: '',
      company: '',
      salaryMin: '',
      salaryMax: '',
      datePosted: ''
    });
    setSortBy('latest');
    setSearchParams({});
  }, [setSearchParams]);

  // Get unique filter options from jobs
  const filterOptions = useMemo(() => {
    const jobTypes = [...new Set(jobs.map(job => job.jobType).filter(Boolean))];
    const companies = [...new Set(jobs.map(job => job.company).filter(Boolean))];
    const locations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
    
    return { jobTypes, companies, locations };
  }, [jobs]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return searchTerm || Object.values(filters).some(value => value);
  }, [searchTerm, filters]);

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="fw-bold">Find Your Perfect Job</h1>
              <p className="text-muted">
                {filteredAndSortedJobs.length} job{filteredAndSortedJobs.length !== 1 ? 's' : ''} available
                {hasActiveFilters && (
                  <span className="ms-2">
                    • <button 
                        className="btn btn-link p-0 text-decoration-none small"
                        onClick={clearFilters}
                      >
                        Clear all filters
                      </button>
                  </span>
                )}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary d-md-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <i className="bi bi-funnel me-1"></i>
                Filters
              </button>
              {isAuthenticated && user?.role === 'recruiter' && (
                <Link to="/post-job" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-1"></i>
                  Post Job
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className={`card shadow-sm border-0 mb-4 ${showFilters || 'd-none d-md-block'}`}>
        <div className="card-body p-4">
          {/* Main Search Bar */}
          <div className="row g-3 mb-3">
            <div className="col-md-5">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-search text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Job title, keywords, or company name..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-geo-alt text-primary"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Location (city, state, or remote)"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <button 
                className="btn btn-primary btn-lg w-100"
                onClick={fetchJobs}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="bi bi-search me-2"></i>
                    Search Jobs
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="row g-3 mb-3">
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
              >
                <option value="">All Job Types</option>
                {filterOptions.jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Company name"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.datePosted}
                onChange={(e) => handleFilterChange('datePosted', e.target.value)}
              >
                <option value="">Any time</option>
                <option value="1">Last 24 hours</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last week</option>
                <option value="14">Last 2 weeks</option>
                <option value="30">Last month</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Min salary"
                value={filters.salaryMin}
                onChange={(e) => handleFilterChange('salaryMin', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Max salary"
                value={filters.salaryMax}
                onChange={(e) => handleFilterChange('salaryMax', e.target.value)}
              />
            </div>
            <div className="col-md-1">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
                title="Clear all filters"
              >
                <i className="bi bi-x-circle"></i>
              </button>
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <label className="form-label mb-0 small text-muted">Sort by:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="latest">Latest Jobs</option>
                <option value="oldest">Oldest Jobs</option>
                <option value="title">Job Title A-Z</option>
                <option value="company">Company A-Z</option>
                <option value="location">Location A-Z</option>
                <option value="salary_high">Salary High to Low</option>
                <option value="salary_low">Salary Low to High</option>
              </select>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted me-2">View:</span>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                  onClick={() => handleViewModeChange('cards')}
                  title="Card view"
                >
                  <i className="bi bi-grid-3x3-gap"></i>
                </button>
                <button
                  type="button"
                  className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
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

      {/* Error Display */}
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Finding the best jobs for you...</p>
        </div>
      ) : filteredAndSortedJobs.length === 0 ? (
        <div className="text-center py-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <i className="bi bi-search text-muted mb-3" style={{ fontSize: '4rem' }}></i>
              <h3 className="fw-bold mb-3">No Jobs Found</h3>
              <p className="text-muted mb-4">
                {hasActiveFilters 
                  ? "We couldn't find any jobs matching your criteria. Try adjusting your search filters."
                  : "There are currently no job listings available. Please check back later."
                }
              </p>
              <div className="d-flex justify-content-center gap-3">
                {hasActiveFilters && (
                  <button className="btn btn-primary" onClick={clearFilters}>
                    Clear All Filters
                  </button>
                )}
                <Link to="/companies" className="btn btn-outline-secondary">
                  <i className="bi bi-building me-2"></i>
                  Browse Companies
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Jobs Display */}
          {viewMode === 'table' ? (
            <JobTable 
              jobs={filteredAndSortedJobs} 
              onSave={handleSaveJob}
              savedJobs={savedJobIds}
            />
          ) : (
            <div className="row">
              {filteredAndSortedJobs.map((job) => (
                <div className="col-lg-4 col-md-6 mb-4" key={job._id}>
                  <JobCard 
                    job={job} 
                    saved={isJobSaved(job._id)}
                    onSave={handleSaveJob}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More / Pagination (Future Enhancement) */}
          {filteredAndSortedJobs.length > 0 && (
            <div className="text-center mt-5">
              <p className="text-muted">
                Showing {filteredAndSortedJobs.length} job{filteredAndSortedJobs.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </>
      )}

      {/* Job Search Tips */}
      {!loading && jobs.length > 0 && (
        <div className="mt-5">
          <div className="card bg-light border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-lightbulb text-warning me-2"></i>
                Job Search Tips
              </h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Use Keywords</h6>
                  <p className="text-muted small mb-0">
                    Include specific skills, job titles, or technologies in your search for better results.
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Set Job Alerts</h6>
                  <p className="text-muted small mb-0">
                    Save your searches and get notified when new matching jobs are posted.
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Apply Quickly</h6>
                  <p className="text-muted small mb-0">
                    The best opportunities get filled fast. Apply as soon as you find a good match.
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <Link to="/saved-jobs" className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-bookmark me-1"></i>View Saved Jobs
                </Link>
                <Link to="/applied-jobs" className="btn btn-outline-success btn-sm">
                  <i className="bi bi-briefcase me-1"></i>My Applications
                </Link>
                <Link to="/profile" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-person me-1"></i>Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListPage;