
const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'TechCorp',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
      rating: 5,
      text: 'JobFinder helped me land my dream job in just 2 weeks! The platform is intuitive and the job recommendations were spot-on.',
      location: 'San Francisco, CA'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'InnovateLab',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5,
      text: 'As a recruiter, JobFinder has been a game-changer. We found amazing candidates quickly and the application process is seamless.',
      location: 'New York, NY'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'DesignStudio',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5,
      text: 'The search filters and job matching algorithm are excellent. I found multiple opportunities that perfectly matched my skills.',
      location: 'Austin, TX'
    },
    {
      id: 4,
      name: 'David Park',
      role: 'Data Scientist',
      company: 'DataFlow Inc',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 4,
      text: 'JobFinder made my job search so much easier. The saved jobs feature and application tracking helped me stay organized.',
      location: 'Seattle, WA'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'Marketing Director',
      company: 'GrowthCo',
      image: 'https://randomuser.me/api/portraits/women/55.jpg',
      rating: 5,
      text: 'The quality of job postings on JobFinder is outstanding. I connected with amazing companies and found my perfect role.',
      location: 'Chicago, IL'
    },
    {
      id: 6,
      name: 'James Wilson',
      role: 'Full Stack Developer',
      company: 'StartupXYZ',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      rating: 4,
      text: 'Great platform for both job seekers and employers. The interface is clean and the job alerts feature is very helpful.',
      location: 'Boston, MA'
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
      ></i>
    ));
  };

  return (
    <section className="py-5">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill mb-3">
                ⭐ What Our Users Say
              </span>
              <h2 className="display-5 fw-bold mb-3">Success Stories</h2>
              <p className="lead text-muted">
                Join thousands of professionals who have found their dream jobs through JobFinder
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="row g-4 mb-5">
          {testimonials.map((testimonial) => (
            <div className="col-lg-4 col-md-6" key={testimonial.id}>
              <div className="testimonial-card h-100 p-4 bg-white rounded-3 shadow-sm border-0 position-relative">
                {/* Quote Icon */}
                <div className="quote-icon position-absolute top-0 end-0 mt-3 me-3">
                  <i className="bi bi-quote text-primary fs-2 opacity-25"></i>
                </div>
                {/* Rating */}
                <div className="mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <blockquote className="mb-4">
                  <p className="text-muted mb-0 fst-italic">
                    "{testimonial.text}"
                  </p>
                </blockquote>

                {/* User Info */}
                <div className="d-flex align-items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="rounded-circle me-3"
                    width="50"
                    height="50"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
                    <p className="small text-muted mb-0">
                      {testimonial.role} at {testimonial.company}
                    </p>
                    <p className="small text-muted mb-0">
                      <i className="bi bi-geo-alt me-1"></i>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="bg-light rounded-3 p-5">
              <div className="row text-center">
                <div className="col-md-3 col-6 mb-3 mb-md-0">
                  <div className="stat-item">
                    <h3 className="fw-bold text-success mb-1">4.8/5</h3>
                    <p className="text-muted mb-0 small">Average Rating</p>
                    <div className="mt-1">
                      {renderStars(5)}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3 mb-md-0">
                  <div className="stat-item">
                    <h3 className="fw-bold text-primary mb-1">95%</h3>
                    <p className="text-muted mb-0 small">Success Rate</p>
                    <small className="text-muted">Find jobs within 30 days</small>
                  </div>
                </div>
                <div className="col-md-3 col-6 mb-3 mb-md-0">
                  <div className="stat-item">
                    <h3 className="fw-bold text-info mb-1">1M+</h3>
                    <p className="text-muted mb-0 small">Happy Users</p>
                    <small className="text-muted">Across the globe</small>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="stat-item">
                    <h3 className="fw-bold text-warning mb-1">500+</h3>
                    <p className="text-muted mb-0 small">Top Companies</p>
                    <small className="text-muted">Actively hiring</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-5">
          <div className="row">
            <div className="col-lg-6 mx-auto">
              <h4 className="fw-bold mb-3">Ready to Write Your Success Story?</h4>
              <p className="text-muted mb-4">
                Join our community of successful professionals and find your perfect job today.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="/register" className="btn btn-primary btn-lg px-4">
                  Get Started Free
                </a>
                <a href="/jobs" className="btn btn-outline-primary btn-lg px-4">
                  Browse Jobs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .testimonial-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .testimonial-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
        }

        .quote-icon {
          z-index: 1;
        }

        .stat-item {
          transition: transform 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-5px);
        }

        blockquote p {
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .testimonial-card {
            margin-bottom: 1.5rem;
          }
          
          .quote-icon {
            display: none;
          }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;