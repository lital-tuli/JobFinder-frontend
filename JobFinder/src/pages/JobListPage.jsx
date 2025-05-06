// src/pages/JobListPage.jsx
import React, { useState, useEffect } from "react";
import JobCard from "../components/JobCard";
import jobService from "../services/jobService"; // Updated import

function JobListPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        location: '',
        jobType: ''
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

    return (
        <div className="container">
            <h2 className="my-4">Find Your Dream Job</h2>
            
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Filter Jobs</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="location" 
                                name="location" 
                                value={filters.location} 
                                onChange={handleFilterChange} 
                                placeholder="e.g., Tel Aviv, Remote" 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="jobType" className="form-label">Job Type</label>
                            <select 
                                className="form-select" 
                                id="jobType" 
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
                </div>
            </div>
            
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : jobs.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    No jobs found matching your criteria. Try adjusting your filters.
                </div>
            ) : (
                <div className="row">
                    {jobs.map(job => (
                        <div className="col-md-6 mb-4" key={job._id}>
                            <JobCard job={job} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default JobListPage;