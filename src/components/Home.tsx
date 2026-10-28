import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h2>Federal Government Employees</h2>
            <p>Federal Government Employees Portal</p>
          </div>
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
            <Link to="/hr" onClick={() => setIsMenuOpen(false)}>HR Portal</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)}>Admin</Link>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </div>
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient-text">Life History Form</span>
            </h1>
            <h2 className="hero-subtitle">Life History & Employee Information System</h2>
            <p className="hero-description">
              Complete your employee life history form with ease. A comprehensive digital solution 
              for federal government employees to manage their personal and professional information.
            </p>
            <div className="hero-buttons">
              <Link to="/form" className="btn btn-primary">
                Life History Form
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/social-security" className="btn btn-primary">
                Social Security Form
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/hr" className="btn btn-primary">
                HR Management
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="#about" className="btn btn-secondary">
                Learn More
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">
              <div className="card-icon">📋</div>
              <p>Personal Info</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">👨‍👩‍👧‍👦</div>
              <p>Family Details</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🎓</div>
              <p>Education</p>
            </div>
            <div className="floating-card card-4">
              <div className="card-icon">💼</div>
              <p>Work Experience</p>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p>Scroll Down</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Form?</h2>
            <p className="section-subtitle">A comprehensive solution for employee documentation</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Easy to Use</h3>
              <p>Intuitive interface designed for simplicity and efficiency. Complete your form in minutes.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your information is protected with industry-standard security measures.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Access and complete your form from any device - desktop, tablet, or mobile.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Processing</h3>
              <p>Submit your form instantly and receive confirmation immediately.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>Auto-Save</h3>
              <p>Your progress is automatically saved, so you never lose your work.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Validation</h3>
              <p>Real-time validation ensures all required fields are completed correctly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Form Sections</h2>
            <p className="section-subtitle">Comprehensive information collection</p>
          </div>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-number">01</div>
              <h3>Personal Information</h3>
              <p>Complete personal details including name, birth information, and contact details.</p>
            </div>
            <div className="service-item">
              <div className="service-number">02</div>
              <h3>Family Information</h3>
              <p>Document your family structure, marital status, and children's information.</p>
            </div>
            <div className="service-item">
              <div className="service-number">03</div>
              <h3>Emergency Contacts</h3>
              <p>Provide emergency contact information for quick access when needed.</p>
            </div>
            <div className="service-item">
              <div className="service-number">04</div>
              <h3>Education History</h3>
              <p>Record your complete educational background and qualifications.</p>
            </div>
            <div className="service-item">
              <div className="service-number">05</div>
              <h3>Work Experience</h3>
              <p>Document your professional work history and career progression.</p>
            </div>
            <div className="service-item">
              <div className="service-number">06</div>
              <h3>Skills & Languages</h3>
              <p>Showcase your special skills and language proficiencies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" data-target="10000">10,000+</div>
              <div className="stat-label">Forms Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="5000">5,000+</div>
              <div className="stat-label">Active Employees</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="99">99%</div>
              <div className="stat-label">Satisfaction Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="24">24/7</div>
              <div className="stat-label">Portal Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-subtitle">We're here to help you with any questions</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p>ወሊሶ ቢዝነስና ኢኮኖሚክስ ካምፓስ<br />Woliso Business and Economics Campus</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>info@government.gov.et</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+251 11 123 4567</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                </div>
                <input type="text" placeholder="Subject" required />
                <textarea placeholder="Your Message" rows={5} required></textarea>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Federal Government Employees</h3>
              <p>Federal Government Employees Portal & HRMS</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><Link to="/hr">HR Dashboard</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/form">Life History Form</Link></li>
                <li><Link to="/social-security">Social Security Form</Link></li>
                <li><Link to="/hr">HR Management Portal</Link></li>
                <li><Link to="/admin">Admin Panel</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="LinkedIn">💼</a>
                <a href="#" aria-label="Instagram">📷</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Federal Government Employees Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
