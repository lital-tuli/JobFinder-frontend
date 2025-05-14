import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Simulate API call with timeout
    try {
      // In production, replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000); // Hide success message after 5 seconds
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
          <p className="lead mb-4">
            Have questions or feedback? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>
      
      <div className="row mb-5">
        <div className="col-lg-10 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="row g-0">
                <div className="col-md-4 bg-primary text-white p-4 p-md-5">
                  <h3 className="fw-bold mb-4">Get In Touch</h3>
                  
                  <div className="mb-4">
                    <h5 className="fw-bold">Email</h5>
                    <p className="mb-1">
                      <i className="bi bi-envelope me-2"></i>
                      <a href="mailto:support@jobfinder.com" className="text-white text-decoration-none">support@jobfinder.com</a>
                    </p>
                    <p>
                      <i className="bi bi-envelope me-2"></i>
                      <a href="mailto:careers@jobfinder.com" className="text-white text-decoration-none">careers@jobfinder.com</a>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="fw-bold">Phone</h5>
                    <p>
                      <i className="bi bi-telephone me-2"></i>
                      <a href="tel:+1234567890" className="text-white text-decoration-none">+1 (234) 567-890</a>
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="fw-bold">Office</h5>
                    <p>
                      <i className="bi bi-geo-alt me-2"></i>
                      123 Business Avenue<br />
                      Suite 450<br />
                      Tel Aviv, Israel 6701234
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="fw-bold">Follow Us</h5>
                    <div className="d-flex gap-3">
                      <a href="#" className="text-white fs-5"><i className="bi bi-facebook"></i></a>
                      <a href="#" className="text-white fs-5"><i className="bi bi-twitter"></i></a>
                      <a href="#" className="text-white fs-5"><i className="bi bi-linkedin"></i></a>
                      <a href="#" className="text-white fs-5"><i className="bi bi-instagram"></i></a>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-8 p-4 p-md-5">
                  <h3 className="fw-bold mb-4">Send Us a Message</h3>
                  
                  {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      Your message has been sent successfully! We'll get back to you soon.
                      <button type="button" className="btn-close" onClick={() => setSuccess(false)} aria-label="Close"></button>
                    </div>
                  )}
                  
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Your Name*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address*</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="subject" className="form-label">Subject*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label">Message*</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="row mb-5">
        <div className="col-lg-10 mx-auto">
          <h2 className="fw-bold text-center mb-4">Frequently Asked Questions</h2>
          
          <div className="accordion" id="contactFAQ">
            <div className="accordion-item border-0 mb-3 shadow-sm">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  How do I create an account on JobFinder?
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#contactFAQ">
                <div className="accordion-body">
                  Creating an account is easy! Click on the "Sign Up" button in the top right corner of our website, fill in your information, and select whether you're a job seeker or recruiter. Verify your email address, and you're all set!
                </div>
              </div>
            </div>
            
            <div className="accordion-item border-0 mb-3 shadow-sm">
              <h2 className="accordion-header" id="headingTwo">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  What is the difference between a jobseeker and recruiter account?
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#contactFAQ">
                <div className="accordion-body">
                  Jobseeker accounts allow you to apply for jobs, save interesting listings, track your applications, and upload your resume. Recruiter accounts enable you to post job listings, manage applications, and connect with potential candidates.
                </div>
              </div>
            </div>
            
            <div className="accordion-item border-0 mb-3 shadow-sm">
              <h2 className="accordion-header" id="headingThree">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  How much does it cost to post a job on JobFinder?
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#contactFAQ">
                <div className="accordion-body">
                  We offer a range of flexible pricing plans for recruiters. Basic job postings start at $99 per listing, and we offer subscription options for companies with regular hiring needs. Contact our sales team for custom enterprise solutions.
                </div>
              </div>
            </div>
            
            <div className="accordion-item border-0 mb-3 shadow-sm">
              <h2 className="accordion-header" id="headingFour">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  How can I reset my password?
                </button>
              </h2>
              <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#contactFAQ">
                <div className="accordion-body">
                  Click on "Sign In" and then select "Forgot Password" beneath the login form. Enter your email address, and we'll send you a link to reset your password. For security reasons, this link expires after 24 hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="row">
        <div className="col-lg-10 mx-auto">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <div className="ratio ratio-21x9" style={{ maxHeight: '400px' }}>
                {/* Replace with an actual map component in production */}
                <div className="bg-light d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <i className="bi bi-geo-alt text-primary fs-1 mb-3"></i>
                    <h5>Interactive Map placeholder</h5>
                    <p className="text-muted">A map component would be displayed here in production</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;