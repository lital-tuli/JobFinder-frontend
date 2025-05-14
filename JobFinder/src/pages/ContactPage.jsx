import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate API call to send message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="fw-bold mb-3">Contact Us</h1>
          <p className="lead text-muted">Get in touch with our team. We're here to help.</p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-5 mb-4 mb-lg-0">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h2 className="h3 fw-bold mb-4">Get in Touch</h2>
              
              <div className="d-flex mb-4">
                <div className="bg-primary-light p-3 rounded-circle me-3">
                  <i className="bi bi-geo-alt text-primary"></i>
                </div>
                <div>
                  <h3 className="h6 fw-bold">Our Location</h3>
                  <p className="text-muted mb-0">
                    123 Business Avenue<br />
                    Tel Aviv, Israel
                  </p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="bg-primary-light p-3 rounded-circle me-3">
                  <i className="bi bi-envelope text-primary"></i>
                </div>
                <div>
                  <h3 className="h6 fw-bold">Email Us</h3>
                  <p className="text-muted mb-0">
                    info@jobfinder.com<br />
                    support@jobfinder.com
                  </p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="bg-primary-light p-3 rounded-circle me-3">
                  <i className="bi bi-telephone text-primary"></i>
                </div>
                <div>
                  <h3 className="h6 fw-bold">Call Us</h3>
                  <p className="text-muted mb-0">
                    +972 1234 5678<br />
                    Monday - Friday, 9am - 6pm
                  </p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="bg-primary-light p-3 rounded-circle me-3">
                  <i className="bi bi-question-circle text-primary"></i>
                </div>
                <div>
                  <h3 className="h6 fw-bold">Support</h3>
                  <p className="text-muted mb-0">
                    Visit our <a href="/faq" className="text-decoration-none">FAQ page</a> for quick answers to common questions
                  </p>
                </div>
              </div>
              
              <h3 className="h5 fw-bold mb-3">Follow Us</h3>
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
                <a href="#" className="btn btn-sm btn-outline-secondary rounded-circle p-2">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="h3 fw-bold mb-4">Send Us a Message</h2>
              
              {submitted ? (
                <div className="text-center py-4">
                  <div className="rounded-circle bg-primary-light mx-auto mb-3 d-flex align-items-center justify-content-center" style={{width: "80px", height: "80px"}}>
                    <i className="bi bi-check-lg text-primary fs-1"></i>
                  </div>
                  <h3 className="h4 fw-bold mb-3">Message Sent!</h3>
                  <p className="text-muted mb-4">
                    Thank you for contacting us. We will get back to you as soon as possible.
                  </p>
                  <button 
                    className="btn btn-primary px-4" 
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
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
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
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
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject</label>
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
                    <label htmlFor="message" className="form-label">Message</label>
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
                    className="btn btn-primary py-2 px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="ratio ratio-21x9" style={{minHeight: "400px"}}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54051.85103272953!2d34.7396755!3d32.0852999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d4ca6193b7c1f%3A0xc1fb72a2c0963f90!2sTel%20Aviv-Yafo%2C%20Israel!5e0!3m2!1sen!2sus!4v1620822235746!5m2!1sen!2sus" 
                  allowFullScreen="" 
                  loading="lazy"
                  title="Our location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;