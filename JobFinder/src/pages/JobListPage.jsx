// src/pages/JobListPage.jsx - Refactored and Simplified
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import JobCard from '../components/JobCard';
import JobTable from '../components/JobTable';
import jobService from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import { useJobInteractions } from '../hooks/useJobInteractions';
import JobSearchFilters from '../components/JobSearch/JobSearchFilters';
import JobSearchTips from '../components/JobSearch/JobSearchTips';
import { useDebounce } from '../hooks/useDebounce';

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
        Object.entries(searchFilters).filter(([, value]) => value)
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
      <JobSearchFilters
        searchTerm={searchTerm}
        filters={filters}
        sortBy={sortBy}
        viewMode={viewMode}
        showFilters={showFilters}
        loading={loading}
        filterOptions={filterOptions}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onViewModeChange={handleViewModeChange}
        onSearch={fetchJobs}
        onClearFilters={clearFilters}
      />

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
      {!loading && jobs.length > 0 && <JobSearchTips />}
    </div>
  );
};

export default JobListPage;