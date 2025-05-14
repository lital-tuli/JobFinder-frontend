// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  // Get current date for the "Last Updated" section
  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="fw-bold">Privacy Policy</h1>
          <p className="text-muted">Last Updated: {getCurrentDate()}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="sticky-md-top pt-md-5" style={{top: "90px"}}>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Table of Contents</h5>
                <nav className="nav flex-column">
                  <a className="nav-link px-0 py-2" href="#introduction">Introduction</a>
                  <a className="nav-link px-0 py-2" href="#information">Information We Collect</a>
                  <a className="nav-link px-0 py-2" href="#usage">How We Use Your Information</a>
                  <a className="nav-link px-0 py-2" href="#sharing">Information Sharing</a>
                  <a className="nav-link px-0 py-2" href="#cookies">Cookies & Technologies</a>
                  <a className="nav-link px-0 py-2" href="#security">Data Security</a>
                  <a className="nav-link px-0 py-2" href="#rights">Your Rights</a>
                  <a className="nav-link px-0 py-2" href="#changes">Policy Changes</a>
                  <a className="nav-link px-0 py-2" href="#contact">Contact Us</a>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <section id="introduction" className="mb-5">
                <h2 className="fw-bold mb-3">1. Introduction</h2>
                <p>
                  JobFinder ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how 
                  we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
                <p>
                  We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert 
                  you about any changes by updating the "Last Updated" date of this Privacy Policy. You are encouraged to 
                  periodically review this Privacy Policy to stay informed of updates.
                </p>
              </section>

              <section id="information" className="mb-5">
                <h2 className="fw-bold mb-3">2. Information We Collect</h2>
                
                <h3 className="h5 fw-bold mb-2">Personal Information</h3>
                <p>
                  We may collect personal information that you voluntarily provide to us when you register on our platform, 
                  express interest in obtaining information about us or our services, or otherwise contact us. The personal 
                  information we collect may include:
                </p>
                <ul>
                  <li>Name, email address, and contact information</li>
                  <li>Login credentials (username and password)</li>
                  <li>Professional information (resume/CV, work experience, education, skills)</li>
                  <li>Profile information (photograph, bio, career preferences)</li>
                  <li>Payment and billing information if you purchase premium services</li>
                </ul>

                <h3 className="h5 fw-bold mb-2">Automatically Collected Information</h3>
                <p>
                  When you access our platform, we may automatically collect certain information about your device, including:
                </p>
                <ul>
                  <li>Device type, operating system, and browser type</li>
                  <li>IP address and geographic location</li>
                  <li>Browsing actions and patterns on our platform</li>
                  <li>Time spent on pages and features you use</li>
                </ul>
              </section>

              <section id="usage" className="mb-5">
                <h2 className="fw-bold mb-3">3. How We Use Your Information</h2>
                <p>
                  We may use the information we collect about you for a variety of purposes, including to:
                </p>
                <ul>
                  <li>Create and manage your account</li>
                  <li>Provide and maintain our services</li>
                  <li>Process and complete transactions</li>
                  <li>Match you with relevant job opportunities or candidates</li>
                  <li>Send you service-related notifications and updates</li>
                  <li>Respond to inquiries and provide customer support</li>
                  <li>Improve our website and user experience</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Protect against unauthorized access to our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section id="sharing" className="mb-5">
                <h2 className="fw-bold mb-3">4. Information Sharing</h2>
                <p>
                  We may share your information in the following situations:
                </p>
                <ul>
                  <li><strong>With Employers and Job Seekers:</strong> We share profile information with employers for job seekers, and with job seekers for employers, to facilitate the job search and recruitment process.</li>
                  <li><strong>With Service Providers:</strong> We may share your information with third-party vendors and service providers that perform services for us or on our behalf.</li>
                  <li><strong>For Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</li>
                  <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose your information to comply with legal obligations, protect and defend our rights and property, or when we believe disclosure is necessary to protect the safety of others.</li>
                </ul>
              </section>

              <section id="cookies" className="mb-5">
                <h2 className="fw-bold mb-3">5. Cookies & Similar Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to track the activity on our platform and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </p>
                <p>
                  We use the following types of cookies:
                </p>
                <ul>
                  <li><strong>Essential Cookies:</strong> Necessary for the operation of our platform.</li>
                  <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our platform.</li>
                  <li><strong>Functionality Cookies:</strong> Enable us to personalize content and remember your preferences.</li>
                  <li><strong>Targeting Cookies:</strong> Record your visit to our platform, the pages you have visited, and the links you have followed.</li>
                </ul>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
                </p>
              </section>

              <section id="security" className="mb-5">
                <h2 className="fw-bold mb-3">6. Data Security</h2>
                <p>
                  We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                </p>
              </section>

              <section id="rights" className="mb-5">
                <h2 className="fw-bold mb-3">7. Your Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul>
                  <li>The right to access personal information we hold about you</li>
                  <li>The right to request correction of inaccurate personal information</li>
                  <li>The right to request deletion of your personal information</li>
                  <li>The right to withdraw consent for processing of your personal information</li>
                  <li>The right to object to the processing of your personal information</li>
                  <li>The right to data portability</li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below.
                </p>
              </section>

              <section id="changes" className="mb-5">
                <h2 className="fw-bold mb-3">8. Policy Changes</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </section>

              <section id="contact" className="mb-5">
                <h2 className="fw-bold mb-3">9. Contact Us</h2>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                </p>
                <address className="mb-4">
                  <strong>JobFinder Privacy Team</strong><br />
                  123 Business Avenue<br />
                  Tel Aviv, Israel<br />
                  Email: privacy@jobfinder.com<br />
                  Phone: +972 1234 5678
                </address>
                <p>
                  We will respond to your request within a reasonable timeframe.
                </p>
              </section>

              <div className="border-top pt-4">
                <p className="mb-0">
                  By using our website and services, you acknowledge that you have read and understand this Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;