import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import JobCard from '../../jobs/JobCard';

const FeaturedJobsSection = ({
    featuredJobs,
    loading,
    isJobSaved,
    onSaveJob
}) => {
    if (loading) {
        return (
            <section className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Featured Jobs</h2>
                        <p className="text-muted">Discover exciting opportunities from top companies</p>
                    </div>
                    
                    <div className="row">
                        {[...Array(6)].map((_, index) => (
                            <div className="col-lg-4 col-md-6 mb-4" key={index}>
                                <div className="card h-100 shadow-sm border-0">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div className="placeholder-glow">
                                                <div className="placeholder bg-light rounded" style={{ width: '48px', height: '48px' }}></div>
                                            </div>
                                            <div className="placeholder-glow">
                                                <span className="placeholder bg-light rounded-pill" style={{ width: '80px', height: '24px' }}></span>
                                            </div>
                                        </div>
                                        
                                        <div className="placeholder-glow mb-3">
                                            <h5 className="placeholder bg-light rounded" style={{ width: '70%', height: '24px' }}></h5>
                                            <p className="placeholder bg-light rounded" style={{ width: '50%', height: '20px' }}></p>
                                        </div>
                                        
                                        <div className="placeholder-glow mb-3">
                                            <div className="placeholder bg-light rounded mb-2" style={{ width: '100%', height: '16px' }}></div>
                                            <div className="placeholder bg-light rounded" style={{ width: '80%', height: '16px' }}></div>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                                            <div className="placeholder-glow">
                                                <small className="placeholder bg-light rounded" style={{ width: '60px', height: '14px' }}></small>
                                            </div>
                                            <div className="placeholder-glow">
                                                <div className="placeholder bg-light rounded" style={{ width: '100px', height: '32px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!featuredJobs || featuredJobs.length === 0) {
        return (
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Featured Jobs</h2>
                        <p className="text-muted">Discover exciting opportunities from top companies</p>
                    </div>
                    
                    <div className="text-center py-5">
                        <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '500px' }}>
                            <div className="card-body p-5">
                                <i className="bi bi-briefcase text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                                <h4 className="fw-bold mb-3">No Jobs Available</h4>
                                <p className="text-muted mb-4">
                                    We're working hard to bring you the best job opportunities. 
                                    Check back soon for exciting new positions!
                                </p>
                                <Link to="/jobs" className="btn btn-primary">
                                    <i className="bi bi-search me-2"></i>
                                    Browse All Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="py-5 bg-light">
                <div className="container">
                    {/* Section Header */}
                    <div className="text-center mb-5">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">
                                    🔥 Hot Opportunities
                                </span>
                                <h2 className="display-5 fw-bold mb-3">Featured Jobs</h2>
                                <p className="lead text-muted">
                                    Discover hand-picked opportunities from companies actively hiring talented professionals like you
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Jobs Grid */}
                    <div className="row g-4 mb-5">
                        {featuredJobs.map((job, index) => (
                            <div className="col-lg-4 col-md-6" key={job._id || index}>
                                <div className="featured-job-wrapper">
                                    {index < 3 && (
                                        <div className="featured-badge">
                                            <span className="badge bg-warning text-dark">
                                                <i className="bi bi-star-fill me-1"></i>
                                                Featured
                                            </span>
                                        </div>
                                    )}
                                    <JobCard 
                                        job={job}
                                        saved={isJobSaved(job._id)}
                                        onSave={onSaveJob}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="text-center">
                        <div className="row">
                            <div className="col-lg-6 mx-auto">
                                <div className="bg-white rounded-3 p-4 shadow-sm">
                                    <h4 className="fw-bold mb-3">
                                        Ready to find your dream job?
                                    </h4>
                                    <p className="text-muted mb-4">
                                        Browse thousands of opportunities from companies around the world
                                    </p>
                                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                                        <Link to="/jobs" className="btn btn-primary btn-lg px-4">
                                            <i className="bi bi-search me-2"></i>
                                            View All Jobs
                                        </Link>
                                        <Link to="/companies" className="btn btn-outline-primary btn-lg px-4">
                                            <i className="bi bi-building me-2"></i>
                                            Browse Companies
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Cards */}
                    <div className="row mt-5">
                        <div className="col-md-4 mb-3">
                            <div className="text-center p-4">
                                <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                                         style={{ width: '60px', height: '60px' }}>
                                    <i className="bi bi-lightning-charge text-primary fs-4"></i>
                                </div>
                                <h5 className="fw-semibold">Quick Apply</h5>
                                <p className="text-muted small mb-0">
                                    Apply to jobs with just one click using your saved profile information
                                </p>
                            </div>
                        </div>
                        
                        <div className="col-md-4 mb-3">
                            <div className="text-center p-4">
                                <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                                         style={{ width: '60px', height: '60px' }}>
                                    <i className="bi bi-bookmark-heart text-success fs-4"></i>
                                </div>
                                <h5 className="fw-semibold">Save Favorites</h5>
                                <p className="text-muted small mb-0">
                                    Bookmark interesting jobs and apply when you're ready
                                </p>
                            </div>
                        </div>
                        
                        <div className="col-md-4 mb-3">
                            <div className="text-center p-4">
                                <div className="bg-info bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                                         style={{ width: '60px', height: '60px' }}>
                                    <i className="bi bi-graph-up-arrow text-info fs-4"></i>
                                </div>
                                <h5 className="fw-semibold">Track Progress</h5>
                                <p className="text-muted small mb-0">
                                    Monitor your applications and get updates on your job search
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CSS Styles */}
            <style>
                {`
                    .featured-job-wrapper {
                        position: relative;
                        height: 100%;
                    }

                    .featured-badge {
                        position: absolute;
                        top: -8px;
                        right: 8px;
                        z-index: 10;
                    }

                    .featured-job-wrapper:hover .job-card {
                        transform: translateY(-4px);
                    }

                    @media (max-width: 768px) {
                        .featured-badge {
                            top: -6px;
                            right: 6px;
                        }
                        
                        .featured-badge .badge {
                            font-size: 0.7rem;
                            padding: 0.25rem 0.5rem;
                        }
                    }
                `}
            </style>
        </>
    );
};

FeaturedJobsSection.propTypes = {
    featuredJobs: PropTypes.array,
    loading: PropTypes.bool,
    isJobSaved: PropTypes.func.isRequired,
    onSaveJob: PropTypes.func.isRequired
};

export default FeaturedJobsSection;