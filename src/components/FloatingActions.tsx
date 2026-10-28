import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ChatBot from './ChatBot';
import './FloatingActions.css';

const FloatingActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const notifications = [
    { id: 1, message: t('floating.newEmployee', 'New employee onboarded to Engineering'), time: '10m ago', read: false },
    { id: 2, message: t('floating.leaveRequested', 'Leave request submitted by John Doe'), time: '30m ago', read: false },
    { id: 3, message: t('floating.performanceOpen', 'Q4 Performance Review period opened'), time: '2h ago', read: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickActions = [
    {
      id: 'dashboard',
      icon: '📊',
      label: t('nav.dashboard', 'HR Dashboard'),
      action: () => navigate('/hr/dashboard'),
    },
    {
      id: 'employees',
      icon: '👥',
      label: t('nav.employees', 'Employees'),
      action: () => navigate('/hr/employees'),
    },
    {
      id: 'departments',
      icon: '🏢',
      label: t('nav.departments', 'Departments'),
      action: () => navigate('/hr/departments'),
    },
    {
      id: 'leaves',
      icon: '📅',
      label: t('nav.leaveManagement', 'Leave Requests'),
      action: () => navigate('/hr/leaves'),
    },
    {
      id: 'attendance',
      icon: '⏰',
      label: t('nav.attendance', 'Attendance'),
      action: () => navigate('/hr/attendance'),
    },
    {
      id: 'lifeHistory',
      icon: '📋',
      label: t('forms.lifeHistory', 'Life History Form'),
      action: () => navigate('/form'),
    },
    {
      id: 'socialSecurity',
      icon: '🛡️',
      label: t('forms.socialSecurity', 'Social Security Form'),
      action: () => navigate('/social-security'),
    },
    {
      id: 'admin',
      icon: '⚙️',
      label: t('nav.admin', 'Admin Panel'),
      action: () => navigate('/admin'),
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Main Floating Action Button */}
      <div className={`floating-actions ${isMenuOpen ? 'open' : ''}`}>
        {/* Quick Action Buttons */}
        {isMenuOpen && (
          <div className="floating-actions-menu">
            {quickActions.map((action, index) => (
              <button
                key={action.id}
                className="floating-action-item"
                onClick={() => {
                  action.action();
                  setIsMenuOpen(false);
                }}
                style={{ animationDelay: `${index * 0.04}s` }}
                title={action.label}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Notifications Button */}
        <button
          className="floating-action-btn notifications-btn"
          onClick={() => {
            setShowNotifications(!showNotifications);
            setIsMenuOpen(false);
          }}
          title="Notifications"
        >
          <span>🔔</span>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        {/* Search / Nav Button */}
        <button
          className="floating-action-btn search-btn"
          onClick={() => {
            if (location.pathname.startsWith('/hr')) {
              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            } else {
              navigate('/hr/employees');
            }
          }}
          title="Search"
        >
          <span>🔍</span>
        </button>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            className="floating-action-btn scroll-top-btn visible"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Scroll to Top"
          >
            <span>⬆️</span>
          </button>
        )}

        {/* Main Toggle Button */}
        <button
          className="floating-action-btn main-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle HR quick menu"
        >
          <span className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>HR Notifications</h3>
            <button
              className="close-notifications"
              onClick={() => setShowNotifications(false)}
            >
              ✕
            </button>
          </div>
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.read ? 'read' : ''}`}
                >
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ChatBot - Always visible */}
      <ChatBot />
    </>
  );
};

export default FloatingActions;
