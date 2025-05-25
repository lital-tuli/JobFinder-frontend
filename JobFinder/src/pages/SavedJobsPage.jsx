import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJobInteractions } from '../context/JobInteractionContext';
import JobCard from '../components/JobCard';
import userService from '../services/userService';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('cards');
  const [sortBy, setSortBy] = useState('savedDate');
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    company: '',
    search: ''
  });
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [actionLoading, setActionLoading] = useState(false); // Fixed: Added missing state

  const { user } = useAuth();
  const { toggleSaveJob, refreshData } = useJobInteractions();
  const navigate = useNavigate();

  // Load saved jobs
  const fetchSavedJobs = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await userService.getSavedJobs();
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.error || 'Failed to fetch saved jobs');
      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  // Load preferences from URL and localStorage
  useEffect(() => {
    const view = searchParams.get('view') || localStorage.getItem('savedJobsView') || 'cards';
    const sort = searchParams.get('sort') || localStorage.getItem('savedJobsSort') || 'savedDate';
    
    setViewMode(view);
    setSortBy(sort);
    
    // Load filters from URL
    setFilters({
      jobType: searchParams.get('jobType') || '',
      location: searchParams.get('location') || '',
      company: searchParams.get('company') || '',
      search: searchParams.get('search') || ''
    });
  }, [searchParams]);

  // Update URL when filters change
  const updateURL = useCallback((newFilters, newSort, newView) => {
    const params = new URLSearchParams();
    
    Object.entries(newFilters || filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    if (newSort || sortBy) params.set('sort', newSort || sortBy);
    if (newView || viewMode) params.set('view', newView || viewMode);
    
    setSearchParams(params);
  }, [filters, sortBy, viewMode, setSearchParams]);

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  }, [filters, updateURL]);

  // Handle sort change
  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
    localStorage.setItem('savedJobsSort', newSort);
    updateURL(null, newSort);
  }, [updateURL]);

  // Handle view mode change
  const handleViewModeChange = useCallback((newView) => {
    setViewMode(newView);
    localStorage.setItem('savedJobsView', newView);
    updateURL(null, null, newView);
  }, [updateURL]);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...savedJobs];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchLower) ||
        job.company?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.company) {
      filtered = filtered.filter(job => 
        job.company?.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    // Apply sorting - Fixed: Removed duplicate case and syntax error
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'savedDate':
          return new Date(b.savedAt || b.createdAt) - new Date(a.savedAt || a.createdAt);
        case 'jobTitle':
          return (a.title || '').localeCompare(b.title || '');
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        case 'postedDate':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'salary': {
          const getSalaryNum = (salary) => {
            if (!salary) return 0;
            const num = salary.match(/\d+/);
            return num ? parseInt(num[0]) : 0;
          };
          return getSalaryNum(b.salary) - getSalaryNum(a.salary);
        }
        default:
          return 0;
      }
    });

    return filtered;
  }, [savedJobs, filters, sortBy]);

  // Handle job unsave
  const handleUnsaveJob = useCallback(async (jobId) => {
    try {
      await toggleSaveJob(jobId);
      setSavedJobs(prev => prev.filter(job => job._id !== jobId));
      setSelectedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
      
      // Refresh job interactions data
      await refreshData();
    } catch (err) {
      setError(err.error || 'Failed to unsave job');
    }
  }, [toggleSaveJob, refreshData]);

  // Bulk actions
  const handleSelectJob = useCallback((jobId) => {
    setSelectedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedJobs.size === filteredAndSortedJobs.length) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(filteredAndSortedJobs.map(job => job._id)));
    }
  }, [selectedJobs.size, filteredAndSortedJobs]);

  const handleBulkUnsave = useCallback(async () => {
    if (selectedJobs.size === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to remove ${selectedJobs.size} job${selectedJobs.size > 1 ? 's' : ''} from your saved jobs?`
    );
    
    if (!confirmed) return;
    
    setActionLoading(true);
    try {
      const promises = Array.from(selectedJobs).map(jobId => toggleSaveJob(jobId));
      await Promise.all(promises);
      
      setSavedJobs(prev => prev.filter(job => !selectedJobs.has(job._id)));
      setSelectedJobs(new Set());
      
      await refreshData();
    } catch (err) {
      setError(err.error || 'Failed to remove selected jobs');
    } finally {
      setActionLoading(false);
    }
  }, [selectedJobs, toggleSaveJob, refreshData]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      jobType: '',
      location: '',
      company: '',
      search: ''
    });
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    const jobTypes = [...new Set(savedJobs.map(job => job.jobType).filter(Boolean))];
    const companies = [...new Set(savedJobs.map(job => job.company).filter(Boolean))];
    const locations = [...new Set(savedJobs.map(job => job.location).filter(Boolean))];
    
    return { jobTypes, companies, locations };
  }, [savedJobs]);

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h1 className="fw-bold">My Saved Jobs</h1>
              <p className="text-muted">
                {filteredAndSortedJobs.length} of {savedJobs.length} saved jobs
                {Object.values(filters).some(f => f) && (
                  <span className="ms-2">
                    • <button 
                        className="btn btn-link p-0 text-decoration-none small"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                  </span>
                )}
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/jobs" className="btn btn-outline-primary">
                <i className="bi bi-search me-1"></i>
                Find More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search saved jobs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={filters.jobType}
                onChange={(e) => handleFilterChange('jobType', e.target.value)}
              >
                <option value="">All Types</option>
                {filterOptions.jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Company"
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                <option value="savedDate">Recently Saved</option>
                <option value="postedDate">Recently Posted</option>
                <option value="jobTitle">Job Title</option>
                <option value="company">Company</option>
                <option value="salary">Salary</option>
              </select>
            </div>
            <div className="col-md-1">
              <div className="btn-group w-100">
                <button
                  className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                  onClick={() => handleViewModeChange('cards')}
                  title="Card view"
                >
                  <i className="bi bi-grid-3x3-gap"></i>
                </button>
                <button
                  className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                  onClick={() => handleViewModeChange('table')}
                  title="Table view"
                >
                  <i className="bi bi-list-ul"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {savedJobs.length > 0 && (
            <div className="d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="selectAll"
                  checked={selectedJobs.size === filteredAndSortedJobs.length && filteredAndSortedJobs.length > 0}
                  onChange={handleSelectAll}
                />
                <label className="form-check-label" htmlFor="selectAll">
                  Select All ({selectedJobs.size} selected)
                </label>
              </div>
              
              {selectedJobs.size > 0 && (
                <div className="btn-group">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleBulkUnsave}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Removing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash me-1"></i>
                        Remove Selected ({selectedJobs.size})
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
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

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your saved jobs...</p>
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-5">
              <i className="bi bi-bookmark text-muted mb-3" style={{ fontSize: '4rem' }}></i>
              <h3 className="fw-bold mb-3">No Saved Jobs Yet</h3>
              <p className="text-muted mb-4">
                Start building your saved jobs collection by browsing available positions and clicking the bookmark icon on jobs you're interested in.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/jobs" className="btn btn-primary px-4">
                  <i className="bi bi-search me-2"></i>
                  Browse Jobs
                </Link>
                <Link to="/companies" className="btn btn-outline-secondary px-4">
                  <i className="bi bi-building me-2"></i>
                  Explore Companies
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : filteredAndSortedJobs.length === 0 ? (
        <div className="text-center py-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <i className="bi bi-search text-muted mb-3" style={{ fontSize: '3rem' }}></i>
              <h4 className="fw-bold mb-3">No Jobs Match Your Filters</h4>
              <p className="text-muted mb-4">
                Try adjusting your search criteria to see more results.
              </p>
              <button 
                className="btn btn-primary"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th width="40">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedJobs.size === filteredAndSortedJobs.length && filteredAndSortedJobs.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Salary</th>
                  <th>Saved On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedJobs.map(job => (
                  <tr key={job._id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedJobs.has(job._id)}
                        onChange={() => handleSelectJob(job._id)}
                      />
                    </td>
                    <td>
                      <div>
                        <Link 
                          to={`/jobs/${job._id}`}
                          className="fw-semibold text-decoration-none"
                        >
                          {job.title}
                        </Link>
                        <div className="text-muted small">
                          {job.description?.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td>{job.company}</td>
                    <td>
                      <i className="bi bi-geo-alt text-primary me-1"></i>
                      {job.location}
                    </td>
                    <td>
                      <span className={`badge ${job.jobType === 'Full-time' ? 'bg-primary' : 'bg-secondary'}`}>
                        {job.jobType}
                      </span>
                    </td>
                    <td>
                      {job.salary ? (
                        <span className="text-success fw-medium">{job.salary}</span>
                      ) : (
                        <span className="text-muted">Not specified</span>
                      )}
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(job.savedAt || job.createdAt).toLocaleDateString()}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-eye me-1"></i>View
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleUnsaveJob(job._id)}
                          title="Remove from saved"
                        >
                          <i className="bi bi-bookmark-dash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredAndSortedJobs.map(job => (
            <div className="col-lg-4 col-md-6 mb-4" key={job._id}>
              <div className="position-relative">
                <div className="position-absolute top-0 start-0 p-2" style={{ zIndex: 10 }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedJobs.has(job._id)}
                    onChange={() => handleSelectJob(job._id)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                </div>
                <JobCard 
                  job={job} 
                  saved={true}
                  onSave={() => handleUnsaveJob(job._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Modal for bulk operations */}
      {selectedJobs.size > 0 && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3" style={{ zIndex: 1050 }}>
          <div className="card shadow border-0">
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">
                  {selectedJobs.size} job{selectedJobs.size > 1 ? 's' : ''} selected
                </span>
                <div className="btn-group">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const jobIds = Array.from(selectedJobs);
                      const jobsParam = jobIds.join(',');
                      navigate(`/jobs?saved=${jobsParam}`);
                    }}
                  >
                    <i className="bi bi-eye me-1"></i>
                    View Selected
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleBulkUnsave}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <i className="bi bi-trash"></i>
                    )}
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setSelectedJobs(new Set())}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips and Suggestions */}
      {savedJobs.length > 0 && filteredAndSortedJobs.length > 0 && (
        <div className="mt-5">
          <div className="card bg-light border-0">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-lightbulb text-warning me-2"></i>
                Tips for Managing Your Saved Jobs
              </h5>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Stay Organized</h6>
                  <p className="text-muted small mb-0">
                    Use filters and sorting to quickly find the jobs you're most interested in.
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Apply Soon</h6>
                  <p className="text-muted small mb-0">
                    Don't wait too long! Popular positions get filled quickly.
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <h6 className="fw-semibold">Keep Exploring</h6>
                  <p className="text-muted small mb-0">
                    Regularly check for new opportunities that match your interests.
                  </p>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <Link to="/jobs" className="btn btn-primary btn-sm">
                  <i className="bi bi-search me-1"></i>Find More Jobs
                </Link>
                <Link to="/companies" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-building me-1"></i>Browse Companies
                </Link>
                <Link to="/applied-jobs" className="btn btn-outline-success btn-sm">
                  <i className="bi bi-briefcase me-1"></i>View Applications
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {savedJobs.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-3 col-6 mb-3">
            <div className="card text-center border-0 bg-primary bg-opacity-10">
              <div className="card-body py-3">
                <h4 className="text-primary mb-0">{savedJobs.length}</h4>
                <small className="text-muted">Total Saved</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card text-center border-0 bg-success bg-opacity-10">
              <div className="card-body py-3">
                <h4 className="text-success mb-0">
                  {new Set(savedJobs.map(job => job.company)).size}
                </h4>
                <small className="text-muted">Companies</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card text-center border-0 bg-info bg-opacity-10">
              <div className="card-body py-3">
                <h4 className="text-info mb-0">
                  {new Set(savedJobs.map(job => job.jobType)).size}
                </h4>
                <small className="text-muted">Job Types</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card text-center border-0 bg-warning bg-opacity-10">
              <div className="card-body py-3">
                <h4 className="text-warning mb-0">
                  {savedJobs.filter(job => {
                    const savedDate = new Date(job.savedAt || job.createdAt);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return savedDate > weekAgo;
                  }).length}
                </h4>
                <small className="text-muted">This Week</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;