// Fixed HomePage.jsx - Prevents infinite re-renders
import { useState, useEffect, useCallback, useMemo } from 'react';
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
import EnhancedJobFilters from "../components/JobSearch/EnhancedJobFilters";

const HomePage = () => {
  // Basic state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [siteStats, setSiteStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalUsers: '1,500+'
  });

  // Enhanced filtering state
  const [allJobs, setAllJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // Use the job interactions hook
  const jobInteractions = useJobInteractions();
  const { isJobSaved, toggleSaveJob } = jobInteractions || {
    isJobSaved: () => false,
    toggleSaveJob: async () => {
      console.warn('toggleSaveJob fallback called');
    },
  };

  // ✅ FIX 1: Memoize category generation to prevent recreation
  // ✅ FIX 1: Memoize category generation to prevent recreation
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

    return categoriesWithIcons.filter(cat => cat.count > 0);
  }, []); // Empty deps since this function is pure

  // ✅ FIX 2: Memoize filter handler
  const handleFilteredJobs = useCallback((filtered) => {
    // Update featured jobs to show filtered results (latest 6)
    setFeaturedJobs(filtered.slice(0, 6));
  }, []);

  // Fetch homepage data
  const fetchHomePageData = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous calls
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Fetching homepage data...');
      const data = await jobService.getAllJobs();
      console.log('📊 Raw API response:', data);
      
      // Ensure we have an array
      const jobsArray = Array.isArray(data) ? data : [];
      console.log('📊 Processed jobs array:', jobsArray.length, 'jobs');
      
      // Update all job-related state in one batch
      setAllJobs(jobsArray);
      setFeaturedJobs(jobsArray.slice(0, 6));
      
      // Update site stats
      const uniqueCompanies = [...new Set(jobsArray.map(job => job.company))];
      setSiteStats(prev => ({
        ...prev,
        totalJobs: jobsArray.length,
        totalCompanies: uniqueCompanies.length
      }));

      console.log('✅ Homepage data updated successfully');
      
    } catch (err) {
      console.error('❌ Failed to fetch homepage data:', err);
      setError('Failed to load job data. Please try again later.');
      
      // Set empty arrays to prevent undefined errors
      setAllJobs([]);
      setFeaturedJobs([]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // ✅ FIX 4: Use proper useEffect with correct dependencies
  useEffect(() => {
    fetchHomePageData();
  }, [fetchHomePageData]); // Include fetchHomePageData dependency

  // ✅ FIX 5: Memoize expensive calculations
  const memoizedSiteStats = useMemo(() => siteStats, [siteStats]);
  const memoizedFeaturedJobs = useMemo(() => featuredJobs, [featuredJobs]);
  const memoizedJobCategories = useMemo(() => generateJobCategories(allJobs), [generateJobCategories, allJobs]);
  const handleSearch = useCallback((searchData) => {
    const { searchTerm: term, location: loc } = searchData;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (term && term.trim()) {
      queryParams.set('search', term.trim());
    }
    if (loc && loc.trim()) {
      queryParams.set('location', loc.trim());
    }
    
    // Navigate to jobs page with search parameters
    const queryString = queryParams.toString();
    const jobsPath = queryString ? `/jobs?${queryString}` : '/jobs';
    navigate(jobsPath);
  }, [navigate]);

  // Handle job category clicks
  const handleCategoryClick = useCallback((categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  }, [navigate]);

  // Handle job save/unsave
  const handleJobSave = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await toggleSaveJob(jobId);
    } catch (err) {
      console.error('Failed to save/unsave job:', err);
      setError('Failed to save job. Please try again.');
    }
  }, [isAuthenticated, navigate, toggleSaveJob]);

  return (
    <div className="homepage">
      <HeroSection 
        siteStats={memoizedSiteStats}
        isAuthenticated={isAuthenticated}
        onSearch={handleSearch}
        loading={loading}
      />

      {error && (
        <div className="container mt-4">
          <div className="alert alert-danger" role="alert">
            {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={fetchHomePageData}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <EnhancedJobFilters 
        jobs={allJobs}
        onFilteredJobs={handleFilteredJobs}
        showResults={false}
      />
      
      <FeaturedJobsSection 
        jobs={memoizedFeaturedJobs}
        isAuthenticated={isAuthenticated}
        user={user}
        isJobSaved={isJobSaved}
        onJobSave={handleJobSave}
        loading={loading}
      />
      
      <JobCategoriesSection 
        categories={memoizedJobCategories}
        onCategoryClick={handleCategoryClick}
      />
      
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection isAuthenticated={isAuthenticated} />
    </div>
  );
};

export default HomePage;