import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const faqCategories = {
    general: {
      title: 'General Questions',
      icon: 'bi-question-circle',
      faqs: [
        {
          question: 'What is JobFinder?',
          answer: 'JobFinder is a comprehensive job portal platform that connects talented job seekers with top employers. We offer a seamless experience for both job seekers looking for opportunities and recruiters searching for the right talent.'
        },
        {
          question: 'Is JobFinder free to use?',
          answer: 'Yes, JobFinder is completely free for job seekers. You can create an account, browse jobs, apply to positions, and save jobs without any cost. For recruiters, we offer both free and premium plans with additional features.'
        },
        {
          question: 'How do I get started on JobFinder?',
          answer: 'Getting started is easy! Simply create an account by clicking the "Sign Up" button, choose whether you\'re a job seeker or recruiter, complete your profile, and start exploring opportunities or posting jobs.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Absolutely. We take data security seriously and use industry-standard encryption to protect your personal information. We never share your data with third parties without your explicit consent.'
        }
      ]
    },
    jobseekers: {
      title: 'For Job Seekers',
      icon: 'bi-person-check',
      faqs: [
        {
          question: 'How do I search for jobs?',
          answer: 'You can search for jobs using our search bar on the homepage or jobs page. Filter by location, job type, company, or use keywords related to your skills and interests. You can also browse by categories or companies.'
        },
        {
          question: 'How do I apply for a job?',
          answer: 'To apply for a job, click on the job listing to view details, then click the "Apply Now" button. You\'ll need to be logged in to apply. Your profile information will be sent to the employer along with your application.'
        },
        {
          question: 'Can I save jobs for later?',
          answer: 'Yes! You can save any job by clicking the bookmark icon on the job card or details page. Access your saved jobs anytime from your profile dashboard.'
        },
        {
          question: 'How do I track my applications?',
          answer: 'All your job applications are tracked in your profile under the "Applications" section. Here you can see the status of each application and any updates from employers.'
        },
        {
          question: 'Can I upload my resume?',
          answer: 'Yes, you can upload and manage your resume in your profile settings. This makes it easier to apply for jobs quickly and ensures employers have access to your latest information.'
        }
      ]
    },
    recruiters: {
      title: 'For Recruiters',
      icon: 'bi-building',
      faqs: [
        {
          question: 'How do I post a job?',
          answer: 'As a recruiter, you can post jobs by navigating to "Post a Job" in your dashboard. Fill out the job details including title, description, requirements, and qualifications, then publish your listing.'
        },
        {
          question: 'How do I manage applicants?',
          answer: 'All applications for your job postings can be viewed and managed from your recruiter dashboard. You can review candidate profiles, contact applicants, and update application statuses.'
        },
        {
          question: 'Can I edit or delete job postings?',
          answer: 'Yes, you can edit or delete your job postings at any time from your "My Listings" page. Simply click on the job you want to modify and select the appropriate action.'
        },
        {
          question: 'How are job seekers matched to my postings?',
          answer: 'Job seekers can find your postings through search, filters, and our recommendation system. We help match relevant candidates to your positions based on skills, location, and job preferences.'
        },
        {
          question: 'Is there a limit to how many jobs I can post?',
          answer: 'Free accounts can post up to 5 active job listings. Premium plans offer unlimited job postings along with additional features like priority listing and advanced analytics.'
        }
      ]
    },
    technical: {
      title: 'Technical Support',
      icon: 'bi-gear',
      faqs: [
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click on "Forgot Password" on the login page and enter your email address. We\'ll send you instructions to reset your password. If you don\'t receive the email, check your spam folder.'
        },
        {
          question: 'Why can\'t I log in to my account?',
          answer: 'If you\'re having trouble logging in, make sure you\'re using the correct email and password. If you still can\'t access your account, try resetting your password or contact our support team.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'To delete your account, go to your profile settings and scroll down to the "Account Management" section. Click on "Delete Account" and follow the confirmation steps. Note that this action is irreversible.'
        },
        {
          question: 'Why am I not receiving email notifications?',
          answer: 'Check your email preferences in your profile settings to ensure notifications are enabled. Also check your spam folder. If you\'re still not receiving emails, contact our support team.'
        },
        {
          question: 'The website is not working properly. What should I do?',
          answer: 'Try refreshing the page or clearing your browser cache. If the problem persists, try using a different browser or device. If you continue experiencing issues, please contact our technical support team.'
        }
      ]
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="fw-bold">Frequently Asked Questions</h1>
          <p className="lead text-muted">Find answers to common questions about JobFinder</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="nav nav-pills justify-content-center" role="tablist">
            {Object.entries(faqCategories).map(([key, category]) => (
              <button
                key={key}
                className={`nav-link mx-1 ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
                role="tab"
              >
                <i className={`${category.icon} me-2`}></i>
                {category.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search FAQ */}
      <div className="row mb-4">
        <div className="col-md-8 mx-auto">
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-light"
              placeholder="Search frequently asked questions..."
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className={`${faqCategories[activeTab].icon} me-2`}></i>
                {faqCategories[activeTab].title}
              </h4>
            </div>
            <div className="card-body p-0">
              <div className="accordion" id="faqAccordion">
                {faqCategories[activeTab].faqs.map((faq, index) => (
                  <div className="accordion-item border-0 border-bottom" key={index}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${openAccordion === index ? '' : 'collapsed'}`}
                        type="button"
                        onClick={() => toggleAccordion(index)}
                        aria-expanded={openAccordion === index}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      className={`accordion-collapse collapse ${openAccordion === index ? 'show' : ''}`}
                    >
                      <div className="accordion-body">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-5">
        <div className="col-lg-8 mx-auto">
          <div className="card bg-light border-0">
            <div className="card-body text-center">
              <h5 className="mb-3">Still have questions?</h5>
              <p className="text-muted mb-4">
                Can't find the answer you're looking for? Our customer support team is here to help.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/contact" className="btn btn-primary">
                  <i className="bi bi-envelope me-2"></i>Contact Support
                </Link>
                <a href="mailto:support@jobfinder.com" className="btn btn-outline-primary">
                  <i className="bi bi-envelope-at me-2"></i>Email Us
                </a>
                <a href="#" className="btn btn-outline-secondary">
                  <i className="bi bi-chat-dots me-2"></i>Live Chat
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="row mt-5">
        <div className="col-12">
          <h3 className="text-center fw-bold mb-4">Popular Help Topics</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <i className="bi bi-person-plus text-primary fs-1 mb-3"></i>
                  <h5>Getting Started</h5>
                  <p className="text-muted small">Learn how to create your account and get started on JobFinder.</p>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => setActiveTab('general')}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <i className="bi bi-briefcase text-success fs-1 mb-3"></i>
                  <h5>Job Applications</h5>
                  <p className="text-muted small">Everything you need to know about applying for jobs and tracking applications.</p>
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => setActiveTab('jobseekers')}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 border-0 bg-light">
                <div className="card-body text-center">
                  <i className="bi bi-building text-info fs-1 mb-3"></i>
                  <h5>Posting Jobs</h5>
                  <p className="text-muted small">Guide for recruiters on how to post and manage job listings effectively.</p>
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => setActiveTab('recruiters')}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;