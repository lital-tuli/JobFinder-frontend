// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check active route
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
    <nav className={`navbar navbar-expand-lg ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-briefcase-fill me-2"></i>
          JobFinder
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/jobs')}`} 
                to="/jobs" 
                onClick={closeMobileMenu}
              >
                <i className="bi bi-search me-1"></i> Browse Jobs
              </Link>
            </li>
            
            {isAuthenticated && user?.role === 'recruiter' && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive('/post-job')}`} 
                  to="/post-job"
                  onClick={closeMobileMenu}
                >
                  <i className="bi bi-plus-circle me-1"></i> Post a Job
                </Link>
              </li>
            )}
            
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/login')}`} 
                    to="/login"
                    onClick={closeMobileMenu}
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <Link 
                    className="btn btn-primary btn-sm px-3" 
                    to="/register"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.name?.first}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile"
                        onClick={closeMobileMenu}
                      >
                        <i className="bi bi-person me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/saved-jobs"
                        onClick={closeMobileMenu}
                      >
                        <i className="bi bi-bookmark me-2"></i>
                        Saved Jobs
                      </Link>
                    </li>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/applied-jobs"
                        onClick={closeMobileMenu}
                      >
                        <i className="bi bi-briefcase me-2"></i>
                        Applied Jobs
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={() => {
                          logout();
                          closeMobileMenu();
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;