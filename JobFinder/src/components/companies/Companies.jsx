import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../../services/jobService';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'jobs', 'latest'

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError('');
      try {
        // Get all jobs and extract company data
        const jobs = await jobService.getAllJobs();
        
        // Group jobs by company
        const companyMap = {};
        jobs.forEach(job => {
          if (!companyMap[job.company]) {
            companyMap[job.company] = {
              name: job.company,
              jobs: [],
              totalJobs: 0,
              latestJob: job.createdAt,
              locations: new Set(),
              jobTypes: new Set()
            };
          }
          
          companyMap[job.company].jobs.push(job);
          companyMap[job.company].totalJobs++;
          companyMap[job.company].locations.add(job.location);
          companyMap[job.company].jobTypes.add(job.jobType);
          
          // Track latest job posting
          if (new Date(job.createdAt) > new Date(companyMap[job.company].latestJob)) {
            companyMap[job.company].latestJob = job.createdAt;
          }
        });
        
        // Convert to array and add additional info
        const companiesArray = Object.values(companyMap).map(company => ({
          ...company,
          locations: Array.from(company.locations),
          jobTypes: Array.from(company.jobTypes),
          logo: getCompanyLogo(company.name) // Generate logo placeholder
        }));
        
        setCompanies(companiesArray);
      } catch (err) {
        setError(err.error || 'Failed to fetch companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Generate company logo placeholder
  const getCompanyLogo = (companyName) => {
    const colors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];
    const colorIndex = companyName.length % colors.length;
    return {
      initials: companyName.substring(0, 2).toUpperCase(),
      color: colors[colorIndex]
    };
  };

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.locations.some(location => 
      location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'jobs':
        return b.totalJobs - a.totalJobs;
      case 'latest':
        return new Date(b.latestJob) - new Date(a.latestJob);
      default:
        return 0;
    }
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="fw-bold">Explore Companies</h1>
          <p className="lead text-muted">
            Discover amazing companies that are hiring talented professionals
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-light"
                  placeholder="Search companies or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="jobs">Sort by Job Count</option>
                <option value="latest">Sort by Latest Posting</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">{companies.length}</h3>
              <p className="mb-0">Companies Hiring</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">
                {companies.reduce((acc, company) => acc + company.totalJobs, 0)}
              </h3>
              <p className="mb-0">Total Job Openings</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h3 className="mb-0">
                {new Set(companies.flatMap(c => c.locations)).size}
              </h3>
              <p className="mb-0">Unique Locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading companies...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : sortedCompanies.length === 0 ? (
        <div className="alert alert-info">
          No companies found matching your search criteria.
        </div>
      ) : (
        <div className="row">
          {sortedCompanies.map((company, index) => (
            <div className="col-lg-4 col-md-6 mb-4" key={index}>
              <div className="card h-100 shadow-sm border-0 hover-lift">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className={`company-logo bg-${company.logo.color} bg-gradient text-white rounded p-3 me-3`}
                      style={{ width: '60px', height: '60px' }}
                    >
                      <div className="d-flex align-items-center justify-content-center h-100 fw-bold">
                        {company.logo.initials}
                      </div>
                    </div>
                    <div>
                      <h5 className="card-title mb-0">{company.name}</h5>
                      <p className="text-muted mb-0">{company.totalJobs} open positions</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-geo-alt text-primary me-2"></i>
                      <small className="text-muted">
                        {company.locations.slice(0, 2).join(', ')}
                        {company.locations.length > 2 && ` +${company.locations.length - 2} more`}
                      </small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-briefcase text-primary me-2"></i>
                      <small className="text-muted">
                        {company.jobTypes.join(', ')}
                      </small>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar text-primary me-2"></i>
                      <small className="text-muted">
                        Latest posting: {formatDate(company.latestJob)}
                      </small>
                    </div>
                  </div>
                  
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {company.jobTypes.map((type, idx) => (
                      <span key={idx} className="badge bg-light text-dark">
                        {type}
                      </span>
                    ))}
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <Link 
                      to={`/jobs?company=${encodeURIComponent(company.name)}`}
                      className="btn btn-primary"
                    >
                      View {company.totalJobs} Jobs
                    </Link>
                    <Link 
                      to={`/companies/${encodeURIComponent(company.name)}`}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Featured Companies Section */}
      {!loading && !error && companies.length > 0 && (
        <div className="mt-5">
          <h2 className="text-center fw-bold mb-4">Top Hiring Companies</h2>
          <div className="row">
            {companies
              .sort((a, b) => b.totalJobs - a.totalJobs)
              .slice(0, 6)
              .map((company, index) => (
                <div className="col-md-2 col-sm-4 mb-3" key={index}>
                  <Link 
                    to={`/jobs?company=${encodeURIComponent(company.name)}`}
                    className="text-decoration-none"
                  >
                    <div className="card border-0 bg-light h-100 hover-lift">
                      <div className="card-body text-center p-3">
                        <div 
                          className={`company-logo bg-${company.logo.color} bg-gradient text-white rounded mx-auto mb-2`}
                          style={{ width: '40px', height: '40px' }}
                        >
                          <div className="d-flex align-items-center justify-content-center h-100 fw-bold small">
                            {company.logo.initials}
                          </div>
                        </div>
                        <h6 className="card-title mb-1 small">{company.name}</h6>
                        <small className="text-muted">{company.totalJobs} jobs</small>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;