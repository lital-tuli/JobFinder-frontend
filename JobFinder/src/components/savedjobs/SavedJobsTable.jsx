// src/components/SavedJobs/SavedJobsTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SavedJobsTable = ({ jobs, selectedJobs, onSelectJob, onSelectAll, onUnsaveJob }) => {
    const getJobTypeBadgeClass = (jobType) => {
        switch(jobType) {
            case 'Full-time': return 'bg-primary';
            case 'Part-time': return 'bg-info';
            case 'Contract': return 'bg-warning text-dark';
            case 'Internship': return 'bg-secondary';
            case 'Remote': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="card shadow-sm border-0">
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th width="40">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={selectedJobs.size === jobs.length && jobs.length > 0}
                                    onChange={onSelectAll}
                                />
                            </th>
                            <th>Job</th>
                            <th>Company</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Salary</th>
                            <th>Saved On</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job._id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedJobs.has(job._id)}
                                        onChange={() => onSelectJob(job._id)}
                                    />
                                </td>
                                <td>
                                    <div>
                                        <Link 
                                            to={`/jobs/${job._id}`}
                                            className="fw-semibold text-decoration-none"
                                        >
                                            {job.title}
                                        </Link>
                                        <div className="text-muted small">
                                            {job.description ? 
                                                `${job.description.substring(0, 60)}...` : 
                                                'No description available'
                                            }
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="company-logo bg-light rounded p-2 me-2">
                                            <i className="bi bi-building fs-6 text-primary"></i>
                                        </div>
                                        <span>{job.company}</span>
                                    </div>
                                </td>
                                <td>
                                    <i className="bi bi-geo-alt text-primary me-1"></i>
                                    {job.location}
                                </td>
                                <td>
                                    <span className={`badge ${getJobTypeBadgeClass(job.jobType)}`}>
                                        {job.jobType}
                                    </span>
                                </td>
                                <td>
                                    {job.salary ? (
                                        <span className="text-success fw-medium">{job.salary}</span>
                                    ) : (
                                        <span className="text-muted">Not specified</span>
                                    )}
                                </td>
                                <td>
                                    <small className="text-muted">
                                        {formatDate(job.savedAt || job.createdAt)}
                                    </small>
                                </td>
                                <td>
                                    <div className="btn-group">
                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="btn btn-sm btn-outline-primary"
                                            title="View job details"
                                        >
                                            <i className="bi bi-eye me-1"></i>View
                                        </Link>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => onUnsaveJob(job._id)}
                                            title="Remove from saved"
                                        >
                                            <i className="bi bi-bookmark-dash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

SavedJobsTable.propTypes = {
    jobs: PropTypes.array.isRequired,
    selectedJobs: PropTypes.instanceOf(Set).isRequired,
    onSelectJob: PropTypes.func.isRequired,
    onSelectAll: PropTypes.func.isRequired,
    onUnsaveJob: PropTypes.func.isRequired,
};

export default SavedJobsTable;