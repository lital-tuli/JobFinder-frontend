import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card shadow-sm border-0">
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
                  </div>
                  
                  <h2 className="fw-bold mb-3">Oops! Something went wrong</h2>
                  <p className="text-muted mb-4">
                    We're sorry for the inconvenience. An unexpected error has occurred.
                  </p>
                  
                  <div className="d-flex justify-content-center gap-3">
                    <button 
                      className="btn btn-primary px-4"
                      onClick={this.handleReset}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Try Again
                    </button>
                    <Link to="/" className="btn btn-outline-secondary px-4">
                      <i className="bi bi-house me-2"></i>
                      Go Home
                    </Link>
                  </div>
                  
                  {/* Show error details in development mode */}
                  {import.meta.env.MODE === 'development' && this.state.error && (
                    <div className="mt-4">
                      <details className="text-start">
                        <summary className="btn btn-outline-danger btn-sm">
                          Show Error Details (Development Only)
                        </summary>
                        <div className="mt-3 p-3 bg-light rounded">
                          <strong>Error:</strong>
                          <pre className="text-danger small">
                            {this.state.error.toString()}
                          </pre>
                          {this.state.errorInfo && (
                            <>
                              <strong>Component Stack:</strong>
                              <pre className="text-muted small">
                                {this.state.errorInfo.componentStack}
                              </pre>
                            </>
                          )}
                        </div>
                      </details>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <p className="small text-muted">
                      If this problem persists, please{' '}
                      <Link to="/contact" className="text-decoration-none">
                        contact our support team
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;