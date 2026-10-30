import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="home-container">
      {/* Navigation - Public Facing (NO visible Admin or HR links) */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <h2>{t('nav.brandTitle', 'Ambo University')}</h2>
            <p>{t('nav.brandSubtitle', 'Federal Government Employees Portal & HRMS')}</p>
          </div>

          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => setIsMenuOpen(false)}>
              {t('nav.home', 'Home')}
            </a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>
              {t('nav.about', 'About')}
            </a>
            <a href="#services" onClick={() => setIsMenuOpen(false)}>
              {t('nav.services', 'Services')}
            </a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>
              {t('nav.contact', 'Contact')}
            </a>
            
            {/* Secure Staff Login Link instead of visible Admin/HR dashboard links */}
            <Link to="/login" className="nav-staff-login-btn" onClick={() => setIsMenuOpen(false)}>
              🔐 {t('nav.login', 'Staff Login')}
            </Link>

            <div className="nav-extra-actions">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
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
              <span className="gradient-text">{t('home.heroTitle', 'Federal Government Employees Portal')}</span>
            </h1>
            <h2 className="hero-subtitle">
              {t('home.heroSubtitle', 'Digital HR & Employee Information Management System')}
            </h2>
            <p className="hero-description">
              {t(
                'home.heroDescription',
                'A secure, modern, multilingual platform for Ambo University and Ethiopian Federal Government employees. Streamlining employee life history registration, pension documentation, attendance tracking, and leave administration.'
              )}
            </p>

            <div className="hero-buttons">
              <Link to="/form" className="btn btn-primary">
                {t('home.ctaLifeHistory', 'Fill Life History Form')}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link to="/social-security" className="btn btn-primary">
                {t('home.ctaSocialSecurity', 'Social Security Form')}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link to="/login" className="btn btn-secondary">
                {t('home.ctaStaffLogin', 'Access Staff Portal')}
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <div className="floating-card card-1">
              <div className="card-icon">📋</div>
              <p>{t('home.service1Title', 'Personal Identification')}</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">👨‍👩‍👧‍👦</div>
              <p>{t('home.service2Title', 'Family & Dependents')}</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🎓</div>
              <p>{t('home.service3Title', 'Academic Credentials')}</p>
            </div>
            <div className="floating-card card-4">
              <div className="card-icon">💼</div>
              <p>{t('home.service4Title', 'Civil Service History')}</p>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p>{t('home.scrollDown', 'Scroll Down')}</p>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="features" id="about">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('home.whyChoose', 'Why Choose Our Digital HRMS?')}</h2>
            <p className="section-subtitle">
              {t('home.whyChooseSubtitle', 'Engineered for compliance, efficiency, and federal employee service excellence.')}
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>{t('home.featureEasyTitle', 'Intuitive & Accessible')}</h3>
              <p>{t('home.featureEasyDesc', 'Clean interface designed for simplicity and efficiency.')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>{t('home.featureSecureTitle', 'Secure & Confidential')}</h3>
              <p>{t('home.featureSecureDesc', 'Your information is protected with industry-standard security measures.')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>{t('home.featureTrilingualTitle', 'Trilingual Support')}</h3>
              <p>{t('home.featureTrilingualDesc', 'Full fluency in English, Afaan Oromoo, and Amharic with instant switching.')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>{t('home.featureFastTitle', 'Real-Time Processing')}</h3>
              <p>{t('home.featureFastDesc', 'Submit forms instantly and receive immediate status updates.')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💾</div>
              <h3>{t('home.featureAutoSaveTitle', 'Offline-Resilient Persistence')}</h3>
              <p>{t('home.featureAutoSaveDesc', 'Your progress is automatically saved so you never lose work.')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>{t('home.featureValidationTitle', 'Intelligent Verification')}</h3>
              <p>{t('home.featureValidationDesc', 'Real-time validation ensures all required federal fields are completed correctly.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Form Sections */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('home.formSectionsTitle', 'Core Employee Services')}</h2>
            <p className="section-subtitle">
              {t('home.formSectionsSubtitle', 'Official federal documentation workflows streamlined into digital self-service.')}
            </p>
          </div>

          <div className="services-grid">
            <div className="service-item">
              <div className="service-number">01</div>
              <h3>{t('home.service1Title', 'Personal Identification')}</h3>
              <p>{t('home.service1Desc', 'Official Ethiopian civil service identification, birth details, and residence records.')}</p>
            </div>
            <div className="service-item">
              <div className="service-number">02</div>
              <h3>{t('home.service2Title', 'Family & Beneficiary Status')}</h3>
              <p>{t('home.service2Desc', 'Document marital status, dependents, and emergency contacts.')}</p>
            </div>
            <div className="service-item">
              <div className="service-number">03</div>
              <h3>{t('home.service3Title', 'Academic Credentials')}</h3>
              <p>{t('home.service3Desc', 'Complete educational credentials, degree qualifications, and institution history.')}</p>
            </div>
            <div className="service-item">
              <div className="service-number">04</div>
              <h3>{t('home.service4Title', 'Civil Service Employment')}</h3>
              <p>{t('home.service4Desc', 'Detailed employment history across government offices and ministries.')}</p>
            </div>
            <div className="service-item">
              <div className="service-number">05</div>
              <h3>{t('home.service5Title', 'Social Security & Pension')}</h3>
              <p>{t('home.service5Desc', 'Public Servants Social Security Agency pension registration and service computation.')}</p>
            </div>
            <div className="service-item">
              <div className="service-number">06</div>
              <h3>{t('home.service6Title', 'Languages & Competencies')}</h3>
              <p>{t('home.service6Desc', 'Multi-tier proficiency evaluation across reading, writing, and speaking.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">{t('home.statFormsCompleted', 'Forms Processed')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">{t('home.statActiveStaff', 'Active Civil Servants')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">{t('home.statSatisfaction', 'Satisfaction Rate')}</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">{t('home.statAvailability', 'Portal Uptime')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('home.contactTitle', 'Institutional Support & Contact')}</h2>
            <p className="section-subtitle">
              {t('home.contactSubtitle', 'Get in touch with the Ambo University Human Resources Directorate.')}
            </p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>{t('home.contactAddressTitle', 'Campus Location')}</h4>
                  <p>{t('home.contactAddressDesc', 'Ambo University, Woliso Business and Economics Campus, Ethiopia')}</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>{t('home.contactEmailTitle', 'Official Email')}</h4>
                  <p>hr@ambou.edu.et</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>{t('home.contactPhoneTitle', 'Direct Telephone')}</h4>
                  <p>+251 11 342 3128</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form onSubmit={handleContactSubmit}>
                {contactSubmitted ? (
                  <div className="contact-success-box" role="status">
                    ✅ {t('home.contactSuccessMsg', 'Thank you! Your message has been sent to Ambo University HR Directorate.')}
                  </div>
                ) : (
                  <>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder={t('home.contactNamePlaceholder', 'Full Name')}
                        required
                        aria-label="Your Name"
                      />
                      <input
                        type="email"
                        placeholder={t('home.contactEmailPlaceholder', 'Email Address')}
                        required
                        aria-label="Your Email"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder={t('home.contactSubjectPlaceholder', 'Subject / Department')}
                      required
                      aria-label="Subject"
                    />
                    <textarea
                      placeholder={t('home.contactMessagePlaceholder', 'How can our HR Directorate assist you?')}
                      rows={5}
                      required
                      aria-label="Message"
                    ></textarea>
                    <button type="submit" className="btn btn-primary">
                      {t('home.contactSubmitBtn', 'Transmit Message')}
                    </button>
                  </>
                )}
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
              <h3>{t('nav.brandTitle', 'Ambo University')}</h3>
              <p>{t('home.footerDescription', 'Official digital human resource and public servant documentation portal for Ambo University.')}</p>
            </div>

            <div className="footer-section">
              <h4>{t('home.footerQuickLinks', 'Quick Navigation')}</h4>
              <ul>
                <li><a href="#home">{t('nav.home', 'Home')}</a></li>
                <li><a href="#about">{t('nav.about', 'About')}</a></li>
                <li><a href="#services">{t('nav.services', 'Services')}</a></li>
                <li><a href="#contact">{t('nav.contact', 'Contact')}</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>{t('nav.forms', 'Digital Forms')}</h4>
              <ul>
                <li><Link to="/form">{t('nav.lifeHistoryForm', 'Life History Form')}</Link></li>
                <li><Link to="/social-security">{t('nav.socialSecurityForm', 'Social Security Form')}</Link></li>
                <li><Link to="/login">{t('nav.login', 'Staff Portal Login')}</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>{t('home.contactAddressTitle', 'Campus')}</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Ambo University<br />
                Woliso Business & Economics Campus<br />
                P.O. Box 217, Woliso, Ethiopia
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} {t('home.footerLegal', 'Ambo University HRMS. All rights reserved.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
