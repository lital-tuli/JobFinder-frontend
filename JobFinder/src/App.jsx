import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListPage from './pages/JobListPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfilePage from './pages/ProfilePage';
import PostJobPage from './pages/PostJobPage';
import SavedJobsPage from './pages/SavedJobsPage';
import AppliedJobsPage from './pages/AppliedJobsPage';
import MyListingsPage from './pages/MyListingsPage';
import NotFoundPage from './pages/NotFoundPage';

// New pages
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

function App() {
  const { isAuthenticated, loading, user } = useAuth();

  // Protected route component
  const ProtectedRoute = ({ children, roleRequired }) => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (roleRequired && user?.role !== roleRequired) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          
          {/* Authentication routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} 
          />
          
          {/* Protected routes for all authenticated users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {/* Job seeker specific routes */}
          <Route 
            path="/saved-jobs" 
            element={
              <ProtectedRoute roleRequired="jobseeker">
                <SavedJobsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/applied-jobs" 
            element={
              <ProtectedRoute roleRequired="jobseeker">
                <AppliedJobsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Recruiter specific routes */}
          <Route 
            path="/post-job" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <PostJobPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-listings" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <MyListingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Informational Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          
          {/* 404 - Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;