import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import SmartSearchBar from '../../JobSearch/SmartSearchBar';

const HeroSection = ({ siteStats, isAuthenticated }) => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  // פונקציה להפעלת חיפוש עם ניווט
  const handleSearch = (term, loc) => {
    if (!term?.trim() && !loc?.trim()) return;

    const params = new URLSearchParams();
    if (term?.trim()) params.append('search', term.trim());
    if (loc?.trim()) params.append('location', loc.trim());

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <>
      <section
        className="hero-section text-white"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '80vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div className="row align-items-center" style={{ minHeight: '75vh' }}>
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="hero-content">
                {/* Badge */}
                <div className="mb-3">
                  <span
                    className="badge text-white px-3 py-2 rounded-pill"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    Find Your Dream Career ✨
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="display-4 fw-bold mb-4">
                  Discover Your Next{' '}
                  <span className="text-warning d-block">Career Opportunity</span>
                </h1>

                {/* Subtitle */}
                <p className="lead mb-4" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Connect with top employers and find positions that match your skills, experience,
                  and career goals. Your perfect job is just a search away.
                </p>

                {/* Hero Stats */}
                <div className="row g-3 mb-5">
                  <div className="col-4">
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">{siteStats?.totalJobs || 0}</h3>
                      <small style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Active Jobs</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">{siteStats?.totalCompanies || 0}</h3>
                      <small style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Companies</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">{siteStats?.totalUsers || '1,500+'}</h3>
                      <small style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Job Seekers</small>
                    </div>
                  </div>
                </div>

                {/* SmartSearchBar - כולל חיפוש לפי טקסט ומיקום */}
                <SmartSearchBar
                  searchTerm={searchTerm}
                  location={location}
                  onSearch={(term) => handleSearch(term, location)}
                  onLocationChange={setLocation}
                  onSearchChange={setSearchTerm}
                />

                {/* CTA Buttons */}
                <div className="d-flex gap-3 mt-4">
                  {!isAuthenticated ? (
                    <>
                      <button
                        className="btn btn-light btn-lg px-4 hero-cta-btn"
                        onClick={() => navigate('/register')}
                      >
                        Get Started Free
                      </button>
                      <button
                        className="btn btn-outline-light btn-lg px-4 hero-cta-btn"
                        onClick={() => navigate('/about')}
                      >
                        Learn More
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-light btn-lg px-4 hero-cta-btn"
                        onClick={() => navigate('/jobs')}
                      >
                        Browse Jobs
                      </button>
                      <button
                        className="btn btn-outline-light btn-lg px-4 hero-cta-btn"
                        onClick={() => navigate('/profile')}
                      >
                        My Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right side - Floating job cards */}
            <div className="col-lg-6">
              <div className="hero-image text-center position-relative">
                <div style={{ height: '400px', position: 'relative' }}>
                  {/* Floating job cards */}
                  <div
                    className="card shadow-sm position-absolute hero-floating-card"
                    style={{
                      maxWidth: '200px',
                      top: '20%',
                      right: '20%',
                      animation: 'heroFloat 6s ease-in-out infinite',
                    }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary rounded p-2 me-2">
                          <i className="bi bi-code-slash text-white"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">Frontend Dev</h6>
                          <small className="text-muted">Tech Corp</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="card shadow-sm position-absolute hero-floating-card"
                    style={{
                      maxWidth: '200px',
                      top: '50%',
                      left: '10%',
                      animation: 'heroFloat 6s ease-in-out infinite 1s',
                    }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-success rounded p-2 me-2">
                          <i className="bi bi-palette text-white"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">UI Designer</h6>
                          <small className="text-muted">Design Co</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="card shadow-sm position-absolute hero-floating-card"
                    style={{
                      maxWidth: '200px',
                      bottom: '20%',
                      right: '30%',
                      animation: 'heroFloat 6s ease-in-out infinite 2s',
                    }}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-info rounded p-2 me-2">
                          <i className="bi bi-graph-up text-white"></i>
                        </div>
                        <div>
                          <h6 className="mb-0">Marketing</h6>
                          <small className="text-muted">Growth Inc</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background shapes */}
        <div
          className="position-absolute rounded-circle hero-bg-shape"
          style={{
            width: '200px',
            height: '200px',
            top: '10%',
            right: '10%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: 'heroRotate 20s linear infinite',
          }}
        ></div>
      </section>

    
    </>
  );
};

HeroSection.propTypes = {
  siteStats: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

export default HeroSection;
