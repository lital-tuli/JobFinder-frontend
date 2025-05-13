// src/pages/JobDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import jobService from '../services/jobService';

function JobDetailsPage() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applicationStatus, setApplicationStatus] = useState('');
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await jobService.getJobById(id);
                setJob(data);
                
                // Check if user has already applied
                if (isAuthenticated && user && data.applicants) {
                    const hasApplied = data.applicants.includes(user._id);
                    if (hasApplied) {
                        setApplicationStatus('applied');
                    }
                }
            } catch (err) {
                setError(err.error || 'Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id, isAuthenticated, user]);

    const handleApply = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/jobs/${id}` } });
            return;
        }
        
        setApplicationStatus('loading');
        try {
            await jobService.applyForJob(id);
            setApplicationStatus('applied');
        } catch (err) {
            setError(err.error || 'Failed to apply for the job');
            setApplicationStatus('');
        }
    };

    const handleSave = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/jobs/${id}` } });
            return;
        }
        
        try {
            const result = await jobService.saveJob(id);
            alert(result.message || 'Job saved successfully!');
        } catch (err) {
            setError(err.error || 'Failed to save the job');
        }
    };

    if (loading) return (
        <div className="container mt-5">
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="container mt-4">
            <div className="alert alert-danger">{error}</div>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
    
    if (!job) return (
        <div className="container mt-4">
            <div className="alert alert-warning">Job not found.</div>
            <button className="btn btn-primary" onClick={() => navigate('/jobs')}>Browse Jobs</button>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white py-3">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-9">
                                <h2 className="mb-0">{job.title}</h2>
                                <p className="mb-0 fs-5">{job.company}</p>
                            </div>
                            <div className="col-md-3 text-md-end mt-3 mt-md-0">
                                <span className="badge bg-light text-dark py-2 px-3 fs-6">
                                    {job.jobType}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="card-body p-4">
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-geo-alt-fill text-primary me-2 fs-5"></i>
                                <div>
                                    <p className="mb-0 fw-bold">Location</p>
                                    <p className="mb-0">{job.location}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-currency-dollar text-primary me-2 fs-5"></i>
                                <div>
                                    <p className="mb-0 fw-bold">Salary</p>
                                    <p className="mb-0">{job.salary || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-calendar-date text-primary me-2 fs-5"></i>
                                <div>
                                    <p className="mb-0 fw-bold">Posted Date</p>
                                    <p className="mb-0">
                                        {new Date(job.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row mb-4">
                        <div className="col-12">
                            <h4>Job Description</h4>
                            <p>{job.description}</p>
                        </div>
                    </div>
                    
                    <div className="row mb-4">
                        <div className="col-12">
                            <h4>Requirements</h4>
                            <p>{job.requirements}</p>
                        </div>
                    </div>
                    
                    <div className="row mb-4">
                        <div className="col-12">
                            <h4>Contact Information</h4>
                            <p>
                                <i className="bi bi-envelope me-2"></i>
                                {job.contactEmail}
                            </p>
                        </div>
                    </div>
                    
                    <div className="d-flex flex-wrap gap-3 mt-4">
                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={handleApply}
                            disabled={applicationStatus === 'applied' || applicationStatus === 'loading'}
                        >
                            {applicationStatus === 'loading' && (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            )}
                            {applicationStatus === 'applied' ? 'Applied ✓' : 'Apply Now'}
                        </button>
                        
                        <button 
                            className="btn btn-outline-primary btn-lg"
                            onClick={handleSave}
                        >
                            <i className="bi bi-bookmark me-2"></i>
                            Save Job
                        </button>
                        
                        <button 
                            className="btn btn-outline-secondary btn-lg"
                            onClick={() => navigate(-1)}
                        >
                            <i className="bi bi-arrow-left me-2"></i>
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetailsPage;