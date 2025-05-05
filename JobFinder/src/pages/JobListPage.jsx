import React, { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import { getJobs } from '../services/api';

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
                const data = await getJobs(filters);
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
            <h2 className="mt-4">Job Listings</h2>
            <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input type="text" className="form-control" id="location" name="location" value={filters.location} onChange={handleFilterChange} placeholder="e.g., Tel Aviv" />
            </div>
            <div className="mb-3">
                <label htmlFor="jobType" className="form-label">Job Type</label>
                <select className="form-select" id="jobType" name="jobType" value={filters.jobType} onChange={handleFilterChange}>
                    <option value="">All</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    {/* Add other job types as needed */}
                </select>
            </div>
            {loading && <p>Loading jobs...</p>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && !error && (
                jobs.map(job => (
                    <JobCard key={job._id} job={job} />
                ))
            )}
        </div>
    );
}

export default JobListPage;
