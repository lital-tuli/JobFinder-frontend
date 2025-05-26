import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({
  siteStats,
  isAuthenticated,
  user,
  searchTerm,
  location,
  onSearchChange,
  onLocationChange,
  onSearch,
  onQuickSearch
}) => {
  const quickSearchCategories = [
    { label: 'Remote Jobs', type: 'jobType', value: 'Remote' },
    { label: 'Full-time', type: 'jobType', value: 'Full-time' },
    { label: 'Engineering', type: 'search', value: 'engineer' },
    { label: 'Marketing', type: 'search', value: 'marketing' },
    { label: 'Design', type: 'search', value: 'design' }
  ];

  return (
    <section className="hero-section bg-gradient-primary text-white">
      <div className="container">
        <div className="row align-items-center min-vh-75">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="hero-content">
              {/* Personalized greeting */}
              {isAuthenticated && user ? (
                <div className="mb-3">
                  <span className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill">
                    Welcome back, {user.name?.first || 'User'}! 👋
                  </span>
                </div>
              ) : (
                <div className="mb-3">
                  <span className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill">
                    Find Your Dream Career ✨
                  </span>
                </div>
              )}

              <h1 className="display-4 fw-bold mb-4">
                Discover Your Next 
                <span className="text-warning d-block">Career Opportunity</span>
              </h1>
              
              <p className="lead mb-4 text-white-75">
                Connect with top employers and find positions that match your skills, 
                experience, and career goals. Your perfect job is just a search away.
              </p>

              {/* Hero Stats */}
              <div className="row g-3 mb-5">
                <div className="col-4">
                  <div className="text-center">
                    <h3 className="fw-bold mb-0">{siteStats.totalJobs.toLocaleString()}</h3>
                    <small className="text-white-75">Active Jobs</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <h3 className="fw-bold mb-0">{siteStats.totalCompanies}</h3>
                    <small className="text-white-75">Companies</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <h3 className="fw-bold mb-0">{siteStats.totalUsers}</h3>
                    <small className="text-white-75">Job Seekers</small>
                  </div>
                </div>
              </div>

              {/* Search Form */}
              <div className="card shadow-lg border-0">
                <div className="card-body p-4">
                  <form onSubmit={onSearch}>
                    <div className="row g-3">
                      <div className="col-md-5">
                        <div className="input-group">
                          <span className="input-group-text bg-light border-0">
                            <i className="bi bi-search text-primary"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder="Job title, keywords, or company"
                            value={searchTerm}
                            onChange={onSearchChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="input-group">
                          <span className="input-group-text bg-light border-0">
                            <i className="bi bi-geo-alt text-primary"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control border-0 bg-light"
                            placeholder="City or remote"
                            value={location}
                            onChange={onLocationChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <button type="submit" className="btn btn-primary btn-lg w-100">
                          <i className="bi bi-search me-2"></i>
                          Search
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Quick Search Tags */}
                  <div className="mt-3">
                    <small className="text-muted d-block mb-2">Popular searches:</small>
                    <div className="d-flex flex-wrap gap-2">
                      {quickSearchCategories.map((category, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => onQuickSearch(category.type, category.value)}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              {!isAuthenticated && (
                <div className="d-flex gap-3 mt-4">
                  <Link to="/register" className="btn btn-light btn-lg px-4">
                    Get Started Free
                  </Link>
                  <Link to="/about" className="btn btn-outline-light btn-lg px-4">
                    Learn More
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-image text-center">
              <div className="hero-graphic position-relative">
                {/* Abstract job search illustration */}
                <div className="floating-cards">
                  <div className="job-card-float card shadow-sm" style={{ '--delay': '0s' }}>
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

                  <div className="job-card-float card shadow-sm" style={{ '--delay': '1s' }}>
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

                  <div className="job-card-float card shadow-sm" style={{ '--delay': '2s' }}>
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

                {/* Background elements */}
                <div className="hero-bg-elements">
                  <div className="bg-shape bg-shape-1"></div>
                  <div className="bg-shape bg-shape-2"></div>
                  <div className="bg-shape bg-shape-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="hero-wave">
        <svg viewBox="0 0 1440 320" className="w-100">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          min-height: 80vh;
        }

        .min-vh-75 {
          min-height: 75vh;
        }

        .text-white-75 {
          color: rgba(255, 255, 255, 0.75) !important;
        }

        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .floating-cards {
          position: relative;
          height: 400px;
        }

        .job-card-float {
          position: absolute;
          animation: float 6s ease-in-out infinite;
          animation-delay: var(--delay);
          max-width: 200px;
        }

        .job-card-float:nth-child(1) {
          top: 20%;
          right: 20%;
        }

        .job-card-float:nth-child(2) {
          top: 50%;
          left: 10%;
        }

        .job-card-float:nth-child(3) {
          bottom: 20%;
          right: 30%;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          background: white;
        }

        .bg-shape-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 70%;
          animation: rotate 20s linear infinite;
        }

        .bg-shape-2 {
          width: 150px;
          height: 150px;
          bottom: 30%;
          left: 20%;
          animation: rotate 15s linear infinite reverse;
        }

        .bg-shape-3 {
          width: 100px;
          height: 100px;
          top: 60%;
          right: 80%;
          animation: rotate 25s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .hero-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 90vh;
          }

          .floating-cards {
            height: 250px;
          }

          .job-card-float {
            max-width: 150px;
          }

          .job-card-float .card-body {
            padding: 0.75rem !important;
          }

          .job-card-float h6 {
            font-size: 0.8rem;
          }

          .job-card-float small {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;