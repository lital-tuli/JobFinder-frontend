import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SavedJobsTable = ({ jobs, selectedJobs, onSelectJob, onSelectAll, onUnsaveJob }) => {
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
                                            {job.description?.substring(0, 60)}...
                                        </div>
                                    </div>
                                </td>
                                <td>{job.company}</td>
                                <td>
                                    <i className="bi bi-geo-alt text-primary me-1"></i>
                                    {job.location}
                                </td>
                                <td>
                                    <span className={`badge ${job.jobType === 'Full-time' ? 'bg-primary' : 'bg-secondary'}`}>
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
                                        {new Date(job.savedAt || job.createdAt).toLocaleDateString()}
                                    </small>
                                </td>
                                <td>
                                    <div className="btn-group">
                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="btn btn-sm btn-outline-primary"
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