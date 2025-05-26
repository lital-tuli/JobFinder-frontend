import React from 'react';
import { Link } from 'react-router-dom';

const JobSearchTips = () => {
    return (
        <div className="mt-5">
            <div className="card bg-light border-0">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">
                        <i className="bi bi-lightbulb text-warning me-2"></i>
                        Job Search Tips
                    </h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <h6 className="fw-semibold">Use Keywords</h6>
                            <p className="text-muted small mb-0">
                                Include specific skills, job titles, or technologies in your search for better results.
                            </p>
                        </div>
                        <div className="col-md-4 mb-3">
                            <h6 className="fw-semibold">Set Job Alerts</h6>
                            <p className="text-muted small mb-0">
                                Save your searches and get notified when new matching jobs are posted.
                            </p>
                        </div>
                        <div className="col-md-4 mb-3">
                            <h6 className="fw-semibold">Apply Quickly</h6>
                            <p className="text-muted small mb-0">
                                The best opportunities get filled fast. Apply as soon as you find a good match.
                            </p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <Link to="/saved-jobs" className="btn btn-outline-primary btn-sm">
                            <i className="bi bi-bookmark me-1"></i>View Saved Jobs
                        </Link>
                        <Link to="/applied-jobs" className="btn btn-outline-success btn-sm">
                            <i className="bi bi-briefcase me-1"></i>My Applications
                        </Link>
                        <Link to="/profile" className="btn btn-outline-secondary btn-sm">
                            <i className="bi bi-person me-1"></i>Update Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearchTips;
