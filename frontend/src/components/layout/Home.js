import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaGraduationCap, 
  FaUsers, 
  FaComments, 
  FaChartLine, 
  FaRocket,
  FaCheckCircle,
  FaLightbulb,
  FaShieldAlt,
  FaMobileAlt,
  FaClock,
  FaStar
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "NAVEEN",
      role: "Student",
      quote: "College Connect has made it so easy to submit and track my issues. The platform is intuitive and responsive!"
    },
    {
      name: "ADHITYA", 
      role: "Student",
      quote: "The AI-powered classification helps me get faster responses. This is exactly what we needed for campus communication."
    },
    {
      name: "RAVI",
      role: "Student", 
      quote: "I love how I can see the status of my requests in real-time. The mobile experience is fantastic!"
    },
    {
      name: "GANESH",
      role: "Student",
      quote: "This platform has revolutionized how we communicate with administration. Highly recommended for all students!"
    }
  ];

  // Auto-rotate testimonials every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const features = [
    {
      icon: <FaComments />,
      title: "Smart Issue Management",
      description: "AI-powered issue classification and priority prediction for efficient problem resolution."
    },
    {
      icon: <FaUsers />,
      title: "Collaborative Platform",
      description: "Connect students, faculty, and administrators in a unified communication system."
    },
    {
      icon: <FaChartLine />,
      title: "Analytics & Insights",
      description: "Real-time analytics and trend analysis to improve institutional decision-making."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Private",
      description: "Enterprise-grade security with role-based access control and data protection."
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile Responsive",
      description: "Access from any device with our responsive design optimized for all screen sizes."
    },
    {
      icon: <FaClock />,
      title: "24/7 Availability",
      description: "Round-the-clock access to submit and track issues anytime, anywhere."
    }
  ];

  const benefits = [
    "Reduce response time by 60%",
    "Improve student satisfaction",
    "Streamline administrative processes",
    "Data-driven decision making",
    "Enhanced communication flow",
    "Cost-effective solution"
  ];

  const stats = [
    { number: "500+", label: "Active Users" },
    { number: "1000+", label: "Issues Resolved" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Welcome to <span className="highlight">College Connect</span>
              </h1>
              <p className="hero-description">
                The modern platform that bridges the gap between students, faculty, and administration. 
                Experience seamless communication, smart issue management, and data-driven insights.
              </p>
              <div className="hero-actions">
                {user ? (
                  <Link to="/dashboard" className="btn btn-primary btn-lg">
                    <FaRocket />
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-lg">
                      <FaRocket />
                      Get Started
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-lg">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-card">
                <FaGraduationCap className="hero-icon" />
                <h3>Smart Campus Management</h3>
                <p>AI-powered solutions for modern education</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose College Connect?</h2>
            <p>Discover the features that make us the preferred choice for educational institutions</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Transform Your Campus Experience</h2>
              <p>
                College Connect revolutionizes how educational institutions handle communication, 
                issue management, and administrative processes. Our platform is designed to 
                enhance efficiency and improve satisfaction across all stakeholders.
              </p>
              <ul className="benefits-list">
                {benefits.map((benefit, index) => (
                  <li key={index}>
                    <FaCheckCircle className="check-icon" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="benefits-actions">
                <Link to="/register" className="btn btn-primary">
                  Start Free Trial
                </Link>
                <Link to="/about" className="btn btn-secondary">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="benefits-card">
                <FaLightbulb className="benefits-icon" />
                <h3>Innovation at Every Step</h3>
                <p>Cutting-edge technology meets educational excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Hear from students who have transformed their campus experience</p>
          </div>
          <div className="testimonials-rotating">
            <div className="testimonial-card rotating">
              <div className="testimonial-content">
                <p>"{testimonials[currentTestimonial].quote}"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>{testimonials[currentTestimonial].name}</h4>
                  <span>{testimonials[currentTestimonial].role}</span>
                </div>
                <div className="rating">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
            </div>
            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Campus?</h2>
            <p>Join thousands of institutions already using College Connect to improve their campus experience.</p>
            <div className="cta-actions">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Access Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg">
                    Get Started Free
                  </Link>
                  <Link to="/contact" className="btn btn-secondary btn-lg">
                    Contact Sales
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
