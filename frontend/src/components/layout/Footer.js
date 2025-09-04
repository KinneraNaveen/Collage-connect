import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5 className="text-gradient mb-3">
              <i className="bi bi-building me-2"></i>
              College Connect
            </h5>
            <p className="text-muted mb-0">
              A comprehensive issue management system for college students and administrators.
              Streamline communication and resolve issues efficiently.
            </p>
          </div>
          <div className="col-md-3">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Home</a></li>
              <li><a href="/login" className="text-muted text-decoration-none">Login</a></li>
              <li><a href="/register" className="text-muted text-decoration-none">Register</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6 className="mb-3">Contact</h6>
            <ul className="list-unstyled">
              <li className="text-muted">
                <i className="bi bi-envelope me-2"></i>
                support@collegeconnect.com
              </li>
              <li className="text-muted">
                <i className="bi bi-phone me-2"></i>
                7207663686
              </li>
              <li className="text-muted">
                <i className="bi bi-linkedin me-2"></i>
                <a 
                  href="https://www.linkedin.com/in/kinnera-naveen-1786ab2b6/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted text-decoration-none"
                >
                  Kinnera Naveen
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-muted mb-0">
              © {currentYear} College Connect. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="social-links">
              <button className="btn btn-link text-muted me-3 p-0" title="Facebook">
                <i className="bi bi-facebook"></i>
              </button>
              <button className="btn btn-link text-muted me-3 p-0" title="Twitter">
                <i className="bi bi-twitter"></i>
              </button>
              <a 
                href="https://www.linkedin.com/in/kinnera-naveen-1786ab2b6/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-link text-muted me-3 p-0" 
                title="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <button className="btn btn-link text-muted p-0" title="GitHub">
                <i className="bi bi-github"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
