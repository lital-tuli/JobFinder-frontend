// src/pages/JobDetaisPage.jsx
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
        <div className="container">
            <div className="card my-4">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0">{job.title}</h2>
                </div>
                <div className="card-body">
                    <h5 className="mb-3">{job.company}</h5>
                    
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <p className="mb-1"><strong>Location:</strong></p>
                            <p>{job.location}</p>
                        </div>
                        <div className="col-md-4">
                            <p className="mb-1"><strong>Job Type:</strong></p>
                            <p>{job.jobType}</p>
                        </div>
                        <div className="col-md-4">
                            <p className="mb-1"><strong>Salary:</strong></p>
                            <p>{job.salary || 'Not specified'}</p>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <h5>Description</h5>
                        <p>{job.description}</p>
                    </div>
                    
                    <div className="mb-4">
                        <h5>Requirements</h5>
                        <p>{job.requirements}</p>
                    </div>
                    
                    <div className="mb-4">
                        <h5>Contact</h5>
                        <p>Email: {job.contactEmail}</p>
                    </div>
                    
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-primary" 
                            onClick={handleApply}
                            disabled={applicationStatus === 'applied' || applicationStatus === 'loading'}
                        >
                            {applicationStatus === 'loading' && (
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            )}
                            {applicationStatus === 'applied' ? 'Applied ✓' : 'Apply Now'}
                        </button>
                        
                        <button className="btn btn-outline-secondary" onClick={handleSave}>
                            Save for Later
                        </button>
                        
                        <button className="btn btn-outline-primary ms-auto" onClick={() => navigate(-1)}>
                            Back to Jobs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetailsPage;