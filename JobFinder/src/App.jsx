import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { JobInteractionProvider } from './context/JobInteractionContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { useAutoLogout } from './hooks/useAutoLogout';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/features/authentication/ForgotPasswordPage'));
const JobListPage = lazy(() => import('./pages/jobs/JobListPage'));
const JobDetailsPage = lazy(() => import('./pages/JobDetailsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PostJobPage = lazy(() => import('./pages/PostJobPage'));
const SavedJobsPage = lazy(() => import('./pages/jobs/SavedJobsPage'));
const AppliedJobsPage = lazy(() => import('./pages/AppliedJobsPage'));
const MyListingsPage = lazy(() => import('./pages/MyListingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const SalariesPage = lazy(() => import('./pages/SalariesPage'));
const Sandbox = lazy(() => import('./components/Sandbox'));
const Companies = lazy(() => import('./pages/Companies'));

// Loading component
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted">Loading page...</p>
    </div>
  </div>
);

// Unauthorized access component
const UnauthorizedPage = () => (
  <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-8 text-center">
        <div className="card shadow-sm border-0">
          <div className="card-body p-5">
            <i className="bi bi-shield-exclamation text-warning mb-3" style={{ fontSize: '4rem' }}></i>
            <h2 className="fw-bold mb-3">Access Denied</h2>
            <p className="text-muted mb-4">
              You don't have permission to access this page. Please contact an administrator if you believe this is an error.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button 
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                <i className="bi bi-arrow-left me-2"></i>Go Back
              </button>
              <a href="/" className="btn btn-outline-secondary">
                <i className="bi bi-house me-2"></i>Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// App Routes Component (inside Router context)
const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();
  
  // Initialize auto-logout hook
  useAutoLogout();

  // Enhanced Protected Route component with better error handling
  const ProtectedRoute = ({ children, roleRequired, fallback = null }) => {
    if (loading) {
      return <PageLoader />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
    }

    // Role-based access control
    if (roleRequired) {
      if (roleRequired === 'admin' && !user?.isAdmin) {
        return fallback || <UnauthorizedPage />;
      }
      
      if (roleRequired !== 'admin' && user?.role !== roleRequired) {
        return fallback || <UnauthorizedPage />;
      }
    }

    return children;
  };

  // Public Route (redirect authenticated users away from auth pages)
  const PublicRoute = ({ children }) => {
    if (loading) {
      return <PageLoader />;
    }

    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  // Show global loader while auth is being determined
  if (loading) {
    return <PageLoader />;
  }

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/salaries" element={<SalariesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          
          {/* Authentication routes (public only) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            } 
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
              <ProtectedRoute 
                roleRequired="jobseeker"
                fallback={
                  <div className="container py-5">
                    <div className="alert alert-info">
                      <h4>Feature Not Available</h4>
                      <p>The saved jobs feature is only available for job seekers. 
                         <a href="/profile" className="alert-link ms-1">Update your profile</a> to access this feature.
                      </p>
                    </div>
                  </div>
                }
              >
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
              <ProtectedRoute 
                roleRequired="recruiter"
                fallback={
                  <div className="container py-5">
                    <div className="alert alert-warning">
                      <h4>Recruiter Access Required</h4>
                      <p>You need recruiter privileges to post jobs. 
                         <a href="/contact" className="alert-link ms-1">Contact us</a> to upgrade your account.
                      </p>
                    </div>
                  </div>
                }
              >
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
          <Route 
            path="/job/:id/applications" 
            element={
              <ProtectedRoute roleRequired="recruiter">
                <div className="container py-5">
                  <div className="alert alert-info">
                    <h4>Feature Coming Soon</h4>
                    <p>The job applications management feature is currently under development.</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin specific routes */}
          <Route 
            path="/admin/sandbox" 
            element={
              <ProtectedRoute roleRequired="admin">
                <Sandbox />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute roleRequired="admin">
                <div className="container py-5">
                  <div className="alert alert-info">
                    <h4>Admin Panel</h4>
                    <p>Advanced admin features coming soon. Use the 
                       <a href="/admin/sandbox" className="alert-link ms-1">Sandbox</a> for current admin tools.
                    </p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Special routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <JobInteractionProvider>
          <AppRoutes />
        </JobInteractionProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;