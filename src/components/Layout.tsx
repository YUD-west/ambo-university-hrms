import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConnectionStatus from './ConnectionStatus';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/hr/dashboard', label: t('nav.dashboard', 'Dashboard'), icon: '📊' },
    { path: '/hr/employees', label: t('nav.employees', 'Employees'), icon: '👥' },
    { path: '/hr/departments', label: t('nav.departments', 'Departments'), icon: '🏢' },
    { path: '/hr/attendance', label: t('nav.attendance', 'Attendance'), icon: '⏰' },
    { path: '/hr/leaves', label: t('nav.leaveManagement', 'Leave Requests'), icon: '📅' },
    { path: '/hr/performance', label: t('nav.performance', 'Performance'), icon: '⭐' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>Ambo University</h2>
            <p className="sidebar-subtitle">HR & Employee Portal</p>
          </Link>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">HR MODULES</div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}

          <div className="nav-section-title" style={{ marginTop: '1.25rem' }}>PORTAL SHORTCUTS</div>
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Portal Home</span>
          </Link>
          <Link to="/form" className="nav-item">
            <span className="nav-icon">📋</span>
            <span className="nav-label">Life History Form</span>
          </Link>
          <Link to="/social-security" className="nav-item">
            <span className="nav-icon">🛡️</span>
            <span className="nav-label">Social Security</span>
          </Link>
          <Link to="/admin" className="nav-item">
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Admin Review</span>
          </Link>
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <h1>Ambo University HR System</h1>
          <div className="header-actions">
            <LanguageSwitcher />
            <ThemeToggle />
            <ConnectionStatus />
            <span className="user-info">👤 Admin User</span>
          </div>
        </header>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
