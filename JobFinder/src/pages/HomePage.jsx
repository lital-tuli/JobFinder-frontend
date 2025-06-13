// src/pages/HomePage.jsx - Complete Fixed Version
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../services/jobService';
import JobCard from '../components/jobs/JobCard/JobCard';
import EnhancedJobFilters from '../components/jobs/EnhancedJobFilters/EnhancedJobFilters';
import ErrorMessage from '../components/common/messages/ErrorMessage';

const HomePage = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [siteStats, setSiteStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalUsers: 1250, // Static for now
    totalApplications: 2800 // Static for now
  });

  // Generate job categories from jobs data
  const generateJobCategories = useCallback((jobs) => {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      setJobCategories([]);
      return;
    }

    const categoryMap = {};
    
    jobs.forEach(job => {
      const title = job.title?.toLowerCase() || '';
      
      // Categorize based on job title keywords
      if (title.includes('develop') || title.includes('engineer') || title.includes('programmer')) {
        categoryMap['Development'] = (categoryMap['Development'] || 0) + 1;
      } else if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
        categoryMap['Design'] = (categoryMap['Design'] || 0) + 1;
      } else if (title.includes('market') || title.includes('sales') || title.includes('business')) {
        categoryMap['Marketing'] = (categoryMap['Marketing'] || 0) + 1;
      } else if (title.includes('manage') || title.includes('lead') || title.includes('director')) {
        categoryMap['Management'] = (categoryMap['Management'] || 0) + 1;
      } else if (title.includes('support') || title.includes('customer')) {
        categoryMap['Customer Service'] = (categoryMap['Customer Service'] || 0) + 1;
      }
    });

    const categoriesWithIcons = [
      { name: 'Development', icon: 'bi-code-slash', count: categoryMap['Development'] || 0, color: 'primary' },
      { name: 'Design', icon: 'bi-palette', count: categoryMap['Design'] || 0, color: 'info' },
      { name: 'Marketing', icon: 'bi-megaphone', count: categoryMap['Marketing'] || 0, color: 'success' },
      { name: 'Management', icon: 'bi-people', count: categoryMap['Management'] || 0, color: 'danger' },
      { name: 'Customer Service', icon: 'bi-headset', count: categoryMap['Customer Service'] || 0, color: 'secondary' }
    ];

    setJobCategories(categoriesWithIcons.filter(cat => cat.count > 0));
  }, []);

  // Handle filtered jobs from EnhancedJobFilters
  const handleFilteredJobs = useCallback((filtered) => {
    console.log('Handling filtered jobs:', filtered);
    setFilteredJobs(filtered);
    // Update featured jobs to show filtered results (latest 6)
    setFeaturedJobs(filtered.slice(0, 6));
  }, []);

  // ✅ FIXED: Fetch homepage data with proper error handling
  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      setError('');
      
      try {
        console.log('Fetching homepage data...');
        
        // ✅ FIX: Use the fixed getAllJobs function
        const data = await jobService.getAllJobs();
        console.log('Homepage data received:', data);
        
        // ✅ FIX: Ensure we have an array to work with
        const jobsArray = Array.isArray(data) ? data : [];
        
        console.log('Processing jobs array:', jobsArray.length, 'jobs');
        
        // Set both all jobs and filtered jobs
        setAllJobs(jobsArray);
        setFilteredJobs(jobsArray);
        
        // Set featured jobs (latest 6 jobs)
        setFeaturedJobs(jobsArray.slice(0, 6));
        
        // Generate categories from all jobs
        generateJobCategories(jobsArray);
        
        // Update site stats
        setSiteStats(prev => ({
          ...prev,
          totalJobs: jobsArray.length,
          totalCompanies: [...new Set(jobsArray.map(job => job.company))].length
        }));
        
        console.log('Homepage data loaded successfully');
        
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
        
        // ✅ FIX: Better error handling
        if (err.error) {
          setError(err.error);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Failed to load job data. Please try again later.');
        }
        
        // Set empty arrays on error to prevent crashes
        setAllJobs([]);
        setFilteredJobs([]);
        setFeaturedJobs([]);
        setJobCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, [generateJobCategories]);

  // Retry function for error state
  const handleRetry = () => {
    window.location.reload();
  };

  // Loading state
  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading job listings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">
                Find Your Dream Job Today
              </h1>
              <p className="lead mb-4">
                Connect with top employers and discover opportunities that match your skills and ambitions.
              </p>
              <div className="d-flex gap-3">
                <Link to="/jobs" className="btn btn-light btn-lg">
                  <i className="bi bi-search me-2"></i>
                  Browse Jobs
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="/api/placeholder/500/400" 
                alt="Job search illustration" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-4 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-3">
              <div className="stat-item">
                <h3 className="text-primary fw-bold">{siteStats.totalJobs.toLocaleString()}</h3>
                <p className="text-muted mb-0">Active Jobs</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="stat-item">
                <h3 className="text-success fw-bold">{siteStats.totalCompanies.toLocaleString()}</h3>
                <p className="text-muted mb-0">Companies</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="stat-item">
                <h3 className="text-info fw-bold">{siteStats.totalUsers.toLocaleString()}</h3>
                <p className="text-muted mb-0">Job Seekers</p>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-3">
              <div className="stat-item">
                <h3 className="text-warning fw-bold">{siteStats.totalApplications.toLocaleString()}</h3>
                <p className="text-muted mb-0">Applications</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      {jobCategories.length > 0 && (
        <section className="categories-section py-5">
          <div className="container">
            <div className="row mb-4">
              <div className="col-12 text-center">
                <h2 className="fw-bold">Browse by Category</h2>
                <p className="text-muted">Explore opportunities in different fields</p>
              </div>
            </div>
            <div className="row">
              {jobCategories.map((category) => (
                <div key={category.name} className="col-lg-2 col-md-4 col-sm-6 mb-3">
                  <Link 
                    to={`/jobs?category=${encodeURIComponent(category.name)}`}
                    className="text-decoration-none"
                  >
                    <div className={`card border-0 shadow-sm h-100 hover-card text-center bg-${category.color} bg-opacity-10`}>
                      <div className="card-body py-4">
                        <i className={`bi ${category.icon} fs-1 text-${category.color} mb-3`}></i>
                        <h5 className="card-title">{category.name}</h5>
                        <p className="card-text text-muted">
                          {category.count} {category.count === 1 ? 'job' : 'jobs'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Job Search & Filter Section */}
      <section className="search-section py-5 bg-light">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="fw-bold">Latest Job Opportunities</h2>
              <p className="text-muted">Filter and find the perfect position for you</p>
            </div>
          </div>

          {/* Enhanced Job Filters */}
          <div className="row mb-4">
            <div className="col-12">
              <EnhancedJobFilters 
                jobs={allJobs}
                onFilteredJobs={handleFilteredJobs}
              />
            </div>
          </div>

          {/* Error Handling */}
          {error && (
            <div className="row mb-4">
              <div className="col-12">
                <ErrorMessage message={error} />
                <div className="text-center mt-3">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleRetry}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Featured Jobs Display */}
          <div className="row">
            {featuredJobs.length > 0 ? (
              featuredJobs.map((job, index) => (
                <div key={job._id || index} className="col-lg-4 col-md-6 mb-4">
                  <JobCard job={job} />
                </div>
              ))
            ) : !loading && !error ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-briefcase fs-1 text-muted mb-3"></i>
                <h4 className="text-muted">No jobs found</h4>
                <p className="text-muted">Try adjusting your search filters or check back later for new opportunities.</p>
                <Link to="/jobs" className="btn btn-primary">
                  View All Jobs
                </Link>
              </div>
            ) : null}
          </div>

          {/* View All Jobs Link */}
          {featuredJobs.length > 0 && (
            <div className="row">
              <div className="col-12 text-center">
                <Link to="/jobs" className="btn btn-outline-primary btn-lg">
                  <i className="bi bi-arrow-right me-2"></i>
                  View All Jobs ({filteredJobs.length})
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Ready to Start Your Career Journey?</h2>
              <p className="lead mb-0">
                Join thousands of professionals who have found their dream jobs through our platform.
              </p>
            </div>
            <div className="col-lg-4 text-center">
              <Link to="/register" className="btn btn-light btn-lg me-3">
                <i className="bi bi-person-plus me-2"></i>
                Get Started
              </Link>
              <Link to="/about" className="btn btn-outline-light btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;