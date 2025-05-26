import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJobInteractions } from '../hooks/useJobInteractions';
import JobCard from '../components/JobCard';
import SavedJobsFilters from '../components/savedjobs/SavedJobsFilters';
import SavedJobsTable from '../components/savedjobs/SavedJobsTable';
import SavedJobsStats from '../components/savedjobs/SavedJobsStats';
import SavedJobsTips from '../components/savedjobs/SavedJobsTips';
import BulkActionBar from '../components/savedjobs/BulkActionBar';

const SavedJobsPage = () => {
  const { 
    savedJobs, 
    loading, 
    error,
    toggleSaveJob,
    bulkRemoveSavedJobs,
    refreshData,
    clearError,
    initialized
  } = useJobInteractions();

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
  const [actionLoading, setActionLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  useAuth();
  const navigate = useNavigate();

  // Load initial state from URL
  useEffect(() => {
    const view = searchParams.get('view') || localStorage.getItem('savedJobsView') || 'cards';
    const sort = searchParams.get('sort') || localStorage.getItem('savedJobsSort') || 'savedDate';
    
    setViewMode(view);
    setSortBy(sort);
    setFilters({
      jobType: searchParams.get('jobType') || '',
      location: searchParams.get('location') || '',
      company: searchParams.get('company') || '',
      search: searchParams.get('search') || ''
    });
  }, [searchParams]);

  // Clear context error on mount
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

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

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    if (!Array.isArray(savedJobs)) return [];
    
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

    // Apply sorting
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

  // Handler functions
  const handleUnsaveJob = useCallback(async (jobId) => {
    try {
      setLocalError('');
      await toggleSaveJob(jobId);
      setSelectedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    } catch (err) {
      setLocalError(err.message || 'Failed to unsave job');
    }
  }, [toggleSaveJob]);

  const handleBulkUnsave = useCallback(async () => {
    if (selectedJobs.size === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to remove ${selectedJobs.size} job${selectedJobs.size > 1 ? 's' : ''} from your saved jobs?`
    );
    
    if (!confirmed) return;
    
    setActionLoading(true);
    setLocalError('');
    
    try {
      await bulkRemoveSavedJobs(Array.from(selectedJobs));
      setSelectedJobs(new Set());
    } catch (err) {
      setLocalError(err.message || 'Failed to remove selected jobs');
    } finally {
      setActionLoading(false);
    }
  }, [selectedJobs, bulkRemoveSavedJobs]);

  const clearFilters = useCallback(() => {
    setFilters({ jobType: '', location: '', company: '', search: '' });
    setSearchParams(new URLSearchParams());
    setSelectedJobs(new Set());
  }, [setSearchParams]);

  // Get unique filter options
  const filterOptions = useMemo(() => {
    if (!Array.isArray(savedJobs)) return { jobTypes: [], companies: [], locations: [] };
    
    return {
      jobTypes: [...new Set(savedJobs.map(job => job.jobType).filter(Boolean))],
      companies: [...new Set(savedJobs.map(job => job.company).filter(Boolean))],
      locations: [...new Set(savedJobs.map(job => job.location).filter(Boolean))]
    };
  }, [savedJobs]);

  // Combined error message
  const errorMessage = localError || error;

  // Loading state
  if (!initialized && loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your saved jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
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
              <button 
                className="btn btn-outline-secondary"
                onClick={refreshData}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                ) : (
                  <i className="bi bi-arrow-clockwise me-1"></i>
                )}
                Refresh
              </button>
              <Link to="/jobs" className="btn btn-primary">
                <i className="bi bi-search me-1"></i>
                Find More Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => {
              setLocalError('');
              clearError();
            }}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Filters */}
      {savedJobs.length > 0 && (
        <SavedJobsFilters
          filters={filters}
          onFilterChange={(key, value) => {
            const newFilters = { ...filters, [key]: value };
            setFilters(newFilters);
            updateURL(newFilters);
            setSelectedJobs(new Set());
          }}
          sortBy={sortBy}
          onSortChange={(newSort) => {
            setSortBy(newSort);
            localStorage.setItem('savedJobsSort', newSort);
            updateURL(null, newSort);
          }}
          viewMode={viewMode}
          onViewModeChange={(newView) => {
            setViewMode(newView);
            localStorage.setItem('savedJobsView', newView);
            updateURL(null, null, newView);
          }}
          filterOptions={filterOptions}
          selectedJobs={selectedJobs}
          filteredJobs={filteredAndSortedJobs}
          onSelectAll={() => {
            if (selectedJobs.size === filteredAndSortedJobs.length) {
              setSelectedJobs(new Set());
            } else {
              setSelectedJobs(new Set(filteredAndSortedJobs.map(job => job._id)));
            }
          }}
          onBulkUnsave={handleBulkUnsave}
          actionLoading={actionLoading}
        />
      )}

      {/* Content */}
      {savedJobs.length === 0 ? (
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
              <p className="text-muted mb-4">Try adjusting your search criteria to see more results.</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      ) : viewMode === 'table' ? (
        <SavedJobsTable
          jobs={filteredAndSortedJobs}
          selectedJobs={selectedJobs}
          onSelectJob={(jobId) => {
            setSelectedJobs(prev => {
              const newSet = new Set(prev);
              if (newSet.has(jobId)) {
                newSet.delete(jobId);
              } else {
                newSet.add(jobId);
              }
              return newSet;
            });
          }}
          onSelectAll={() => {
            if (selectedJobs.size === filteredAndSortedJobs.length) {
              setSelectedJobs(new Set());
            } else {
              setSelectedJobs(new Set(filteredAndSortedJobs.map(job => job._id)));
            }
          }}
          onUnsaveJob={handleUnsaveJob}
        />
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
                    onChange={() => {
                      setSelectedJobs(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(job._id)) {
                          newSet.delete(job._id);
                        } else {
                          newSet.add(job._id);
                        }
                        return newSet;
                      });
                    }}
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

      {/* Bulk Action Bar */}
      {selectedJobs.size > 0 && (
        <BulkActionBar
          selectedCount={selectedJobs.size}
          onViewSelected={() => {
            const jobIds = Array.from(selectedJobs);
            const jobsParam = jobIds.join(',');
            navigate(`/jobs?saved=${jobsParam}`);
          }}
          onBulkUnsave={handleBulkUnsave}
          onClearSelection={() => setSelectedJobs(new Set())}
          actionLoading={actionLoading}
        />
      )}

      {/* Tips and Stats */}
      {savedJobs.length > 0 && filteredAndSortedJobs.length > 0 && (
        <>
          <SavedJobsTips />
          <SavedJobsStats savedJobs={savedJobs} />
        </>
      )}
    </div>
  );
};

export default SavedJobsPage;