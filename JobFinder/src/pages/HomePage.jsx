import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJobInteractions } from '../hooks/useJobInteractions';
import jobService from '../services/jobService';
import HeroSection from '../components/sections/home/HeroSection';
import FeaturedJobsSection from '../components/sections/home/FeaturedJobsSection';
import JobCategoriesSection from '../components/sections/home/JobCategoriesSection';
import HowItWorksSection from '../components/sections/home/HowItWorksSection';
import TestimonialsSection from '../components/sections/home/TestimonialsSection';
import CTASection from '../components/sections/home/CTASection';
import EnhancedJobFilters from '../components/EnhancedJobFilters'; 

const HomePage = () => {
  // Basic state
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobCategories, setJobCategories] = useState([]);
  const [siteStats, setSiteStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalUsers: '1,500+'
  });

  // NEW: Enhanced filtering state
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Use the job interactions hook - must be called unconditionally
  const jobInteractions = useJobInteractions();
  const { isJobSaved, toggleSaveJob } = jobInteractions || {
    isJobSaved: () => false,
    toggleSaveJob: async () => {
      console.warn('toggleSaveJob fallback called');
    },
  };

  // Generate job categories from job data
  const generateJobCategories = useCallback((jobs) => {
    const categoryMap = {};
    jobs.forEach(job => {
      const title = job.title?.toLowerCase() || '';
      if (title.includes('developer') || title.includes('engineer') || title.includes('programmer')) {
        categoryMap['Development'] = (categoryMap['Development'] || 0) + 1;
      } else if (title.includes('design') || title.includes('ui') || title.includes('ux')) {
        categoryMap['Design'] = (categoryMap['Design'] || 0) + 1;
      } else if (title.includes('marketing')) {
        categoryMap['Marketing'] = (categoryMap['Marketing'] || 0) + 1;
      } else if (title.includes('sales')) {
        categoryMap['Sales'] = (categoryMap['Sales'] || 0) + 1;
      } else if (title.includes('manager') || title.includes('management')) {
        categoryMap['Management'] = (categoryMap['Management'] || 0) + 1;
      } else if (title.includes('support') || title.includes('customer')) {
        categoryMap['Customer Service'] = (categoryMap['Customer Service'] || 0) + 1;
      }
    });

    const categoriesWithIcons = [
      { name: 'Development', icon: 'bi-code-slash', count: categoryMap['Development'] || 0, color: 'primary' },
      { name: 'Design', icon: 'bi-palette', count: categoryMap['Design'] || 0, color: 'info' },
      { name: 'Marketing', icon: 'bi-megaphone', count: categoryMap['Marketing'] || 0, color: 'success' },
      { name: 'Sales', icon: 'bi-graph-up-arrow', count: categoryMap['Sales'] || 0, color: 'warning' },
      { name: 'Management', icon: 'bi-people', count: categoryMap['Management'] || 0, color: 'danger' },
      { name: 'Customer Service', icon: 'bi-headset', count: categoryMap['Customer Service'] || 0, color: 'secondary' }
    ];

    setJobCategories(categoriesWithIcons.filter(cat => cat.count > 0));
  }, []);

  // NEW: Handle filtered jobs from EnhancedJobFilters
  const handleFilteredJobs = useCallback((filtered) => {
    setFilteredJobs(filtered);
    // Update featured jobs to show filtered results (latest 6)
    setFeaturedJobs(filtered.slice(0, 6));
  }, []);

  // Fetch homepage data
  useEffect(() => {
    const fetchHomePageData = async () => {
      setLoading(true);
      setError('');
      
      try {
        const data = await jobService.getAllJobs();
        const jobsArray = Array.isArray(data) ? data : [];
        
        // NEW: Set both all jobs and filtered jobs
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
        
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
        setError('Failed to load job data. Please try again later.');
        setFeaturedJobs([]);
        setAllJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, [generateJobCategories]);

  // Handle job save
  const handleSaveJob = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    try {
      await toggleSaveJob(jobId);
    } catch (err) {
      console.error('Failed to save job:', err);
      setError(err.message || 'Failed to save job');
      setTimeout(() => setError(''), 5000);
    }
  }, [isAuthenticated, toggleSaveJob, navigate]);

  // Handle search from hero section (if you want to integrate with filters)
  const handleHeroSearch = useCallback((searchTerm, location) => {
    // Update the enhanced filters with hero search
    if (searchTerm || location) {
      const searchFiltered = allJobs.filter(job => {
        const matchesSearch = !searchTerm || 
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLocation = !location || 
          job.location?.toLowerCase().includes(location.toLowerCase());
        
        return matchesSearch && matchesLocation;
      });
      
      handleFilteredJobs(searchFiltered);
    }
  }, [allJobs, handleFilteredJobs]);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <HeroSection
        siteStats={siteStats}
        isAuthenticated={isAuthenticated}
        user={user}
        searchTerm={searchTerm}
        location={location}
        onSearchChange={setSearchTerm}
        onLocationChange={setLocation}
        onSearch={handleHeroSearch} // NEW: Pass search handler
      />

      {/* NEW: Enhanced Job Filters Section */}
      {allJobs.length > 0 && (
        <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="container">
            {/* Section Header */}
            <div className="row mb-4">
              <div className="col-12 text-center">
                <h2 className="fw-bold mb-2">Find Your Perfect Job</h2>
                <p className="text-muted">
                  Use our advanced filters to discover opportunities that match your preferences
                </p>
              </div>
            </div>

            {/* Enhanced Filters */}
            <EnhancedJobFilters 
              jobs={allJobs}
              onFilteredJobs={handleFilteredJobs}
              className="mb-4"
            />
            
            {/* Results Summary */}
            {filteredJobs.length !== allJobs.length && (
              <div className="row">
                <div className="col-12">
                  <div className="alert alert-info d-flex align-items-center">
                    <i className="bi bi-funnel me-2"></i>
                    <span>
                      Showing <strong>{filteredJobs.length}</strong> of <strong>{allJobs.length}</strong> jobs based on your filters.
                    </span>
                    <button 
                      className="btn btn-link p-0 ms-auto text-decoration-none"
                      onClick={() => handleFilteredJobs(allJobs)}
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Show all jobs
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="row g-3 mt-2">
              <div className="col-md-3 col-6">
                <div className="text-center">
                  <h4 className="fw-bold text-primary mb-0">{filteredJobs.length}</h4>
                  <small className="text-muted">Available Jobs</small>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="text-center">
                  <h4 className="fw-bold text-success mb-0">
                    {[...new Set(filteredJobs.map(job => job.company))].length}
                  </h4>
                  <small className="text-muted">Companies Hiring</small>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="text-center">
                  <h4 className="fw-bold text-info mb-0">
                    {[...new Set(filteredJobs.map(job => job.jobType))].length}
                  </h4>
                  <small className="text-muted">Job Types</small>
                </div>
              </div>
              <div className="col-md-3 col-6">
                <div className="text-center">
                  <h4 className="fw-bold text-warning mb-0">
                    {[...new Set(filteredJobs.map(job => job.location))].length}
                  </h4>
                  <small className="text-muted">Locations</small>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error Display */}
      {error && (
        <div className="container">
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}

      {/* Featured Jobs Section - Now shows filtered results */}
      <FeaturedJobsSection
        featuredJobs={featuredJobs}
        loading={loading}
        isAuthenticated={isAuthenticated}
        isJobSaved={isJobSaved}
        onSaveJob={handleSaveJob}
      />

      {/* Job Categories Section */}
      {jobCategories.length > 0 && (
        <JobCategoriesSection categories={jobCategories} />
      )}

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Call to Action Section */}
      <CTASection isAuthenticated={isAuthenticated} />

      {/* Inline Styles for Enhanced Animations */}
      <style jsx>{`
        .home-page {
          overflow-x: hidden;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .enhanced-job-filters {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .alert {
          animation: fadeInUp 0.4s ease-out;
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
          .alert {
            font-size: 0.9rem;
            padding: 0.75rem;
          }
          
          .alert .btn-link {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;