import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import JobCard from '../components/JobCard';
import jobService from '../services/jobService';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Fetch real featured jobs from the API
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const jobs = await jobService.getAllJobs();
        // Take the 3 most recent jobs as featured
        setFeaturedJobs(jobs.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch featured jobs:', error);
        setFeaturedJobs([]); // Set empty array if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to jobs page with search params
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 text-center">
              <h1 className="display-4 fw-bold text-primary mb-3">Find Your Dream Job Today</h1>
              <p className="lead mb-4">
                Join thousands of job seekers who have found their perfect career match through JobFinder
              </p>

{/* Search Form */}
<div className="card shadow border-0 mb-4">
  <div className="card-body p-4">
    <form onSubmit={handleSearch}>
      <div className="row g-3">
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-briefcase"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-light"
              placeholder="Job title, keywords, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-5">
          <div className="input-group">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-geo-alt"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-light"
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">
            <i className="bi bi-search me-1"></i> Search
          </button>
        </div>
      </div>
    </form>
  </div>
</div>

{/* Job Type Filters */}
              <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
                <Link to="/jobs?jobType=Remote" className="badge rounded-pill bg-light px-3 py-2 text-decoration-none">
                  Remote
                </Link>
                <Link to="/jobs?jobType=Full-time" className="badge rounded-pill bg-light px-3 py-2 text-decoration-none">
                  Full Time
                </Link>
                <Link to="/jobs?jobType=Part-time" className="badge rounded-pill bg-light px-3 py-2 text-decoration-none">
                  Part Time
                </Link>
                <Link to="/jobs?jobType=Contract" className="badge rounded-pill bg-light px-3 py-2 text-decoration-none">
                  Contract
                </Link>
                <Link to="/jobs?jobType=Internship" className="badge rounded-pill bg-light px-3 py-2 text-decoration-none">
                  Entry Level
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex justify-content-center gap-3">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register" className="btn btn-primary px-4 py-2">
                      Create Account
                    </Link>
                    <Link to="/login" className="btn btn-outline-primary px-4 py-2">
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link to="/profile" className="btn btn-primary px-4 py-2">
                    My Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs-section py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Featured Jobs</h2>
            <Link to="/jobs" className="text-decoration-none">
              View all jobs <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="row">
              {featuredJobs.map((job) => (
                <div className="col-lg-4 mb-4" key={job._id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No featured jobs available at the moment.</p>
              <Link to="/jobs" className="btn btn-primary">Browse All Jobs</Link>
            </div>
          )}
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="job-categories-section py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Popular Job Categories</h2>
          <p className="text-center text-muted mb-5">
            Explore some of our most in-demand job categories with thousands of open positions
          </p>
          
          <div className="row">
            {[
              { name: 'Development', icon: 'code-slash', count: 120 },
              { name: 'Design', icon: 'palette', count: 64 },
              { name: 'Marketing', icon: 'graph-up', count: 92 },
              { name: 'HR & Recruiting', icon: 'people', count: 56 },
              { name: 'Data & Analytics', icon: 'bar-chart', count: 75 },
              { name: 'Customer Service', icon: 'headset', count: 88 }
            ].map((category, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <Link to={`/jobs?search=${category.name.toLowerCase()}`} className="card h-100 shadow-sm border-0 text-decoration-none hover-lift">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="category-icon bg-primary-light rounded-circle p-3 me-3">
                        <i className={`bi bi-${category.icon} text-primary fs-4`}></i>
                      </div>
                      <div>
                        <h5 className="card-title mb-0 text-dark">{category.name}</h5>
                        <p className="card-text text-muted mb-0">{category.count} jobs available</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Ready to take the next step in your career?</h2>
          <p className="lead mb-4">Create your profile now and get matched with top companies hiring in your field</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register" className="btn btn-light px-4 py-2 text-primary fw-bold">
              Create Account
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-outline-light px-4 py-2">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;