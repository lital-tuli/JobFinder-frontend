import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="fw-bold mb-3">About <span className="text-primary">Job</span>Finder</h1>
          <p className="lead text-muted">Connecting talented professionals with top employers since 2023</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-md-6 mb-4 mb-md-0">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Team working together" 
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="fw-bold mb-3">Our Mission</h2>
          <p className="mb-3">
            At JobFinder, we believe that finding the right job shouldn't be a job itself. Our mission is to simplify 
            the job search process by connecting talented individuals with companies that value their skills and potential.
          </p>
          <p>
            We're dedicated to creating a platform that removes barriers between job seekers and employers, 
            making the hiring process more efficient, transparent, and enjoyable for everyone involved.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="row mb-5 flex-md-row-reverse">
        <div className="col-md-6 mb-4 mb-md-0">
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
            alt="Startup journey" 
            className="img-fluid rounded shadow-sm"
          />
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="fw-bold mb-3">Our Story</h2>
          <p className="mb-3">
            JobFinder was founded in 2023 by a team of professionals who experienced firsthand the challenges of 
            the job search process. After countless hours spent on various job platforms, our founders realized 
            there had to be a better way.
          </p>
          <p>
            What began as a simple idea to improve job searching has grown into a comprehensive platform 
            trusted by thousands of job seekers and hundreds of companies across the globe.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2 className="fw-bold">Our Values</h2>
          <p className="text-muted">The principles that guide everything we do</p>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-primary-light mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: "80px", height: "80px"}}>
                <i className="bi bi-star text-primary fs-2"></i>
              </div>
              <h3 className="fw-bold h5 mb-3">Excellence</h3>
              <p className="text-muted mb-0">
                We strive for excellence in everything we do, from the user experience on our platform to 
                the quality of opportunities we connect people with.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-primary-light mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: "80px", height: "80px"}}>
                <i className="bi bi-shield-check text-primary fs-2"></i>
              </div>
              <h3 className="fw-bold h5 mb-3">Integrity</h3>
              <p className="text-muted mb-0">
                We operate with complete transparency and honesty, earning the trust of both job seekers 
                and employers through our ethical practices.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-primary-light mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: "80px", height: "80px"}}>
                <i className="bi bi-people text-primary fs-2"></i>
              </div>
              <h3 className="fw-bold h5 mb-3">Community</h3>
              <p className="text-muted mb-0">
                We believe in the power of community and strive to create an inclusive platform where everyone 
                has access to opportunities regardless of background.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="row mb-5">
        <div className="col-12 text-center mb-4">
          <h2 className="fw-bold">Our Team</h2>
          <p className="text-muted">The people behind JobFinder</p>
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-light mb-3 mx-auto overflow-hidden" style={{width: "120px", height: "120px"}}>
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="CEO" 
                  className="img-fluid"
                />
              </div>
              <h5 className="fw-bold mb-1">Alex Johnson</h5>
              <p className="text-primary small mb-2">CEO & Co-Founder</p>
              <p className="text-muted small mb-0">
                Former HR executive with a passion for improving the hiring experience.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-light mb-3 mx-auto overflow-hidden" style={{width: "120px", height: "120px"}}>
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="CTO" 
                  className="img-fluid"
                />
              </div>
              <h5 className="fw-bold mb-1">Sarah Chen</h5>
              <p className="text-primary small mb-2">CTO & Co-Founder</p>
              <p className="text-muted small mb-0">
                Tech innovator focused on creating intuitive digital experiences.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-light mb-3 mx-auto overflow-hidden" style={{width: "120px", height: "120px"}}>
                <img 
                  src="https://randomuser.me/api/portraits/men/75.jpg" 
                  alt="Head of Operations" 
                  className="img-fluid"
                />
              </div>
              <h5 className="fw-bold mb-1">Michael Rivera</h5>
              <p className="text-primary small mb-2">Head of Operations</p>
              <p className="text-muted small mb-0">
                Ensures JobFinder runs smoothly for all our users every day.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="rounded-circle bg-light mb-3 mx-auto overflow-hidden" style={{width: "120px", height: "120px"}}>
                <img 
                  src="https://randomuser.me/api/portraits/women/65.jpg" 
                  alt="Head of Marketing" 
                  className="img-fluid"
                />
              </div>
              <h5 className="fw-bold mb-1">Emily Taylor</h5>
              <p className="text-primary small mb-2">Head of Marketing</p>
              <p className="text-muted small mb-0">
                Creative mind behind our outreach and community engagement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white p-5 rounded-3 text-center">
        <h2 className="fw-bold mb-3">Join Our Journey</h2>
        <p className="lead mb-4">
          Whether you're looking for your next career move or searching for top talent, 
          JobFinder is here to make the process simpler and more effective.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/register" className="btn btn-light px-4 py-2 text-primary fw-bold">
            Get Started
          </Link>
          <Link to="/contact" className="btn btn-outline-light px-4 py-2">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;