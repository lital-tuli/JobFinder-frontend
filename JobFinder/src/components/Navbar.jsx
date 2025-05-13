// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if current route matches
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when navigating
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeMobileMenu}>
          <span className="text-primary">Job</span>Finder
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMobileMenu}
          aria-controls="navbarNav" 
          aria-expanded={isMobileMenuOpen ? 'true' : 'false'} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/jobs')}`} 
                to="/jobs" 
                onClick={closeMobileMenu}
              >
                Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/companies')}`} 
                to="/companies" 
                onClick={closeMobileMenu}
              >
                Companies
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/salaries')}`} 
                to="/salaries" 
                onClick={closeMobileMenu}
              >
                Salaries
              </Link>
            </li>
            {isAuthenticated && user?.role === 'recruiter' && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/post-job')}`} 
                  to="/post-job"
                  onClick={closeMobileMenu}
                >
                  Post a Job
                </Link>
              </li>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="nav-link me-3"
                  onClick={closeMobileMenu}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="dropdown">
                <a 
                  className="dropdown-toggle d-flex align-items-center text-decoration-none" 
                  href="#" 
                  role="button" 
                  id="userDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '32px', height: '32px'}}>
                    {user?.name?.first?.charAt(0) || 'U'}
                  </div>
                  <span className="d-none d-md-inline">{user?.name?.first || 'User'}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile" onClick={closeMobileMenu}>
                      <i className="bi bi-person me-2"></i>My Profile
                    </Link>
                  </li>
                  {user?.role === 'jobseeker' && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/saved-jobs" onClick={closeMobileMenu}>
                          <i className="bi bi-bookmark me-2"></i>Saved Jobs
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/applied-jobs" onClick={closeMobileMenu}>
                          <i className="bi bi-briefcase me-2"></i>Applications
                        </Link>
                      </li>
                    </>
                  )}
                  {user?.role === 'recruiter' && (
                    <li>
                      <Link className="dropdown-item" to="/my-listings" onClick={closeMobileMenu}>
                        <i className="bi bi-list-ul me-2"></i>My Listings
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;