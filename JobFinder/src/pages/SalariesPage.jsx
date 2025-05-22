import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../services/jobService';

const SalariesPage = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    jobType: 'all',
    experience: 'all',
    location: '',
    searchTerm: ''
  });

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        setLoading(true);
        // Get all jobs and extract salary information
        const jobs = await jobService.getAllJobs();
        
        // Process jobs to create salary insights
        const salaryInsights = [];
        
        // Group by job title
        const jobTitleGroups = {};
        jobs.forEach(job => {
          if (job.salary && job.salary !== 'Not specified') {
            const normalizedTitle = job.title.toLowerCase().replace(/\s+/g, ' ').trim();
            if (!jobTitleGroups[normalizedTitle]) {
              jobTitleGroups[normalizedTitle] = {
                title: job.title,
                salaries: [],
                companies: new Set(),
                locations: new Set(),
                jobType: job.jobType,
                count: 0
              };
            }
            
            // Parse salary range
            const salaryRange = parseSalaryRange(job.salary);
            if (salaryRange) {
              jobTitleGroups[normalizedTitle].salaries.push(salaryRange);
              jobTitleGroups[normalizedTitle].companies.add(job.company);
              jobTitleGroups[normalizedTitle].locations.add(job.location);
              jobTitleGroups[normalizedTitle].count++;
            }
          }
        });

        // Convert to salary insights array
        Object.keys(jobTitleGroups).forEach(key => {
          const group = jobTitleGroups[key];
          if (group.salaries.length > 0) {
            const salaries = group.salaries.map(s => s.average).sort((a, b) => a - b);
            const min = Math.min(...salaries);
            const max = Math.max(...salaries);
            const median = calculateMedian(salaries);
            const average = Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);

            salaryInsights.push({
              jobTitle: group.title,
              minSalary: min,
              maxSalary: max,
              avgSalary: average,
              medianSalary: median,
              companies: Array.from(group.companies),
              locations: Array.from(group.locations),
              jobType: group.jobType,
              jobCount: group.count,
              salaryRange: `$${formatNumber(min)} - $${formatNumber(max)}`
            });
          }
        });

        // Sort by average salary
        salaryInsights.sort((a, b) => b.avgSalary - a.avgSalary);
        
        setSalaryData(salaryInsights);
      } catch (err) {
        setError(err.error || 'Failed to fetch salary data');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parseSalaryRange = (salaryString) => {
    // Remove currency symbols and commas
    const cleanSalary = salaryString.replace(/[$,]/g, '');
    
    // Try to extract numbers from ranges like "50000-70000" or "50k-70k"
    const rangeMatch = cleanSalary.match(/(\d+)(?:k|000)?\s*[-to]\s*(\d+)(?:k|000)?/i);
    if (rangeMatch) {
      let min = parseInt(rangeMatch[1]);
      let max = parseInt(rangeMatch[2]);
      
      // Handle 'k' notation
      if (rangeMatch[1].includes('k') || (min < 1000 && min > 10)) min *= 1000;
      if (rangeMatch[2].includes('k') || (max < 1000 && max > 10)) max *= 1000;
      
      return {
        min,
        max,
        average: Math.round((min + max) / 2)
      };
    }
    
    // Try to extract single number
    const singleMatch = cleanSalary.match(/(\d+)(?:k|000)?/i);
    if (singleMatch) {
      let salary = parseInt(singleMatch[1]);
      if (singleMatch[1].includes('k') || (salary < 1000 && salary > 10)) salary *= 1000;
      
      return {
        min: salary,
        max: salary,
        average: salary
      };
    }
    
    return null;
  };

  const calculateMedian = (sortedArray) => {
    const mid = Math.floor(sortedArray.length / 2);
    if (sortedArray.length % 2 === 0) {
      return Math.round((sortedArray[mid - 1] + sortedArray[mid]) / 2);
    }
    return sortedArray[mid];
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter salary data
  const filteredSalaryData = salaryData.filter(item => {
    const matchesJobType = filters.jobType === 'all' || item.jobType === filters.jobType;
    const matchesLocation = !filters.location || 
                           item.locations.some(loc => 
                             loc.toLowerCase().includes(filters.location.toLowerCase())
                           );
    const matchesSearch = !filters.searchTerm ||
                         item.jobTitle.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         item.companies.some(company =>
                           company.toLowerCase().includes(filters.searchTerm.toLowerCase())
                         );
    
    return matchesJobType && matchesLocation && matchesSearch;
  });

  const overallStats = {
    averageSalary: salaryData.length > 0 
      ? Math.round(salaryData.reduce((sum, item) => sum + item.avgSalary, 0) / salaryData.length)
      : 0,
    highestSalary: salaryData.length > 0 
      ? Math.max(...salaryData.map(item => item.maxSalary))
      : 0,
    lowestSalary: salaryData.length > 0 
      ? Math.min(...salaryData.map(item => item.minSalary))
      : 0,
    totalPositions: salaryData.reduce((sum, item) => sum + item.jobCount, 0)
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="fw-bold">Salary Information</h1>
          <p className="lead text-muted">
            Discover salary ranges for different positions and make informed career decisions
          </p>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center border-0 bg-primary text-white">
            <div className="card-body">
              <i className="bi bi-currency-dollar fs-1 mb-2"></i>
              <h4 className="mb-0">{formatCurrency(overallStats.averageSalary)}</h4>
              <p className="mb-0">Average Salary</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-0 bg-success text-white">
            <div className="card-body">
              <i className="bi bi-arrow-up-circle fs-1 mb-2"></i>
              <h4 className="mb-0">{formatCurrency(overallStats.highestSalary)}</h4>
              <p className="mb-0">Highest Salary</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-0 bg-info text-white">
            <div className="card-body">
              <i className="bi bi-arrow-down-circle fs-1 mb-2"></i>
              <h4 className="mb-0">{formatCurrency(overallStats.lowestSalary)}</h4>
              <p className="mb-0">Starting Range</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-0 bg-warning text-white">
            <div className="card-body">
              <i className="bi bi-briefcase fs-1 mb-2"></i>
              <h4 className="mb-0">{overallStats.totalPositions}</h4>
              <p className="mb-0">Total Positions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by job title or company..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.jobType}
                onChange={(e) => setFilters(prev => ({ ...prev, jobType: e.target.value }))}
              >
                <option value="all">All Job Types</option>
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
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => setFilters({
                  jobType: 'all',
                  experience: 'all',
                  location: '',
                  searchTerm: ''
                })}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Data Table/Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading salary data...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredSalaryData.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-search mb-3 text-muted" style={{ fontSize: '3rem' }}></i>
          <h3>No Salary Data Found</h3>
          <p className="text-muted mb-4">
            {salaryData.length === 0 
              ? "No salary information available in job postings." 
              : "No jobs match your search criteria."}
          </p>
          <Link to="/jobs" className="btn btn-primary">
            Browse All Jobs
          </Link>
        </div>
      ) : (
        <div className="row">
          {filteredSalaryData.map((item, index) => (
            <div className="col-lg-6 mb-4" key={index}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">{item.jobTitle}</h5>
                      <span className={`badge ${item.jobType === 'Full-time' ? 'bg-primary' : 'bg-secondary'}`}>
                        {item.jobType}
                      </span>
                    </div>
                    <div className="text-end">
                      <h4 className="text-primary mb-0">{formatCurrency(item.avgSalary)}</h4>
                      <small className="text-muted">Average</small>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="text-center">
                        <div className="text-success fw-bold">{formatCurrency(item.minSalary)}</div>
                        <small className="text-muted">Minimum</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center">
                        <div className="text-danger fw-bold">{formatCurrency(item.maxSalary)}</div>
                        <small className="text-muted">Maximum</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-building me-2 text-primary"></i>
                      <small className="text-muted">
                        Companies: {item.companies.slice(0, 2).join(', ')}
                        {item.companies.length > 2 && ` +${item.companies.length - 2} more`}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-geo-alt me-2 text-primary"></i>
                      <small className="text-muted">
                        Locations: {item.locations.slice(0, 2).join(', ')}
                        {item.locations.length > 2 && ` +${item.locations.length - 2} more`}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Based on {item.jobCount} position{item.jobCount !== 1 ? 's' : ''}
                    </small>
                    <Link 
                      to={`/jobs?search=${encodeURIComponent(item.jobTitle)}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Jobs
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Salary Guide CTA */}
      <div className="mt-5">
        <div className="card bg-light border-0">
          <div className="card-body p-4 text-center">
            <h3 className="fw-bold mb-3">Need More Salary Information?</h3>
            <p className="text-muted mb-4">
              Get personalized salary insights based on your experience, location, and skills.
              Connect with recruiters to negotiate better offers.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/register" className="btn btn-primary">
                Create Profile
              </Link>
              <Link to="/contact" className="btn btn-outline-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalariesPage;