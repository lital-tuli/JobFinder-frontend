// src/components/Home/HowItWorksSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      icon: 'person-plus',
      title: 'Create Your Profile',
      description: 'Sign up and build your professional profile with your skills, experience, and career goals.',
      color: 'primary',
      details: [
        'Upload your resume',
        'Highlight your skills',
        'Set job preferences',
        'Add portfolio links'
      ]
    },
    {
      id: 2,
      icon: 'search',
      title: 'Search & Discover',
      description: 'Browse thousands of job opportunities or let our smart filters find the perfect matches for you.',
      color: 'success',
      details: [
        'Advanced job search',
        'Smart recommendations',
        'Filter by location & type',
        'Save interesting jobs'
      ]
    },
    {
      id: 3,
      icon: 'send',
      title: 'Apply with Confidence',
      description: 'Submit applications with one click and track your progress through our intuitive dashboard.',
      color: 'info',
      details: [
        'One-click applications',
        'Track application status',
        'Get interview notifications',
        'Receive feedback'
      ]
    },
    {
      id: 4,
      icon: 'trophy',
      title: 'Land Your Dream Job',
      description: 'Connect with employers, showcase your talents, and secure the position that matches your aspirations.',
      color: 'warning',
      details: [
        'Direct employer contact',
        'Interview scheduling',
        'Salary negotiations',
        'Career advancement'
      ]
    }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-3">
                🚀 Simple Process
              </span>
              <h2 className="display-5 fw-bold mb-3">How JobFinder Works</h2>
              <p className="lead text-muted">
                Finding your dream job has never been easier. Follow these simple steps to get started.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="row g-4 mb-5">
          {steps.map((step, index) => (
            <div className="col-lg-3 col-md-6" key={step.id}>
              <div className="step-card h-100 text-center position-relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="step-connector d-none d-lg-block"></div>
                )}
                
                {/* Step Number */}
                <div className="step-number-wrapper mb-4">
                  <div className={`step-number bg-${step.color} text-white rounded-circle mx-auto d-flex align-items-center justify-content-center`}>
                    <span className="fw-bold">{step.id}</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="step-icon-wrapper mb-4">
                  <div className={`step-icon bg-${step.color} bg-opacity-10 rounded-circle mx-auto d-flex align-items-center justify-content-center`}>
                    <i className={`bi bi-${step.icon} text-${step.color} fs-1`}></i>
                  </div>
                </div>

                {/* Content */}
                <div className="step-content">
                  <h4 className="fw-bold mb-3">{step.title}</h4>
                  <p className="text-muted mb-4">{step.description}</p>
                  
                  {/* Details List */}
                  <ul className="list-unstyled text-start">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="mb-2 d-flex align-items-start">
                        <i className={`bi bi-check-circle-fill text-${step.color} me-2 mt-1 flex-shrink-0`}></i>
                        <small className="text-muted">{detail}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="cta-card bg-white rounded-3 p-5 shadow-sm">
                <div className="mb-4">
                  <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                      <i className="bi bi-rocket-takeoff text-primary fs-3"></i>
                    </div>
                    <div className="bg-success bg-opacity-10 rounded-circle p-3">
                      <i className="bi bi-lightning-charge text-success fs-3"></i>
                    </div>
                    <div className="bg-info bg-opacity-10 rounded-circle p-3">
                      <i className="bi bi-star text-info fs-3"></i>
                    </div>
                  </div>
                </div>
                
                <h3 className="fw-bold mb-3">Ready to Start Your Journey?</h3>
                <p className="text-muted mb-4">
                  Join thousands of professionals who have found their dream jobs through JobFinder. 
                  Your next career opportunity is just a few clicks away.
                </p>
                
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Link to="/register" className="btn btn-primary btn-lg px-4">
                    <i className="bi bi-person-plus me-2"></i>
                    Get Started Free
                  </Link>
                  <Link to="/jobs" className="btn btn-outline-primary btn-lg px-4">
                    <i className="bi bi-search me-2"></i>
                    Browse Jobs
                  </Link>
                </div>
                
                <div className="mt-4">
                  <small className="text-muted">
                    <i className="bi bi-shield-check text-success me-1"></i>
                    100% Free to use • No hidden fees • Secure & Private
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Stats */}
        <div className="row mt-5">
          <div className="col-lg-8 mx-auto">
            <div className="row text-center">
              <div className="col-md-4 mb-3">
                <div className="success-stat">
                  <h3 className="fw-bold text-primary mb-1">95%</h3>
                  <p className="text-muted mb-0 small">Success Rate</p>
                  <small className="text-muted">Users find jobs within 30 days</small>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="success-stat">
                  <h3 className="fw-bold text-success mb-1">24hrs</h3>
                  <p className="text-muted mb-0 small">Average Response</p>
                  <small className="text-muted">Employers respond quickly</small>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="success-stat">
                  <h3 className="fw-bold text-info mb-1">1M+</h3>
                  <p className="text-muted mb-0 small">Happy Users</p>
                  <small className="text-muted">Trusted by professionals</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .step-card {
          padding: 2rem 1.5rem;
          position: relative;
          background: white;
          border-radius: 16px;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .step-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          width: 40px;
          height: 40px;
          font-size: 1.2rem;
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .step-number-wrapper {
          position: relative;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          margin-bottom: 1rem;
        }

        .step-connector {
          position: absolute;
          top: 50%;
          right: -2rem;
          width: 4rem;
          height: 2px;
          background: linear-gradient(90deg, #dee2e6 0%, transparent 100%);
          z-index: 1;
        }

        .step-connector::before {
          content: '';
          position: absolute;
          right: -6px;
          top: -4px;
          width: 0;
          height: 0;
          border-left: 8px solid #dee2e6;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
        }

        .cta-card {
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #007bff, #28a745, #17a2b8, #ffc107);
        }

        .success-stat {
          padding: 1rem;
        }

        @media (max-width: 992px) {
          .step-connector {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .step-card {
            padding: 1.5rem 1rem;
          }
          
          .step-icon {
            width: 60px;
            height: 60px;
          }
          
          .step-icon i {
            font-size: 1.5rem !important;
          }
          
          .step-number {
            width: 32px;
            height: 32px;
            font-size: 1rem;
            top: -16px;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;