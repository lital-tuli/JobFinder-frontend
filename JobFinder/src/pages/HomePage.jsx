import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJobInteractions } from '../hooks/useJobInteractions';
import JobCard from '../components/JobCard';
import jobService from '../services/jobService';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobCategories, setJobCategories] = useState([]);
  const [siteStats, setSiteStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalUsers: 0
  });

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { toggleSaveJob, isJobSaved } = useJobInteractions();

  // Fetch featured jobs and site statistics
  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch jobs for featured section and statistics
        const jobs = await jobService.getAllJobs();
        const jobsArray = Array.isArray(jobs) ? jobs : [];
        
        // Get featured jobs (latest 6 jobs)
        setFeaturedJobs(jobsArray.slice(0, 6));
        
        // Calculate site statistics
        const uniqueCompanies = new Set(jobsArray.map(job => job.company).filter(Boolean));
        setSiteStats({
          totalJobs: jobsArray.length,
          totalCompanies: uniqueCompanies.size,
          totalUsers: '1,500+' // This would come from API in real app
        });

        // Generate job categories from actual data
        const categoryMap = {};
        jobsArray.forEach(job => {
          // Simple categorization based on job titles
          const title = job.title?.toLowerCase() || '';
          if (title.includes('developer') || title.includes('engineer') || title.includes('programmer')) {
            categoryMap['Development'] = (categoryMap['Development'] || 0) + 1;
          } else if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
            categoryMap['Design'] = (categoryMap['Design'] || 0) + 1;
          } else if (title.includes('marketing') || title.includes('social') || title.includes('content')) {
            categoryMap['Marketing'] = (categoryMap['Marketing'] || 0) + 1;
          } else if (title.includes('hr') || title.includes('recruit') || title.includes('people')) {
            categoryMap['HR & Recruiting'] = (categoryMap['HR & Recruiting'] || 0) + 1;
          } else if (title.includes('data') || title.includes('analyst') || title.includes('science')) {
            categoryMap['Data & Analytics'] = (categoryMap['Data & Analytics'] || 0) + 1;
          } else if (title.includes('support') || title.includes('customer') || title.includes('service')) {
            categoryMap['Customer Service'] = (categoryMap['Customer Service'] || 0) + 1;
          } else {
            categoryMap['Other'] = (categoryMap['Other'] || 0) + 1;
          }
        });

        // Convert to array format with icons
        const categoriesWithIcons = [
          { name: 'Development', icon: 'code-slash', count: categoryMap['Development'] || 0 },
          { name: 'Design', icon: 'palette', count: categoryMap['Design'] || 0 },
          { name: 'Marketing', icon: 'graph-up', count: categoryMap['Marketing'] || 0 },
          { name: 'HR & Recruiting', icon: 'people', count: categoryMap['HR & Recruiting'] || 0 },
          { name: 'Data & Analytics', icon: 'bar-chart', count: categoryMap['Data & Analytics'] || 0 },
          { name: 'Customer Service', icon: 'headset', count: categoryMap['Customer Service'] || 0 }
        ];

        setJobCategories(categoriesWithIcons.filter(cat => cat.count > 0));
        
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
        setError('Failed to load job data');
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  // Handle search form submission
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  }, [searchTerm, location, navigate]);

  // Handle job save
  const handleSaveJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    try {
      await toggleSaveJob(jobId);
    } catch (err) {
      setError(err.message || 'Failed to save job');
      setTimeout(() => setError(''), 5000);
    }
  }, [isAuthenticated, toggleSaveJob, navigate]);

  // Quick search handlers
  const handleQuickSearch = useCallback((searchType, value) => {
    const params = new URLSearchParams();
    params.append(searchType, value);
    navigate(`/jobs?${params.toString()}`);
  }, [navigate]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold text-dark mb-3">
                Find Your Dream Job
                <span className="text-primary d-block">Today</span>
              </h1>
              <p className="lead text-muted mb-4">
                Join thousands of professionals who have found their perfect career match. 
                Connect with top companies and discover opportunities that fit your skills and aspirations.
              </p>

              {/* Hero Stats */}
              <div className="row text-center mb-4">
                <div className="col-4">
                  <h3 className="text-primary fw-bold mb-0">{siteStats.totalJobs}</h3>
                  <small className="text-muted">Active Jobs</small>
                </div>
                <div className="col-4">
                  <h3 className="text-primary fw-bold mb-0">{siteStats.totalCompanies}</h3>
                  <small className="text-muted">Companies</small>
                </div>
                <div className="col-4">
                  <h3 className="text-primary fw-bold mb-0">{siteStats.totalUsers}</h3>
                  <small className="text-muted">Job Seekers</small>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex flex-wrap gap-3">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg px-4">
                      <i className="bi bi-person-plus me-2"></i>
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn btn-outline-primary btn-lg px-4">
                      Sign In
                    </Link>
                  </>
                ) : (
                  <div className="d-flex flex-wrap gap-3">
                    <Link to="/jobs" className="btn btn-primary btn-lg px-4">
                      <i className="bi bi-search me-2"></i>
                      Browse Jobs
                    </Link>
                    {user?.role === 'jobseeker' && (
                      <Link to="/saved-jobs" className="btn btn-outline-primary btn-lg px-4">
                        <i className="bi bi-bookmark me-2"></i>
                        Saved Jobs
                      </Link>
                    )}
                    {user?.role === 'recruiter' && (
                      <Link to="/post-job" className="btn btn-outline-success btn-lg px-4">
                        <i className="bi bi-plus-circle me-2"></i>
                        Post a Job
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              {/* Enhanced Search Form */}
              <div className="card shadow-lg border-0 search-form-card">
                <div className="card-body p-4">
                  <h4 className="fw-bold mb-4 text-center">Start Your Job Search</h4>
                  
                  <form onSubmit={handleSearch}>
                    <div className="mb-3">
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-0">
                          <i className="bi bi-briefcase text-primary"></i>
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
                    
                    <div className="mb-4">
                      <div className="input-group input-group-lg">
                        <span className="input-group-text bg-light border-0">
                          <i className="bi bi-geo-alt text-primary"></i>
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
                    
                    <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                      <i className="bi bi-search me-2"></i>
                      Search Jobs
                    </button>
                  </form>

                  {/* Quick Search Filters */}
                  <div className="text-center">
                    <small className="text-muted d-block mb-2">Popular searches:</small>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleQuickSearch('jobType', 'Remote')}
                      >
                        Remote
                      </button>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleQuickSearch('search', 'developer')}
                      >
                        Developer
                      </button>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleQuickSearch('search', 'marketing')}
                      >
                        Marketing
                      </button>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleQuickSearch('jobType', 'Full-time')}
                      >
                        Full-time
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div className="container">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError('')}
            ></button>
          </div>
        </div>
      )}

      {/* Featured Jobs Section */}
      <section className="featured-jobs-section py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-3">Featured Opportunities</h2>
              <p className="text-muted">
                Discover hand-picked job opportunities from top companies
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading featured jobs...</p>
            </div>
          ) : featuredJobs.length > 0 ? (
            <>
              <div className="row">
                {featuredJobs.map((job) => (
                  <div className="col-lg-4 col-md-6 mb-4" key={job._id}>
                    <JobCard 
                      job={job} 
                      saved={isAuthenticated && isJobSaved(job._id)}
                      onSave={handleSaveJob}
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-4">
                <Link to="/jobs" className="btn btn-primary btn-lg px-4">
                  <i className="bi bi-arrow-right me-2"></i>
                  View All Jobs
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-briefcase text-muted mb-3" style={{ fontSize: '4rem' }}></i>
              <h4>No Featured Jobs Available</h4>
              <p className="text-muted mb-4">Check back soon for new opportunities!</p>
              <Link to="/jobs" className="btn btn-primary">Browse All Jobs</Link>
            </div>
          )}
        </div>
      </section>

      {/* Job Categories Section */}
      {jobCategories.length > 0 && (
        <section className="categories-section py-5">
          <div className="container">
            <div className="row mb-5">
              <div className="col-12 text-center">
                <h2 className="fw-bold mb-3">Popular Job Categories</h2>
                <p className="text-muted">
                  Explore opportunities across different industries and roles
                </p>
              </div>
            </div>
            
            <div className="row">
              {jobCategories.map((category, index) => (
                <div className="col-lg-4 col-md-6 mb-4" key={index}>
                  <Link 
                    to={`/jobs?search=${encodeURIComponent(category.name.toLowerCase())}`} 
                    className="text-decoration-none"
                  >
                    <div className="card h-100 shadow-sm border-0 hover-lift">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center">
                          <div className="category-icon bg-primary-light rounded-circle p-3 me-3">
                            <i className={`bi bi-${category.icon} text-primary fs-4`}></i>
                          </div>
                          <div>
                            <h5 className="card-title mb-1 text-dark">{category.name}</h5>
                            <p className="card-text text-muted mb-0">
                              {category.count} job{category.count !== 1 ? 's' : ''} available
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="how-it-works-section py-5 bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-3">How JobFinder Works</h2>
              <p className="text-muted">
                Get started in just a few simple steps
              </p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="step-icon bg-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="fs-3 fw-bold">1</span>
                </div>
                <h5 className="fw-semibold mb-3">Create Your Profile</h5>
                <p className="text-muted">
                  Sign up and build a comprehensive profile showcasing your skills, experience, and career goals.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="step-icon bg-success text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="fs-3 fw-bold">2</span>
                </div>
                <h5 className="fw-semibold mb-3">Search & Apply</h5>
                <p className="text-muted">
                  Browse thousands of job opportunities, save your favorites, and apply to positions that match your interests.
                </p>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="text-center">
                <div className="step-icon bg-info text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <span className="fs-3 fw-bold">3</span>
                </div>
                <h5 className="fw-semibold mb-3">Get Hired</h5>
                <p className="text-muted">
                  Connect with employers, showcase your talents, and land your dream job with the right company.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-5">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="fw-bold mb-3">Success Stories</h2>
              <p className="text-muted">
                Hear from professionals who found their perfect match
              </p>
            </div>
          </div>
          
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                  <p className="text-muted mb-3">
                    "JobFinder helped me land my dream role as a software engineer. The platform is intuitive and the job recommendations were spot-on!"
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle me-3 d-flex align-items-center justify-content-center" 
                         style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">SA</span>
                    </div>
                    <div>
                      <h6 className="mb-0">Sarah Ahmed</h6>
                      <small className="text-muted">Software Engineer</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                  <p className="text-muted mb-3">
                    "As a recruiter, JobFinder has been invaluable for finding quality candidates. The platform saves us time and connects us with the right talent."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-success text-white rounded-circle me-3 d-flex align-items-center justify-content-center" 
                         style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">MR</span>
                    </div>
                    <div>
                      <h6 className="mb-0">Mike Rodriguez</h6>
                      <small className="text-muted">HR Director</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                    <i className="bi bi-star-fill text-warning"></i>
                  </div>
                  <p className="text-muted mb-3">
                    "The career transition support was amazing. I switched industries successfully thanks to the resources and job matches on JobFinder."
                  </p>
                  <div className="d-flex align-items-center">
                    <div className="bg-info text-white rounded-circle me-3 d-flex align-items-center justify-content-center" 
                         style={{ width: '40px', height: '40px' }}>
                      <span className="fw-bold">EP</span>
                    </div>
                    <div>
                      <h6 className="mb-0">Emily Park</h6>
                      <small className="text-muted">Marketing Manager</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Ready to Take the Next Step?</h2>
              <p className="lead mb-4">
                Join thousands of professionals who have already found their perfect career match. 
                Your dream job is just a click away.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {!isAuthenticated ? (
                  <>
                    <Link to="/register" className="btn btn-light btn-lg px-4 text-primary fw-bold">
                      <i className="bi bi-person-plus me-2"></i>
                      Create Free Account
                    </Link>
                    <Link to="/jobs" className="btn btn-outline-light btn-lg px-4">
                      <i className="bi bi-search me-2"></i>
                      Browse Jobs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/jobs" className="btn btn-light btn-lg px-4 text-primary fw-bold">
                      <i className="bi bi-search me-2"></i>
                      Find Your Next Job
                    </Link>
                    <Link to="/profile" className="btn btn-outline-light btn-lg px-4">
                      <i className="bi bi-person me-2"></i>
                      Complete Profile
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;