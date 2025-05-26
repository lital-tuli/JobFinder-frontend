import React from "react";

const SavedJobsStats = ({ savedJobs }) => {
    return (
        <div className="row mt-4">
            <div className="col-md-3 col-6 mb-3">
                <div className="card text-center border-0 bg-primary bg-opacity-10">
                    <div className="card-body py-3">
                        <h4 className="text-primary mb-0">{savedJobs.length}</h4>
                        <small className="text-muted">Total Saved</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card text-center border-0 bg-success bg-opacity-10">
                    <div className="card-body py-3">
                        <h4 className="text-success mb-0">
                            {new Set(savedJobs.map(job => job.company)).size}
                        </h4>
                        <small className="text-muted">Companies</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card text-center border-0 bg-info bg-opacity-10">
                    <div className="card-body py-3">
                        <h4 className="text-info mb-0">
                            {new Set(savedJobs.map(job => job.jobType)).size}
                        </h4>
                        <small className="text-muted">Job Types</small>
                    </div>
                </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
                <div className="card text-center border-0 bg-warning bg-opacity-10">
                    <div className="card-body py-3">
                        <h4 className="text-warning mb-0">
                            {savedJobs.filter(job => {
                                const savedDate = new Date(job.savedAt || job.createdAt);
                                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                                return savedDate > weekAgo;
                            }).length}
                        </h4>
                        <small className="text-muted">This Week</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedJobsStats;