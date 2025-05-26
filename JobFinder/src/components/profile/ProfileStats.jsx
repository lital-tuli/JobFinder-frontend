import React from 'react';
import PropTypes from 'prop-types';

const ProfileStats = ({ user, savedJobsCount, appliedJobsCount }) => {
    const completionPercentage = () => {
        const fields = [
            user?.name?.first,
            user?.name?.last,
            user?.email,
            user?.profession,
            user?.bio,
            user?.location,
            user?.profilePicture
        ];
        const filledFields = fields.filter(field => field && field.trim && field.trim() !== '').length;
        return Math.round((filledFields / fields.length) * 100);
    };

    return (
        <div className="profile-stats mb-4">
            <div className="card bg-light border-0">
                <div className="card-body">
                    <h6 className="fw-semibold mb-3">Profile Overview</h6>
                    
                    {/* Profile Completion */}
                    <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <small className="text-muted">Profile Completion</small>
                            <small className="fw-semibold">{completionPercentage()}%</small>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                            <div 
                                className="progress-bar bg-primary" 
                                style={{ width: `${completionPercentage()}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="row text-center">
                        <div className="col-4">
                            <div className="border-end">
                                <h5 className="text-primary mb-0">{savedJobsCount || 0}</h5>
                                <small className="text-muted">Saved Jobs</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="border-end">
                                <h5 className="text-success mb-0">{appliedJobsCount || 0}</h5>
                                <small className="text-muted">Applications</small>
                            </div>
                        </div>
                        <div className="col-4">
                            <h5 className="text-info mb-0">{user?.resumes?.length || 0}</h5>
                            <small className="text-muted">Resumes</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ProfileStats.propTypes = {
    user: PropTypes.object,
    savedJobsCount: PropTypes.number,
    appliedJobsCount: PropTypes.number,
};

export default ProfileStats;