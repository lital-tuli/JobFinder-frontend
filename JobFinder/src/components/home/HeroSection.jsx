import React, { useState } from 'react';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Create search parameters
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (location.trim()) params.append('location', location.trim());
    
    // For demo purposes, we'll show an alert with the search params
    // In your actual app, you would use navigate(`/jobs?${params.toString()}`)
    if (searchTerm.trim() || location.trim()) {
      alert(`Searching for: ${searchTerm || 'any job'} in ${location || 'any location'}`);
    } else {
      alert('Please enter a job title or location to search');
    }
  };

  const handleQuickSearch = (searchType, value) => {
    // Quick search handler
    alert(`Quick searching for ${searchType}: ${value}`);
  };

  const quickSearchCategories = [
    { label: 'Remote Jobs', type: 'jobType', value: 'Remote' },
    { label: 'Full-time', type: 'jobType', value: 'Full-time' },
    { label: 'Engineering', type: 'search', value: 'engineer' },
    { label: 'Marketing', type: 'search', value: 'marketing' },
    { label: 'Design', type: 'search', value: 'design' }
  ];

  return (
    <section className="hero-section text-white" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '80vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="container">
        <div className="row align-items-center" style={{ minHeight: '75vh' }}>
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="hero-content">
              {/* Badge */}
              <div className="mb-3">
                <span className="badge text-white px-3 py-2 rounded-pill" style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)' 
                }}>
                  Find Your Dream Career ✨
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="display-4 fw-bold mb-4">
                Discover Your Next 
                <span className="text-warning d-block">Career Opportunity</span>
              </h1>
              
              {/* Subtitle */}
              <p className="lead mb-4" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                Connect with top employers and find positions that match your skills, 
                experience, and career goals. Your perfect job is just a search away.
              </p>

              {/* Hero Stats */}
              <div className="row g-3 mb-5">
                <div className="col-4">
                  <div className="text-center">
                    <h3 className="fw-bold mb-0">6</h3>
                    <small style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Active Jobs</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <h3 className="fw-bold mb-0">4</h3>
                    <small style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Companies</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <h3 className="fw-bold mb-0">1,500+</h3>
                    <small style={{ color: 'rgba(255, 255, 255, 0.75)' }}>Job Seekers</small>
                  </div>
                </div>
              </div>

              {/* Interactive Search Section */}
              <div className="card shadow-lg border-0">
                <div className="card-body p-4">
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
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
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
                          onChange={(e) => setLocation(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button 
                        type="button" 
                        className="btn btn-primary btn-lg w-100"
                        onClick={handleSearch}
                      >
                        <i className="bi bi-search me-2"></i>
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Quick Search Tags */}
                  <div className="mt-3">
                    <small className="text-muted d-block mb-2">Popular searches:</small>
                    <div className="d-flex flex-wrap gap-2">
                      {quickSearchCategories.map((category, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleQuickSearch(category.type, category.value)}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex gap-3 mt-4">
                <button 
                  className="btn btn-light btn-lg px-4"
                  onClick={() => alert('Get Started clicked!')}
                >
                  Get Started Free
                </button>
                <button 
                  className="btn btn-outline-light btn-lg px-4"
                  onClick={() => alert('Learn More clicked!')}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Floating job cards */}
          <div className="col-lg-6">
            <div className="hero-image text-center position-relative">
              <div style={{ height: '400px', position: 'relative' }}>
                {/* Floating job cards */}
                <div 
                  className="card shadow-sm position-absolute"
                  style={{ 
                    maxWidth: '200px',
                    top: '20%',
                    right: '20%',
                    animation: 'float 6s ease-in-out infinite'
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
                  className="card shadow-sm position-absolute"
                  style={{ 
                    maxWidth: '200px',
                    top: '50%',
                    left: '10%',
                    animation: 'float 6s ease-in-out infinite 1s'
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
                  className="card shadow-sm position-absolute"
                  style={{ 
                    maxWidth: '200px',
                    bottom: '20%',
                    right: '30%',
                    animation: 'float 6s ease-in-out infinite 2s'
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
        className="position-absolute rounded-circle"
        style={{
          width: '200px',
          height: '200px',
          top: '10%',
          right: '10%',
          background: 'rgba(255, 255, 255, 0.1)',
          animation: 'rotate 20s linear infinite'
        }}
      ></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .btn:hover {
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }

        .card {
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
        }

        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 90vh;
          }
          
          .card {
            max-width: 150px !important;
          }
          
          .card h6 {
            font-size: 0.8rem;
          }
          
          .card small {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;