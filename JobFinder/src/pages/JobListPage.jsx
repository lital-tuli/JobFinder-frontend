// src/pages/JobListPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jobService from "../services/jobService";

function JobListPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
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

    const handleViewJob = (id) => {
        navigate(`/jobs/${id}`);
    };

    const getJobTypeBadgeColor = (jobType) => {
        switch(jobType) {
            case 'Full-time': return 'primary';
            case 'Part-time': return 'info';
            case 'Contract': return 'warning';
            case 'Internship': return 'secondary';
            case 'Remote': return 'success';
            default: return 'dark';
        }
    };

    // Helper for formatted date
    const getPostedTime = (createdAt) => {
        if (!createdAt) return '';
        
        const posted = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - posted);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
        <div className="container py-5">
            <div className="row mb-4">
                <div className="col">
                    <h1 className="fw-bold text-primary mb-2">Find Your Dream Job</h1>
                    <p className="lead text-muted">Browse through hundreds of job opportunities</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search jobs by title, company, or keywords..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-primary">Search</button>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="form-label fw-medium">Location</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="location"
                                    placeholder="e.g., Tel Aviv, Remote"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                />
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="form-label fw-medium">Job Type</label>
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
                        </div>
                        
                        <div className="col-md-4">
                            <div className="form-group">
                                <label className="form-label fw-medium">Salary Range</label>
                                <select
                                    className="form-select"
                                    name="salary"
                                    value={filters.salary || ''}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Any Salary</option>
                                    <option value="0-50000">Below $50,000</option>
                                    <option value="50000-80000">$50,000 - $80,000</option>
                                    <option value="80000-120000">$80,000 - $120,000</option>
                                    <option value="120000+">$120,000+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Job Listings */}
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
                        <div className="col-lg-6 mb-4" key={job._id}>
                            <div className="card shadow-sm h-100 job-card">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className={`badge bg-${getJobTypeBadgeColor(job.jobType)}`}>
                                            {job.jobType}
                                        </span>
                                        <small className="text-muted">{getPostedTime(job.createdAt)}</small>
                                    </div>
                                    <h5 className="card-title fw-bold mb-1">{job.title}</h5>
                                    <h6 className="card-subtitle mb-3 text-muted">{job.company}</h6>
                                    
                                    <div className="mb-3 d-flex flex-column gap-1">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-geo-alt me-2 text-secondary"></i>
                                            <span>{job.location}</span>
                                        </div>
                                        {job.salary && (
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-briefcase me-2 text-secondary"></i>
                                                <span>{job.salary}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <p className="card-text text-truncate mb-3">
                                        {job.description}
                                    </p>
                                    
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <button 
                                            className="btn btn-primary" 
                                            onClick={() => handleViewJob(job._id)}
                                        >
                                            View Details
                                        </button>
                                        <button className="btn btn-outline-secondary d-flex align-items-center">
                                            <i className="bi bi-bookmark-plus me-1"></i> Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default JobListPage;