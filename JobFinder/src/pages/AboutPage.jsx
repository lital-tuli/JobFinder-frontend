// src/pages/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-4 fw-bold mb-4">About <span className="text-primary">Job</span>Finder</h1>
          <p className="lead mb-4">
            Connecting talented professionals with their dream careers since 2024
          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-5">
              <h2 className="fw-bold mb-4">Our Mission</h2>
              <p className="mb-4">
                At JobFinder, our mission is to bridge the gap between talent and opportunity. We believe that the right job can transform lives, and the right candidate can transform companies. 
              </p>
              <p>
                We're committed to creating a platform that makes the job search process more efficient, transparent, and rewarding for both job seekers and employers. By leveraging technology and human expertise, we strive to create meaningful connections that drive careers and businesses forward.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="row mb-5">
        <div className="col-lg-10 mx-auto">
          <h2 className="fw-bold mb-4 text-center">Our Story</h2>
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="bg-light p-4 rounded-3 h-100">
                <p>
                  JobFinder was founded in 2024 by a team of technology and HR professionals who saw firsthand the challenges faced by both job seekers and employers in the digital age.
                </p>
                <p>
                  Despite the abundance of job boards and recruitment platforms, we noticed that many talented individuals struggled to find positions that truly matched their skills and aspirations, while companies faced difficulties identifying candidates who would thrive in their unique culture and environment.
                </p>
                <p>
                  This gap inspired us to build JobFinder – a platform that goes beyond simple job listings to create meaningful connections between professionals and organizations.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="bg-primary-light p-4 rounded-3 h-100">
                <p>
                  Since our launch, we've helped thousands of job seekers find fulfilling careers and enabled companies to build dynamic, diverse teams that drive innovation and growth.
                </p>
                <p>
                  Our platform continuously evolves based on feedback from our community and advances in technology, but our core mission remains the same: to connect the right people with the right opportunities at the right time.
                </p>
                <p>
                  Today, JobFinder stands as a trusted resource for job seekers and employers alike, committed to transforming the way the world works by making job discovery and talent acquisition more efficient, personal, and rewarding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="row mb-5">
        <div className="col-lg-10 mx-auto">
          <h2 className="fw-bold mb-4 text-center">Our Values</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="category-icon bg-primary-light rounded-circle mx-auto mb-3">
                    <i className="bi bi-lightbulb text-primary fs-4"></i>
                  </div>
                  <h5 className="card-title">Innovation</h5>
                  <p className="card-text">We constantly seek better ways to connect talent with opportunity through technology and creativity.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="category-icon bg-primary-light rounded-circle mx-auto mb-3">
                    <i className="bi bi-check2-circle text-primary fs-4"></i>
                  </div>
                  <h5 className="card-title">Integrity</h5>
                  <p className="card-text">We maintain the highest standards of honesty, transparency, and ethical behavior in all our interactions.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="category-icon bg-primary-light rounded-circle mx-auto mb-3">
                    <i className="bi bi-people text-primary fs-4"></i>
                  </div>
                  <h5 className="card-title">Inclusivity</h5>
                  <p className="card-text">We celebrate diversity and create a platform that serves all job seekers and employers equally.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="category-icon bg-primary-light rounded-circle mx-auto mb-3">
                    <i className="bi bi-graph-up-arrow text-primary fs-4"></i>
                  </div>
                  <h5 className="card-title">Impact</h5>
                  <p className="card-text">We measure our success by the positive difference we make in people's careers and companies' growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="row mb-5">
        <div className="col-lg-10 mx-auto">
          <h2 className="fw-bold mb-4 text-center">Our Leadership Team</h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="avatar bg-primary-light text-primary mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                    JD
                  </div>
                  <h5 className="card-title">Jane Doe</h5>
                  <p className="text-muted mb-3">CEO & Co-Founder</p>
                  <p className="card-text small">With over 15 years in HR tech, Jane leads our vision and strategy with passion and expertise.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="avatar bg-primary-light text-primary mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                    JS
                  </div>
                  <h5 className="card-title">John Smith</h5>
                  <p className="text-muted mb-3">CTO & Co-Founder</p>
                  <p className="card-text small">John's technical expertise and innovation drive our platform's capabilities forward.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="avatar bg-primary-light text-primary mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                    MC
                  </div>
                  <h5 className="card-title">Maria Chen</h5>
                  <p className="text-muted mb-3">Head of Product</p>
                  <p className="card-text small">Maria ensures our platform delivers exceptional experiences for all users.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm hover-lift">
                <div className="card-body text-center p-4">
                  <div className="avatar bg-primary-light text-primary mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                    RJ
                  </div>
                  <h5 className="card-title">Robert Johnson</h5>
                  <p className="text-muted mb-3">Chief Marketing Officer</p>
                  <p className="card-text small">Robert connects our platform with job seekers and employers worldwide.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card bg-primary text-white border-0 shadow">
            <div className="card-body p-5 text-center">
              <h2 className="fw-bold mb-3">Join Our Community</h2>
              <p className="lead mb-4">
                Whether you're looking for your next opportunity or your next star employee, JobFinder is here to help.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/register" className="btn btn-light text-primary fw-bold">
                  Create an Account
                </Link>
                <Link to="/contact" className="btn btn-outline-light">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;