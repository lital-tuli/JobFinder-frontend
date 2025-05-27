import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJobInteractions } from '../hooks/useJobInteractions';
import jobService from '../services/jobService';

// Fix import paths to match your actual file structure
import HeroSection from '../components/Home/HeroSection';
import FeaturedJobsSection from '../components/Home/FeaturedJobsSection';
import JobCategoriesSection from '../components/Home/JobCategoriesSection';
import HowItWorksSection from '../components/Home/HowItWorksSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import CTASection from '../components/Home/CTASection';

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
    totalUsers: '1,500+'
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
        
        const jobs = await jobService.getAllJobs();
        const jobsArray = Array.isArray(jobs) ? jobs : [];
        
        // Get featured jobs (latest 6 jobs)
        setFeaturedJobs(jobsArray.slice(0, 6));
        
        // Calculate site statistics
        const uniqueCompanies = new Set(jobsArray.map(job => job.company).filter(Boolean));
        setSiteStats({
          totalJobs: jobsArray.length,
          totalCompanies: uniqueCompanies.size,
          totalUsers: '1,500+'
        });

        // Generate job categories from actual data
        const categoryMap = generateJobCategories(jobsArray);
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

  // Generate job categories from job data
  const generateJobCategories = (jobs) => {
    const categoryMap = {};
    jobs.forEach(job => {
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
    return categoryMap;
  };

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
      <HeroSection
        siteStats={siteStats}
        isAuthenticated={isAuthenticated}
        user={user}
        searchTerm={searchTerm}
        location={location}
        onSearchChange={setSearchTerm}
        onLocationChange={setLocation}
        onSearch={handleSearch}
        onQuickSearch={handleQuickSearch}
      />

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
    </div>
  );
};

export default HomePage;