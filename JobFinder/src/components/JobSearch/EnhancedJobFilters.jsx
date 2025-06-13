import React, { useState, useEffect } from 'react';

const EnhancedJobFilters = ({ 
  jobs = [], 
  onFilteredJobs, 
  className = '' 
}) => {
  const [filters, setFilters] = useState({
    search: '',
    jobType: '',
    location: '',
    company: '',
    salary: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Extract unique values for dropdown options
  const uniqueJobTypes = [...new Set(jobs.map(job => job.jobType).filter(Boolean))];
  const uniqueLocations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
  const uniqueCompanies = [...new Set(jobs.map(job => job.company).filter(Boolean))];

  useEffect(() => {
    filterJobs();
  }, [filters, jobs]);

  useEffect(() => {
    // Count active filters
    const count = Object.values(filters).filter(value => value && value.trim() !== '').length;
    setActiveFiltersCount(count);
  }, [filters]);

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter (title, description, company)
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm) ||
        job.description?.toLowerCase().includes(searchTerm) ||
        job.company?.toLowerCase().includes(searchTerm) ||
        job.requirements?.toLowerCase().includes(searchTerm)
      );
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Company filter
    if (filters.company) {
      filtered = filtered.filter(job => job.company === filters.company);
    }

    // Salary filter (basic implementation)
    if (filters.salary) {
      filtered = filtered.filter(job => {
        if (!job.salary) return false;
        
        const salaryText = job.salary.toLowerCase();
        const filterValue = filters.salary.toLowerCase();
        
        // Simple keyword matching for salary ranges
        if (filterValue === 'high' && salaryText.includes('100')) return true;
        if (filterValue === 'medium' && (salaryText.includes('50') || salaryText.includes('60') || salaryText.includes('70') || salaryText.includes('80'))) return true;
        if (filterValue === 'entry' && (salaryText.includes('30') || salaryText.includes('40'))) return true;
        
        return salaryText.includes(filterValue);
      });
    }

    onFilteredJobs(filtered);
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      jobType: '',
      location: '',
      company: '',
      salary: ''
    });
  };

  const clearSpecificFilter = (filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: ''
    }));
  };

  return (
    <div className={`enhanced-job-filters ${className}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <i className="bi bi-funnel me-2 text-primary"></i>
          Find Your Perfect Job
        </h5>
        <div className="d-flex gap-2">
          {activeFiltersCount > 0 && (
            <span className="badge bg-primary">
              {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''} Active
            </span>
          )}
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <i className={`bi bi-chevron-${showAdvanced ? 'up' : 'down'} me-1`}></i>
            {showAdvanced ? 'Less Options' : 'More Options'}
          </button>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search jobs, companies, skills..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            {filters.search && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => clearSpecificFilter('search')}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <label className="form-label small text-muted fw-semibold">Job Type</label>
          <select
            className="form-select"
            value={filters.jobType}
            onChange={(e) => updateFilter('jobType', e.target.value)}
          >
            <option value="">All Types</option>
            {uniqueJobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-2">
          <label className="form-label small text-muted fw-semibold">Location</label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-geo-alt text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="City, Country..."
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              list="locations-list"
            />
            <datalist id="locations-list">
              {uniqueLocations.map(location => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="col-md-4 mb-2">
          <label className="form-label small text-muted fw-semibold">Company</label>
          <select
            className="form-select"
            value={filters.company}
            onChange={(e) => updateFilter('company', e.target.value)}
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters border-top pt-3 mb-3">
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label small text-muted fw-semibold">Salary Range</label>
              <select
                className="form-select"
                value={filters.salary}
                onChange={(e) => updateFilter('salary', e.target.value)}
              >
                <option value="">Any Salary</option>
                <option value="entry">Entry Level (30k-50k)</option>
                <option value="medium">Mid Level (50k-80k)</option>
                <option value="high">Senior Level (80k+)</option>
              </select>
            </div>

            <div className="col-md-6 mb-2">
              <label className="form-label small text-muted fw-semibold">Posted</label>
              <select className="form-select">
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="active-filters mb-3">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <small className="text-muted fw-semibold">Active filters:</small>
            
            {filters.search && (
              <span className="badge bg-primary">
                Search: "{filters.search}"
                <button 
                  className="btn-close btn-close-white ms-1"
                  style={{fontSize: '0.6em'}}
                  onClick={() => clearSpecificFilter('search')}
                ></button>
              </span>
            )}
            
            {filters.jobType && (
              <span className="badge bg-primary">
                Type: {filters.jobType}
                <button 
                  className="btn-close btn-close-white ms-1"
                  style={{fontSize: '0.6em'}}
                  onClick={() => clearSpecificFilter('jobType')}
                ></button>
              </span>
            )}
            
            {filters.location && (
              <span className="badge bg-primary">
                Location: {filters.location}
                <button 
                  className="btn-close btn-close-white ms-1"
                  style={{fontSize: '0.6em'}}
                  onClick={() => clearSpecificFilter('location')}
                ></button>
              </span>
            )}
            
            {filters.company && (
              <span className="badge bg-primary">
                Company: {filters.company}
                <button 
                  className="btn-close btn-close-white ms-1"
                  style={{fontSize: '0.6em'}}
                  onClick={() => clearSpecificFilter('company')}
                ></button>
              </span>
            )}
            
            {filters.salary && (
              <span className="badge bg-primary">
                Salary: {filters.salary}
                <button 
                  className="btn-close btn-close-white ms-1"
                  style={{fontSize: '0.6em'}}
                  onClick={() => clearSpecificFilter('salary')}
                ></button>
              </span>
            )}
            
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={clearFilters}
            >
              <i className="bi bi-x-circle me-1"></i>
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary text-muted small">
        <i className="bi bi-info-circle me-1"></i>
        Use the filters above to narrow down your job search. All filters work in real-time!
      </div>
    </div>
  );
};

export default EnhancedJobFilters;