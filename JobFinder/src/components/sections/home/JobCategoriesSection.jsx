import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const JobCategoriesSection = ({ categories = [], onCategoryClick }) => {
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

  const handleCategoryClick = (categoryName) => {
    if (onCategoryClick) {
      onCategoryClick(categoryName);
    }
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-5">
            <h2 className="fw-bold mb-3">Browse by Category</h2>
            <p className="text-muted lead">
              Discover opportunities across different industries and job functions
            </p>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {categoriesToDisplay.map((category, index) => (
            <div key={`category-${index}-${category.name}`} className="col-lg-4 col-md-6">
              <div 
                className="category-card card h-100 border-0 shadow-sm position-relative overflow-hidden" 
                style={{ cursor: 'pointer' }}
                onClick={() => handleCategoryClick(category.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCategoryClick(category.name);
                  }
                }}
                aria-label={`Browse ${category.name} jobs`}
              >
                <div className="card-body p-4 text-center">
                  {/* Background Pattern */}
                  <div 
                    className={`category-pattern position-absolute bg-${category.color || 'primary'} opacity-10`}
                  ></div>
                  
                  {/* Icon */}
                  <div className={`category-icon d-inline-flex align-items-center justify-content-center rounded-circle bg-${category.color || 'primary'} text-white mb-3`} 
                       style={{ width: '80px', height: '80px' }}>
                    <i className={`bi bi-${category.icon} fs-2`}></i>
                  </div>
                  
                  {/* Content */}
                  <h5 className="fw-bold mb-2">{category.name}</h5>
                  <p className="text-muted mb-3">
                    {category.count} {category.count === 1 ? 'position' : 'positions'} available
                  </p>
                  
                  {/* Hover Overlay */}
                  <div className="category-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <div className="category-cta">
                      <span className={`btn btn-${category.color || 'primary'}`}>
                        View Jobs <i className="bi bi-arrow-right ms-1"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="row text-center">
          <div className="col-md-4">
            <div className="quick-stat p-3">
              <h3 className="fw-bold text-primary mb-1">
                {categories.reduce((sum, cat) => sum + cat.count, 0) || '150+'}
              </h3>
              <p className="text-muted mb-0">Total Jobs</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="quick-stat p-3">
              <h3 className="fw-bold text-success mb-1">50+</h3>
              <p className="text-muted mb-0">Companies Hiring</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="quick-stat p-3">
              <h3 className="fw-bold text-info mb-1">1,200+</h3>
              <p className="text-muted mb-0">Job Seekers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles - Fixed: Removed jsx attribute and used proper CSS-in-JS */}
      <style>{`
        .category-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }

        .category-icon {
          transition: transform 0.3s ease;
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
  ),
  onCategoryClick: PropTypes.func
};

export default JobCategoriesSection;