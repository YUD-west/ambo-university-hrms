import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import ConnectionStatus from './ConnectionStatus';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

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
            <h2>{t('nav.brandTitle', 'Ambo University')}</h2>
            <p className="sidebar-subtitle">{t('nav.brandSubtitle', 'HR & Employee Portal')}</p>
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
            <span className="nav-label">{t('nav.home', 'Portal Home')}</span>
          </Link>
          <Link to="/form" className="nav-item">
            <span className="nav-icon">📋</span>
            <span className="nav-label">{t('nav.lifeHistoryForm', 'Life History Form')}</span>
          </Link>
          <Link to="/social-security" className="nav-item">
            <span className="nav-icon">🛡️</span>
            <span className="nav-label">{t('nav.socialSecurityForm', 'Social Security')}</span>
          </Link>
          
          {/* Admin link strictly restricted to users with 'admin' role */}
          {user?.role === 'admin' && (
            <Link to="/admin" className="nav-item">
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">{t('nav.admin', 'Admin Review Panel')}</span>
            </Link>
          )}
        </nav>

        {/* User Profile & Role Info in Sidebar */}
        <div className="sidebar-user-footer">
          <div className="sidebar-user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{user?.name || 'Staff Member'}</span>
            <span className="sidebar-user-badge">
              {user?.role === 'admin' ? t('nav.userRoleAdmin', 'Admin') : t('nav.userRoleHr', 'HR Officer')}
            </span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h1>{t('dashboard.title', 'Ambo University HR System')}</h1>
          <div className="header-actions">
            <LanguageSwitcher />
            <ThemeToggle />
            <ConnectionStatus />
            <div className="user-badge-container">
              <span className="user-info">
                👤 {user?.name || 'Authorized Staff'}
              </span>
              <button
                type="button"
                onClick={logout}
                className="header-logout-btn"
                title={t('nav.logout', 'Log Out')}
              >
                🚪 {t('nav.logout', 'Log Out')}
              </button>
            </div>
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
