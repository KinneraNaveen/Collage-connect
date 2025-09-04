import React, { useState } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaPaperPlane,
  FaCheckCircle,
  FaLinkedin
} from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: "Email",
      details: "support@collegeconnect.com",
      description: "Send us an email anytime"
    },
    {
      icon: <FaPhone />,
      title: "Phone",
      details: "7207663686",
      description: "Contact us anytime"
    },
    {
      icon: <FaLinkedin />,
      title: "LinkedIn",
      details: "Kinnera Naveen",
      description: "Connect with us on LinkedIn",
      link: "https://www.linkedin.com/in/kinnera-naveen-1786ab2b6/"
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Office",
      details: "123 Campus Drive",
      description: "University District, City"
    },
    {
      icon: <FaClock />,
      title: "Support Hours",
      details: "24/7 Available",
      description: "Online support anytime"
    }
  ];

  if (submitted) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card contact-success">
              <div className="card-body text-center">
                <FaCheckCircle className="success-icon" />
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="hero-title">Contact Us</h1>
              <p className="hero-description">
                Have questions or need support? We're here to help you get the most out of College Connect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="row">
            {/* Contact Information */}
            <div className="col-lg-5">
              <div className="contact-info">
                <h3>Get in Touch</h3>
                <p className="contact-intro">
                  We're here to help and answer any questions you might have. 
                  We look forward to hearing from you.
                </p>
                
                <div className="contact-details">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="contact-item">
                      <div className="contact-icon">
                        {info.icon}
                      </div>
                      <div className="contact-text">
                        <h5>{info.title}</h5>
                        {info.link ? (
                          <a 
                            href={info.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="contact-detail contact-link"
                          >
                            {info.details}
                          </a>
                        ) : (
                          <p className="contact-detail">{info.details}</p>
                        )}
                        <p className="contact-description">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="contact-form-card">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <FaPaperPlane className="me-2" />
                      Send us a Message
                    </h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
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
                          placeholder="What is this about?"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="message" className="form-label">Message</label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell us more about your inquiry..."
                          required
                        ></textarea>
                      </div>

                      <div className="d-grid">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <FaPaperPlane className="me-2" />
                              Send Message
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
