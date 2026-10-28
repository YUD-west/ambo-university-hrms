import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import BilingualText from '../BilingualText';
import ThemeToggle from '../ThemeToggle';
import LanguageSwitcher from '../LanguageSwitcher';
import './LibraryLayout.css';

export default function LibraryLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="library-layout">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="sidebar-backdrop" onClick={closeMenu} />
      )}

      {/* Sidebar Navigation */}
      <nav className={`library-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-header">
          <div className="nav-title-group">
            <span className="nav-logo-icon">📚</span>
            <h2><BilingualText translationKey="library.title" /></h2>
          </div>
          <button
            className="mobile-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="nav-menu">
          <li>
            <NavLink to="/library" end onClick={closeMenu}>
              <span className="nav-icon">📊</span>
              <span className="nav-text"><BilingualText translationKey="library.dashboard" /></span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/library/books" onClick={closeMenu}>
              <span className="nav-icon">📚</span>
              <span className="nav-text"><BilingualText translationKey="library.books" /></span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/library/members" onClick={closeMenu}>
              <span className="nav-icon">👥</span>
              <span className="nav-text"><BilingualText translationKey="library.members" /></span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/library/borrowings" onClick={closeMenu}>
              <span className="nav-icon">📖</span>
              <span className="nav-text"><BilingualText translationKey="library.borrowings" /></span>
            </NavLink>
          </li>
        </ul>

        <div className="nav-footer">
          <div className="nav-footer-controls">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <div className="nav-extra-links">
            <Link to="/home" className="subtle-link" onClick={closeMenu}>
              🏛️ Other Modules
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="library-main-container">
        {/* Top bar for mobile / quick controls */}
        <header className="library-top-bar">
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <div className="top-bar-branding">
            <span className="top-logo">📚</span>
            <span className="top-title">Library Management</span>
          </div>
          <div className="top-bar-actions">
            <div className="desktop-lang-switcher">
              <LanguageSwitcher />
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="library-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
