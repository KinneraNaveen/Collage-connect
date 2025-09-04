import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaUsers, 
  FaChartLine, 
  FaShieldAlt,
  FaLightbulb,
  FaRocket,
  FaHeart,
  FaAward
} from 'react-icons/fa';
import './About.css';

const About = () => {
  const features = [
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
      icon: <FaLightbulb />,
      title: "Smart Solutions",
      description: "AI-powered issue classification and intelligent routing for faster resolution."
    }
  ];

  const team = [
    {
      name: "Naveen",
      role: "Project Lead & Full-Stack Developer",
      description: "Leading the development and implementation of College Connect platform."
    },
    {
      name: "Venkatesh",
      role: "Backend Developer",
      description: "Building robust and scalable server infrastructure and APIs."
    },
    {
      name: "Shiva",
      role: "Frontend Developer",
      description: "Creating intuitive user interfaces and seamless user experiences."
    }
  ];

  const stats = [
    { number: "500+", label: "Active Users" },
    { number: "1000+", label: "Issues Resolved" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">
                About <span className="highlight">College Connect</span>
              </h1>
              <p className="hero-description">
                College Connect is a comprehensive issue management platform designed to bridge the gap 
                between students, faculty, and administration. Our mission is to streamline communication, 
                improve response times, and enhance the overall campus experience.
              </p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <FaRocket />
                  Get Started
                </Link>
                <Link to="/contact" className="btn btn-secondary btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-visual">
                <FaGraduationCap className="hero-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2>Our Mission</h2>
              <p className="mission-text">
                To revolutionize how educational institutions handle communication and issue management 
                by providing a modern, efficient, and user-friendly platform that empowers all stakeholders 
                to collaborate effectively and resolve problems quickly.
              </p>
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
            <h2>What Makes Us Different</h2>
            <p>Discover the unique features that set College Connect apart from traditional solutions</p>
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

      {/* Team Section */}
      <section className="team">
        <div className="container">
          <div className="section-header">
            <h2>Our Team</h2>
            <p>Meet the dedicated professionals behind College Connect</p>
          </div>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <FaUsers />
                </div>
                <h4>{member.name}</h4>
                <p className="team-role">{member.role}</p>
                <p className="team-description">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2>Our Values</h2>
              <div className="values-grid">
                <div className="value-item">
                  <FaHeart className="value-icon" />
                  <h4>Student-Centric</h4>
                  <p>Everything we do is designed with students' needs in mind.</p>
                </div>
                <div className="value-item">
                  <FaAward className="value-icon" />
                  <h4>Excellence</h4>
                  <p>We strive for excellence in every aspect of our platform.</p>
                </div>
                <div className="value-item">
                  <FaShieldAlt className="value-icon" />
                  <h4>Security</h4>
                  <p>Protecting user data and privacy is our top priority.</p>
                </div>
              </div>
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
              <Link to="/register" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
