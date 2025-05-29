import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobCategoriesSection = ({ categories = [] }) => {
  // Default categories if none provided
  const defaultCategories = [
    { name: 'Development', icon: 'code-slash', count: 45, color: 'primary' },
    { name: 'Design', icon: 'palette', count: 23, color: 'success' },
    { name: 'Marketing', icon: 'graph-up', count: 18, color: 'info' },
    { name: 'HR & Recruiting', icon: 'people', count: 12, color: 'warning' },
    { name: 'Data & Analytics', icon: 'bar-chart', count: 15, color: 'danger' },
    { name: 'Customer Service', icon: 'headset', count: 8, color: 'secondary' }
  ];

  const categoriesToDisplay = categories.length > 0 ? categories : defaultCategories;

  const getCategoryLink = (categoryName) => {
    return `/jobs?search=${encodeURIComponent(categoryName.toLowerCase())}`;
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill mb-3">
                🎯 Browse by Category
              </span>
              <h2 className="display-5 fw-bold mb-3">Popular Job Categories</h2>
              <p className="lead text-muted">
                Explore opportunities in your field of expertise or discover new career paths
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="row g-4 mb-5">
          {categoriesToDisplay.map((category, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <Link 
                to={getCategoryLink(category.name)}
                className="text-decoration-none"
              >
                <div className="category-card h-100 p-4 bg-white rounded-3 shadow-sm border-0 position-relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="category-bg-pattern position-absolute top-0 end-0">
                    <div className={`category-pattern bg-${category.color || 'primary'} bg-opacity-10`}></div>
                  </div>

                  {/* Category Icon */}
                  <div className="category-icon-wrapper mb-3">
                    <div className={`category-icon bg-${category.color || 'primary'} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto`}>
                      <i className={`bi bi-${category.icon} text-${category.color || 'primary'} fs-1`}></i>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="text-center position-relative">
                    <h4 className="fw-bold mb-2">{category.name}</h4>
                    <p className="text-muted mb-3">
                      {category.count} open position{category.count !== 1 ? 's' : ''}
                    </p>
                    
                    {/* View Jobs Button */}
                    <div className="category-cta">
                      <span className={`btn btn-outline-${category.color || 'primary'} btn-sm`}>
                        View Jobs
                        <i className="bi bi-arrow-right ms-2"></i>
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="category-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <div className={`btn btn-${category.color || 'primary'} btn-lg px-4`}>
                      <i className="bi bi-search me-2"></i>
                      Explore {category.name}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Categories Link */}
        <div className="text-center">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="bg-white rounded-3 p-4 shadow-sm">
                <h5 className="fw-bold mb-3">Looking for Something Specific?</h5>
                <p className="text-muted mb-4">
                  Can't find your field? Browse all available jobs or use our advanced search to find exactly what you're looking for.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Link to="/jobs" className="btn btn-primary px-4">
                    <i className="bi bi-search me-2"></i>
                    Browse All Jobs
                  </Link>
                  <Link to="/companies" className="btn btn-outline-primary px-4">
                    <i className="bi bi-building me-2"></i>
                    Browse Companies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row mt-5">
          <div className="col-lg-8 mx-auto">
            <div className="row text-center">
              <div className="col-md-4 mb-3">
                <div className="quick-stat">
                  <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-briefcase text-primary fs-4"></i>
                  </div>
                  <h6 className="fw-semibold mb-1">Fresh Opportunities</h6>
                  <small className="text-muted">New jobs posted daily</small>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="quick-stat">
                  <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-shield-check text-success fs-4"></i>
                  </div>
                  <h6 className="fw-semibold mb-1">Verified Employers</h6>
                  <small className="text-muted">All companies are verified</small>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="quick-stat">
                  <div className="bg-info bg-opacity-10 rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-lightning-charge text-info fs-4"></i>
                  </div>
                  <h6 className="fw-semibold mb-1">Quick Applications</h6>
                  <small className="text-muted">Apply with one click</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .category-card {
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
        }

        .category-icon {
          width: 80px;
          height: 80px;
          transition: all 0.3s ease;
        }

        .category-card:hover .category-icon {
          transform: scale(1.1);
        }

        .category-pattern {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          transform: translate(30%, -30%);
        }

        .category-overlay {
          opacity: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .category-card:hover .category-overlay {
          opacity: 1;
        }

        .category-cta {
          transition: all 0.3s ease;
        }

        .category-card:hover .category-cta {
          transform: translateY(-5px);
        }

        .quick-stat {
          transition: transform 0.3s ease;
        }

        .quick-stat:hover {
          transform: translateY(-5px);
        }

        @media (max-width: 768px) {
          .category-card {
            margin-bottom: 1.5rem;
          }
          
          .category-icon {
            width: 60px;
            height: 60px;
          }
          
          .category-pattern {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </section>
  );
};

JobCategoriesSection.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      color: PropTypes.string
    })
  )
};

export default JobCategoriesSection;