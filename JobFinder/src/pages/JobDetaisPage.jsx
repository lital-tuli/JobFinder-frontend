import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJob, applyForJob, saveJob } from '../services/api';
import { useAuth } from '../services/auth';

function JobDetailsPage() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getJob(id);
                setJob(data);
            } catch (err) {
                setError(err.error || 'Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleApply = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
        try {
            await applyForJob(id);
            alert('Applied for job successfully!');
        } catch (err) {
            setError(err.error || 'Failed to apply for the job');
        }
    };

    const handleSave = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await saveJob(id);
            alert('Job saved successfully!');
        } catch (err) {
            setError(err.error || 'Failed to save the job');
        }
    };

    if (loading) return <p>Loading job details...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!job) return <p>Job not found.</p>;

    return (
        <div className="container">
            <h2 className="mt-4">{job.title}</h2>
            <h6 className="mb-2 text-muted">{job.company}</h6>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Job Type:</strong> {job.jobType}</p>
            <p><strong>Salary:</strong> {job.salary}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
            <button className="btn btn-primary me-2" onClick={handleApply}>Apply</button>
            <button className="btn btn-secondary" onClick={handleSave}>Save</button>
        </div>
    );
}

export default JobDetailsPage;
