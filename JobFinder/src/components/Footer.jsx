// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <Link to="/" className="navbar-brand d-block mb-3">
              <span className="text-primary">Job</span>Finder
            </Link>
            <p className="text-muted mb-4">
              Finding your dream job has never been easier. We connect talented professionals with top companies.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle p-2">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle p-2">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle p-2">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5>For Job Seekers</h5>
            <ul className="footer-links">
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/companies">Browse Companies</Link></li>
              <li><Link to="/salaries">Salary Information</Link></li>
              <li><Link to="/saved-jobs">Saved Jobs</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5>For Employers</h5>
            <ul className="footer-links">
              <li><Link to="/post-job">Post a Job</Link></li>
              <li><Link to="/my-listings">My Listings</Link></li>
              <li><Link to="/about">About JobFinder</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <h5>Support</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between">
          <p className="text-muted mb-3 mb-md-0">&copy; {currentYear} JobFinder. All rights reserved.</p>
          <div className="d-flex gap-3">
            <Link to="/privacy" className="text-muted small">Privacy</Link>
            <Link to="/terms" className="text-muted small">Terms</Link>
            <Link to="/about" className="text-muted small">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;