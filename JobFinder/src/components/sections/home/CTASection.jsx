import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = ({ isAuthenticated }) => {
  return (
    <>
      <section className="py-5 cta-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <div className="cta-content text-center text-white position-relative">
                {/* Background Elements */}
                <div className="cta-bg-elements">
                  <div className="cta-shape cta-shape-1"></div>
                  <div className="cta-shape cta-shape-2"></div>
                  <div className="cta-shape cta-shape-3"></div>
                </div>

                {/* Main Content */}
                <div className="position-relative z-index-10">
                  <div className="mb-4">
                    <span className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill mb-3">
                      🎯 Ready to Get Started?
                    </span>
                  </div>

                  <h2 className="display-4 fw-bold mb-4">
                    Your Dream Career 
                    <span className="d-block text-warning">Awaits You</span>
                  </h2>

                  <p className="lead mb-4 text-white-75 col-lg-8 mx-auto">
                    {isAuthenticated 
                      ? "Continue your job search journey and discover new opportunities that match your skills and aspirations."
                      : "Join thousands of professionals who have found their perfect job through JobFinder. Start your success story today."
                    }
                  </p>

                  {/* CTA Buttons */}
                  <div className="d-flex justify-content-center gap-3 flex-wrap mb-5">
                    {isAuthenticated ? (
                      <>
                        <Link to="/jobs" className="btn btn-light btn-lg px-4 py-3">
                          <i className="bi bi-search me-2"></i>
                          Browse Jobs
                        </Link>
                        <Link to="/profile" className="btn btn-outline-light btn-lg px-4 py-3">
                          <i className="bi bi-person me-2"></i>
                          Update Profile
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/register" className="btn btn-light btn-lg px-4 py-3">
                          <i className="bi bi-person-plus me-2"></i>
                          Get Started Free
                        </Link>
                        <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3">
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Feature Highlights */}
                  <div className="row">
                    <div className="col-lg-8 mx-auto">
                      <div className="row text-center">
                        <div className="col-md-4 mb-3">
                          <div className="feature-highlight">
                            <div className="bg-white bg-opacity-20 rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" 
                                 style={{ width: '50px', height: '50px' }}>
                              <i className="bi bi-shield-check text-white fs-5"></i>
                            </div>
                            <h6 className="fw-semibold mb-1">100% Free</h6>
                            <small className="text-white-75">No hidden costs or fees</small>
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="feature-highlight">
                            <div className="bg-white bg-opacity-20 rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" 
                                 style={{ width: '50px', height: '50px' }}>
                              <i className="bi bi-lightning-charge text-white fs-5"></i>
                            </div>
                            <h6 className="fw-semibold mb-1">Quick Setup</h6>
                            <small className="text-white-75">Get started in minutes</small>
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="feature-highlight">
                            <div className="bg-white bg-opacity-20 rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" 
                                 style={{ width: '50px', height: '50px' }}>
                              <i className="bi bi-people text-white fs-5"></i>
                            </div>
                            <h6 className="fw-semibold mb-1">Trusted</h6>
                            <small className="text-white-75">By 1M+ professionals</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  {!isAuthenticated && (
                    <div className="mt-5">
                      <p className="small text-white-50 mb-3">Trusted by professionals at</p>
                      <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap company-logos">
                        <div className="company-logo bg-white bg-opacity-20 rounded px-3 py-2">
                          <span className="fw-semibold text-white">Google</span>
                        </div>
                        <div className="company-logo bg-white bg-opacity-20 rounded px-3 py-2">
                          <span className="fw-semibold text-white">Microsoft</span>
                        </div>
                        <div className="company-logo bg-white bg-opacity-20 rounded px-3 py-2">
                          <span className="fw-semibold text-white">Apple</span>
                        </div>
                        <div className="company-logo bg-white bg-opacity-20 rounded px-3 py-2">
                          <span className="fw-semibold text-white">Meta</span>
                        </div>
                        <div className="company-logo bg-white bg-opacity-20 rounded px-3 py-2">
                          <span className="fw-semibold text-white">Amazon</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Styles */}
      <style>
        {`
          .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
            padding: 5rem 0;
          }

          .text-white-75 {
            color: rgba(255, 255, 255, 0.75) !important;
          }

          .text-white-50 {
            color: rgba(255, 255, 255, 0.5) !important;
          }

          .z-index-10 {
            z-index: 10;
          }

          .cta-bg-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
          }

          .cta-shape {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
          }

          .cta-shape-1 {
            width: 300px;
            height: 300px;
            top: -150px;
            right: 10%;
            animation: ctaFloat 20s ease-in-out infinite;
          }

          .cta-shape-2 {
            width: 200px;
            height: 200px;
            bottom: -100px;
            left: 15%;
            animation: ctaFloat 15s ease-in-out infinite reverse;
          }

          .cta-shape-3 {
            width: 150px;
            height: 150px;
            top: 20%;
            left: 5%;
            animation: ctaFloat 25s ease-in-out infinite;
          }

          @keyframes ctaFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-20px) rotate(120deg);
            }
            66% {
              transform: translateY(10px) rotate(240deg);
            }
          }

          .feature-highlight {
            transition: transform 0.3s ease;
          }

          .feature-highlight:hover {
            transform: translateY(-5px);
          }

          .company-logos {
            opacity: 0.8;
          }

          .company-logo {
            transition: all 0.3s ease;
            cursor: default;
          }

          .company-logo:hover {
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translateY(-2px);
          }

          .btn-light:hover,
          .btn-outline-light:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          }

          @media (max-width: 768px) {
            .cta-section {
              padding: 3rem 0;
            }
            
            .cta-shape-1 {
              width: 200px;
              height: 200px;
              top: -100px;
            }
            
            .cta-shape-2 {
              width: 150px;
              height: 150px;
              bottom: -75px;
            }
            
            .cta-shape-3 {
              width: 100px;
              height: 100px;
            }
            
            .company-logos {
              gap: 0.5rem !important;
            }
            
            .company-logo {
              padding: 0.25rem 0.75rem !important;
              font-size: 0.8rem;
            }
          }
        `}
      </style>
    </>
  );
};

export default CTASection;