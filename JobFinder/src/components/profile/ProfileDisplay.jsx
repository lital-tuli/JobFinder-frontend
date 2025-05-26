import React from "react";
import PropTypes from "prop-types";


const ProfileDisplay = ({ user }) => {
    return (
        <div className="profile-display">
            <div className="row">
                <div className="col-md-3 text-center mb-4">
                    {user.profilePicture ? (
                        <img 
                            src={user.profilePicture} 
                            alt="Profile" 
                            className="rounded-circle border"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                    ) : (
                        <div 
                            className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center border"
                            style={{ width: '120px', height: '120px', fontSize: '2.5rem', color: '#6c757d' }}
                        >
                            <i className="bi bi-person"></i>
                        </div>
                    )}
                    <h5 className="mt-3 mb-1">{user.name?.first} {user.name?.last}</h5>
                    <p className="text-muted">{user.profession || 'No profession specified'}</p>
                </div>
                
                <div className="col-md-9">
                    {/* Bio */}
                    {user.bio && (
                        <div className="mb-4">
                            <h6 className="fw-semibold">About</h6>
                            <p className="text-muted">{user.bio}</p>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="row mb-4">
                        <div className="col-sm-6 mb-3">
                            <h6 className="fw-semibold">Contact Information</h6>
                            <p className="mb-1">
                                <i className="bi bi-envelope me-2 text-primary"></i>
                                {user.email}
                            </p>
                            {user.phone && (
                                <p className="mb-1">
                                    <i className="bi bi-telephone me-2 text-primary"></i>
                                    {user.phone}
                                </p>
                            )}
                            {user.location && (
                                <p className="mb-0">
                                    <i className="bi bi-geo-alt me-2 text-primary"></i>
                                    {user.location}
                                </p>
                            )}
                        </div>
                        
                        {/* Social Links */}
                        {(user.website || user.linkedin || user.github) && (
                            <div className="col-sm-6 mb-3">
                                <h6 className="fw-semibold">Links</h6>
                                <div className="d-flex flex-column gap-2">
                                    {user.website && (
                                        <a 
                                            href={user.website} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="bi bi-globe me-2"></i>Website
                                        </a>
                                    )}
                                    {user.linkedin && (
                                        <a 
                                            href={user.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="bi bi-linkedin me-2"></i>LinkedIn
                                        </a>
                                    )}
                                    {user.github && (
                                        <a 
                                            href={user.github} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <i className="bi bi-github me-2"></i>GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resume Section */}
                    {user.resumes && user.resumes.length > 0 && (
                        <div className="mb-4">
                            <h6 className="fw-semibold">Resumes</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {user.resumes.map(resume => (
                                    <a
                                        key={resume.id}
                                        href={resume.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-secondary btn-sm"
                                    >
                                        <i className="bi bi-file-earmark-pdf me-1"></i>
                                        {resume.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ProfileDisplay.propTypes = {
    user: PropTypes.shape({
        profilePicture: PropTypes.string,
        name: PropTypes.shape({
            first: PropTypes.string,
            last: PropTypes.string,
        }),
        profession: PropTypes.string,
        bio: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        location: PropTypes.string,
        website: PropTypes.string,
        linkedin: PropTypes.string,
        github: PropTypes.string,
        resumes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                url: PropTypes.string,
                name: PropTypes.string,
            })
        ),
    }).isRequired,
};

export default ProfileDisplay;
