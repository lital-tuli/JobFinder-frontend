// src/pages/JobListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from '../components/JobCard';
import jobService from '../services/jobService';

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salary: ''
  });

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
            <div className="col-md-6">
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
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredJobs.length === 0 ? (
        <div className="alert alert-info">
          No jobs found matching your criteria. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="row">
          {filteredJobs.map(job => (
            <div className="col-md-6 col-lg-4 mb-4" key={job._id || job.id}>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListPage;