import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef,
  memo
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useJobInteractions } from '../hooks/useJobInteractions';
import jobService from '../services/jobService';
import { logger } from '../utils/logger';
import { debounce } from '../utils/performance';

// Lazy load components for better performance
const HeroSection = React.lazy(() => import('../components/sections/home/HeroSection'));
const FeaturedJobsSection = React.lazy(() => import('../components/sections/home/FeaturedJobsSection'));
const JobCategoriesSection = React.lazy(() => import('../components/sections/home/JobCategoriesSection'));
const HowItWorksSection = React.lazy(() => import('../components/sections/home/HowItWorksSection'));
const TestimonialsSection = React.lazy(() => import('../components/sections/home/TestimonialsSection'));
const CTASection = React.lazy(() => import('../components/sections/home/CTASection'));

// Loading skeleton components
const HeroSkeleton = () => (
  <div className="hero-skeleton animate-pulse bg-light" style={{ height: '600px' }} />
);

const SectionSkeleton = () => (
  <div className="section-skeleton animate-pulse bg-light mb-4" style={{ height: '300px' }} />
);

// Constants
const FEATURED_JOBS_COUNT = 6;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

// Job categories configuration
const JOB_CATEGORIES_CONFIG = [
  { 
    name: 'Development', 
    icon: 'bi-code-slash', 
    color: 'primary',
    keywords: ['developer', 'engineer', 'programmer', 'software', 'frontend', 'backend', 'fullstack']
  },
  { 
    name: 'Design', 
    icon: 'bi-palette', 
    color: 'info',
    keywords: ['design', 'ui', 'ux', 'graphic', 'visual', 'creative']
  },
  { 
    name: 'Marketing', 
    icon: 'bi-megaphone', 
    color: 'success',
    keywords: ['marketing', 'digital', 'seo', 'content', 'social media']
  },
  { 
    name: 'Sales', 
    icon: 'bi-graph-up-arrow', 
    color: 'warning',
    keywords: ['sales', 'business development', 'account', 'revenue']
  },
  { 
    name: 'Management', 
    icon: 'bi-people', 
    color: 'danger',
    keywords: ['manager', 'management', 'director', 'lead', 'supervisor']
  },
  { 
    name: 'Customer Service', 
    icon: 'bi-headset', 
    color: 'secondary',
    keywords: ['support', 'customer', 'service', 'help desk', 'client']
  }
];

// Custom hooks for better organization
const useHomePageData = () => {
  const [state, setState] = useState({
    allJobs: [],
    featuredJobs: [],
    loading: true,
    error: null,
    lastFetch: null
  });
  
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);

  // Optimized fetch function with caching and retry logic
  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    const now = Date.now();
    if (!forceRefresh && state.lastFetch && (now - state.lastFetch < CACHE_DURATION)) {
      logger.info('Using cached data');
      return;
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      logger.api.request('GET', '/api/jobs');
      
      const data = await jobService.getAllJobs({}, {
        signal: abortControllerRef.current.signal
      });

      const jobsArray = Array.isArray(data) ? data : [];
      
      if (jobsArray.length === 0) {
        logger.warning('No jobs received from API');
      }

      setState({
        allJobs: jobsArray,
        featuredJobs: jobsArray.slice(0, FEATURED_JOBS_COUNT),
        loading: false,
        error: null,
        lastFetch: now
      });

      retryCountRef.current = 0;
      logger.success(`Loaded ${jobsArray.length} jobs`);

    } catch (error) {
      if (error.name === 'AbortError') {
        logger.info('Request was cancelled');
        return;
      }

      logger.error('Failed to fetch jobs:', error);

      // Retry logic
      if (retryCountRef.current < RETRY_ATTEMPTS) {
        retryCountRef.current++;
        logger.info(`Retrying... Attempt ${retryCountRef.current}/${RETRY_ATTEMPTS}`);
        
        setTimeout(() => {
          fetchData(forceRefresh);
        }, RETRY_DELAY * retryCountRef.current);
        
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load jobs'
      }));
    }
  }, [state.lastFetch]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { ...state, fetchData, refetch: () => fetchData(true) };
};

const useSiteStats = (jobs) => {
  return useMemo(() => {
    const uniqueCompanies = new Set(jobs.map(job => job.company?.trim()).filter(Boolean));
    
    return {
      totalJobs: jobs.length,
      totalCompanies: uniqueCompanies.size,
      totalUsers: '1,500+' // This could be fetched from API if needed
    };
  }, [jobs]);
};

const useJobCategories = (jobs) => {
  return useMemo(() => {
    const categoryMap = new Map();

    // Initialize categories
    JOB_CATEGORIES_CONFIG.forEach(category => {
      categoryMap.set(category.name, { ...category, count: 0 });
    });

    // Count jobs per category
    jobs.forEach(job => {
      const title = (job.title || '').toLowerCase();
      const description = (job.description || '').toLowerCase();
      const searchText = `${title} ${description}`;

      JOB_CATEGORIES_CONFIG.forEach(category => {
        const hasMatch = category.keywords.some(keyword => 
          searchText.includes(keyword.toLowerCase())
        );
        
        if (hasMatch) {
          const current = categoryMap.get(category.name);
          categoryMap.set(category.name, { ...current, count: current.count + 1 });
        }
      });
    });

    return Array.from(categoryMap.values()).filter(category => category.count > 0);
  }, [jobs]);
};

// Memoized error component
const ErrorAlert = memo(({ error, onDismiss, onRetry }) => (
  <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
    <div className="d-flex align-items-center">
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      <div className="flex-grow-1">
        <strong>Error:</strong> {error}
      </div>
      <div className="ms-3">
        <button 
          type="button" 
          className="btn btn-outline-danger btn-sm me-2"
          onClick={onRetry}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Retry
        </button>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onDismiss}
          aria-label="Close"
        />
      </div>
    </div>
  </div>
));

// Main HomePage component
const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const jobInteractions = useJobInteractions();
  
  // Custom hooks
  const { allJobs, featuredJobs, loading, error, fetchData, refetch } = useHomePageData();
  const siteStats = useSiteStats(allJobs);
  const jobCategories = useJobCategories(allJobs);

  // Initialize data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized handlers
  const handleSearch = useCallback(debounce((searchData) => {
    const { searchTerm, location } = searchData;
    const queryParams = new URLSearchParams();
    
    if (searchTerm?.trim()) {
      queryParams.set('search', searchTerm.trim());
    }
    if (location?.trim()) {
      queryParams.set('location', location.trim());
    }
    
    const queryString = queryParams.toString();
    const jobsPath = queryString ? `/jobs?${queryString}` : '/jobs';
    navigate(jobsPath);
  }, 300), [navigate]);

  const handleCategoryClick = useCallback((categoryName) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
  }, [navigate]);

  const handleJobSave = useCallback(async (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await jobInteractions?.toggleSaveJob(jobId);
    } catch (err) {
      logger.error('Failed to save/unsave job:', err);
    }
  }, [isAuthenticated, navigate, jobInteractions]);

  const handleErrorDismiss = useCallback(() => {
    // Clear error without refetching
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Memoized sections for better performance
  const heroSection = useMemo(() => (
    <React.Suspense fallback={<HeroSkeleton />}>
      <HeroSection 
        siteStats={siteStats}
        isAuthenticated={isAuthenticated}
        onSearch={handleSearch}
      />
    </React.Suspense>
  ), [siteStats, isAuthenticated, handleSearch]);

  const featuredJobsSection = useMemo(() => (
    <React.Suspense fallback={<SectionSkeleton />}>
      <FeaturedJobsSection 
        jobs={featuredJobs}
        loading={loading}
        isJobSaved={jobInteractions?.isJobSaved}
        onJobSave={handleJobSave}
        isAuthenticated={isAuthenticated}
      />
    </React.Suspense>
  ), [featuredJobs, loading, jobInteractions, handleJobSave, isAuthenticated]);

  const categoriesSection = useMemo(() => (
    <React.Suspense fallback={<SectionSkeleton />}>
      <JobCategoriesSection 
        categories={jobCategories}
        onCategoryClick={handleCategoryClick}
      />
    </React.Suspense>
  ), [jobCategories, handleCategoryClick]);

  const staticSections = useMemo(() => (
    <>
      <React.Suspense fallback={<SectionSkeleton />}>
        <HowItWorksSection />
      </React.Suspense>
      
      <React.Suspense fallback={<SectionSkeleton />}>
        <TestimonialsSection />
      </React.Suspense>
      
      <React.Suspense fallback={<SectionSkeleton />}>
        <CTASection isAuthenticated={isAuthenticated} />
      </React.Suspense>
    </>
  ), [isAuthenticated]);

  return (
    <div className="homepage">
      {error && (
        <ErrorAlert 
          error={error}
          onDismiss={handleErrorDismiss}
          onRetry={handleRetry}
        />
      )}

      <main>
        {heroSection}
        {featuredJobsSection}
        {categoriesSection}
        {staticSections}
      </main>
    </div>
  );
};

// Export memoized component
export default memo(HomePage);