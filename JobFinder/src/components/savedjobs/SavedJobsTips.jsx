import React from "react";
import { Link } from "react-router-dom";

const SavedJobsTips = () => {
    return (
        <div className="mt-5">
            <div className="card bg-light border-0">
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-3">
                        <i className="bi bi-lightbulb text-warning me-2"></i>
                        Tips for Managing Your Saved Jobs
                    </h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <h6 className="fw-semibold">Stay Organized</h6>
                            <p className="text-muted small mb-0">
                                Use filters and sorting to quickly find the jobs you're most interested in.
                            </p>
                        </div>
                        <div className="col-md-4 mb-3">
                            <h6 className="fw-semibold">Apply Soon</h6>
                            <p className="text-muted small mb-0">
                                Don't wait too long! Popular positions get filled quickly.
                            </p>
                        </div>
                        <div className="col-md-4 mb-3">
                            <h6 className="fw-semibold">Keep Exploring</h6>
                            <p className="text-muted small mb-0">
                                Regularly check for new opportunities that match your interests.
                            </p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                        <Link to="/jobs" className="btn btn-primary btn-sm">
                            <i className="bi bi-search me-1"></i>Find More Jobs
                        </Link>
                        <Link to="/companies" className="btn btn-outline-secondary btn-sm">
                            <i className="bi bi-building me-1"></i>Browse Companies
                        </Link>
                        <Link to="/applied-jobs" className="btn btn-outline-success btn-sm">
                            <i className="bi bi-briefcase me-1"></i>View Applications
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedJobsTips;
