import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from "../../hooks/useDebounce";

const EnhancedJobFilters = ({ 
  jobs = [], 
  onFilteredJobs
}) => {
  const [filters, setFilters] = useState({
    q: '',
    jobTypes: [],
    workLocation: [],
    experienceLevel: [],
    minSalary: '',
    maxSalary: '',
    sortBy: 'relevance'
  });

  const debouncedFilters = useDebounce(filters, 500);

  // Filter jobs based on current filters
  const filterJobs = useCallback((jobs, filters) => {
    let filtered = [...jobs];

    // Search query filter
    if (filters.q) {
      const query = filters.q.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query)
      );
    }

    // Job types filter
    if (filters.jobTypes.length > 0) {
      filtered = filtered.filter(job => 
        filters.jobTypes.some(type => 
          job.jobType?.toLowerCase().includes(type.toLowerCase()) ||
          job.type?.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    // Work location filter
    if (filters.workLocation.length > 0) {
      filtered = filtered.filter(job => 
        filters.workLocation.some(location => 
          job.workLocation?.toLowerCase().includes(location.toLowerCase()) ||
          job.location?.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    // Experience level filter
    if (filters.experienceLevel.length > 0) {
      filtered = filtered.filter(job => 
        filters.experienceLevel.some(level => 
          job.experienceLevel?.toLowerCase().includes(level.toLowerCase()) ||
          job.level?.toLowerCase().includes(level.toLowerCase())
        )
      );
    }

    // Salary filter
    if (filters.minSalary) {
      const minSal = parseInt(filters.minSalary);
      filtered = filtered.filter(job => {
        const jobSalary = job.salary?.min || job.minSalary || 0;
        return jobSalary >= minSal;
      });
    }

    if (filters.maxSalary) {
      const maxSal = parseInt(filters.maxSalary);
      filtered = filtered.filter(job => {
        const jobSalary = job.salary?.max || job.maxSalary || 999999;
        return jobSalary <= maxSal;
      });
    }

    // Sort results
    if (filters.sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.createdAt || b.datePosted) - new Date(a.createdAt || a.datePosted));
    } else if (filters.sortBy === 'salary') {
      filtered.sort((a, b) => {
        const salA = a.salary?.max || a.maxSalary || 0;
        const salB = b.salary?.max || b.maxSalary || 0;
        return salB - salA;
      });
    }

    return filtered;
  }, []);

  // Apply filters when filters or jobs change
  useEffect(() => {
    if (jobs.length > 0 && onFilteredJobs) {
      const filteredJobs = filterJobs(jobs, debouncedFilters);
      onFilteredJobs(filteredJobs);
    }
  }, [debouncedFilters, jobs, onFilteredJobs, filterJobs]);

  const handleCheckboxChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleInputChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      jobTypes: [],
      workLocation: [],
      experienceLevel: [],
      minSalary: '',
      maxSalary: '',
      sortBy: 'relevance'
    });
  };

  const hasActiveFilters = filters.q || 
    filters.jobTypes.length > 0 || 
    filters.workLocation.length > 0 || 
    filters.experienceLevel.length > 0 || 
    filters.minSalary || 
    filters.maxSalary;

  return (
    <div className="job-filters mb-4">
      <div className="container">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            
            {/* Search Box */}
            <div className="row mb-3">
              <div className="col-12">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search jobs by title, company, or keywords..."
                    value={filters.q}
                    onChange={(e) => handleInputChange('q', e.target.value)}
                  />
                  {hasActiveFilters && (
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={clearFilters}
                      title="Clear all filters"
                    >
                      <i className="bi bi-x-circle"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="row g-3">
              {/* Job Type Filter */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Job Type</label>
                <div className="d-flex flex-column gap-2">
                  {['full-time', 'part-time', 'contract', 'freelance'].map(type => (
                    <div key={type} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`jobType-${type}`}
                        checked={filters.jobTypes.includes(type)}
                        onChange={() => handleCheckboxChange('jobTypes', type)}
                      />
                      <label className="form-check-label" htmlFor={`jobType-${type}`}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Location Filter */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Work Location</label>
                <div className="d-flex flex-column gap-2">
                  {['remote', 'hybrid', 'on-site'].map(location => (
                    <div key={location} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`location-${location}`}
                        checked={filters.workLocation.includes(location)}
                        onChange={() => handleCheckboxChange('workLocation', location)}
                      />
                      <label className="form-check-label" htmlFor={`location-${location}`}>
                        {location.charAt(0).toUpperCase() + location.slice(1).replace('-', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience Level Filter */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Experience Level</label>
                <div className="d-flex flex-column gap-2">
                  {['entry', 'mid', 'senior'].map(level => (
                    <div key={level} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`level-${level}`}
                        checked={filters.experienceLevel.includes(level)}
                        onChange={() => handleCheckboxChange('experienceLevel', level)}
                      />
                      <label className="form-check-label" htmlFor={`level-${level}`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)} Level
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary and Sort */}
              <div className="col-md-3">
                <label className="form-label fw-semibold">Salary Range</label>
                <div className="mb-2">
                  <input
                    type="number"
                    className="form-control form-control-sm mb-1"
                    placeholder="Min salary"
                    value={filters.minSalary}
                    onChange={(e) => handleInputChange('minSalary', e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max salary"
                    value={filters.maxSalary}
                    onChange={(e) => handleInputChange('maxSalary', e.target.value)}
                  />
                </div>
                
                <label className="form-label fw-semibold mt-2">Sort by</label>
                <select
                  className="form-select form-select-sm"
                  value={filters.sortBy}
                  onChange={(e) => handleInputChange('sortBy', e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date Posted</option>
                  <option value="salary">Salary (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-muted small">Active filters:</span>
                  {filters.q && (
                    <span className="badge bg-primary">
                      Search: "{filters.q}"
                    </span>
                  )}
                  {filters.jobTypes.map(type => (
                    <span key={type} className="badge bg-success">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  ))}
                  {filters.workLocation.map(loc => (
                    <span key={loc} className="badge bg-info">
                      {loc.charAt(0).toUpperCase() + loc.slice(1)}
                    </span>
                  ))}
                  {filters.experienceLevel.map(level => (
                    <span key={level} className="badge bg-warning">
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobFilters;