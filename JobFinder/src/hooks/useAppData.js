import { useState, useEffect } from 'react';
import api from '../api'; 
const useAppData = () => {
  const [appData, setAppData] = useState({
    jobCategories: [],
    featuredCompanies: [],
    siteStatistics: {}
  });
  
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const [categories, companies, stats] = await Promise.all([
          api.get('/api/job-categories'),
          api.get('/api/featured-companies'), 
          api.get('/api/site-statistics')
        ]);
        
        setAppData({
          jobCategories: categories.data,
          featuredCompanies: companies.data,
          siteStatistics: stats.data
        });
      } catch (error) {
        console.error('Failed to fetch app data:', error);
      }
    };
    
    fetchAppData();
  }, []);
  
  return appData;
};

export default useAppData;