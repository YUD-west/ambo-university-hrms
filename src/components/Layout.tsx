import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConnectionStatus from './ConnectionStatus';
import LanguageSwitcher from './LanguageSwitcher';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/hr/dashboard', label: t('nav.dashboard'), icon: '📊' },
    { path: '/hr/employees', label: t('nav.employees'), icon: '👥' },
    { path: '/hr/departments', label: t('nav.departments'), icon: '🏢' },
    { path: '/hr/attendance', label: t('nav.attendance'), icon: '⏰' },
    { path: '/hr/leaves', label: t('nav.leaveManagement'), icon: '📅' },
    { path: '/hr/performance', label: t('nav.performance'), icon: '⭐' },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Ambo University</h2>
          <p className="sidebar-subtitle">HR & Employee Management</p>
        </div>
        <nav className="sidebar-nav">
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
        </nav>
      </aside>
      <main className="main-content">
        <header className="top-header">
          <h1>Ambo University HR System</h1>
          <div className="header-actions">
            <LanguageSwitcher />
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

