import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ChatBot from './ChatBot';
import './FloatingActions.css';

const FloatingActions = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [notifications] = useState([
    { id: 1, message: t('floating.newBook', { lng: i18n.language }), time: '2m ago', read: false },
    { id: 2, message: t('floating.bookReturned', { lng: i18n.language }), time: '5m ago', read: false },
    { id: 3, message: t('floating.memberAdded', { lng: i18n.language }), time: '1h ago', read: true },
  ]);

  const isLibraryPage = location.pathname.startsWith('/library');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const quickActions = [
    {
      id: 'books',
      icon: '📚',
      label: t('floating.quickBooks', { lng: i18n.language }),
      action: () => navigate('/library/books'),
      visible: isLibraryPage,
    },
    {
      id: 'members',
      icon: '👥',
      label: t('floating.quickMembers', { lng: i18n.language }),
      action: () => navigate('/library/members'),
      visible: isLibraryPage,
    },
    {
      id: 'borrow',
      icon: '📖',
      label: t('floating.quickBorrow', { lng: i18n.language }),
      action: () => navigate('/library/borrowings'),
      visible: isLibraryPage,
    },
    {
      id: 'dashboard',
      icon: '📊',
      label: t('floating.quickDashboard', { lng: i18n.language }),
      action: () => navigate('/library'),
      visible: isLibraryPage,
    },
    {
      id: 'addBook',
      icon: '➕',
      label: t('floating.addBook', { lng: i18n.language }),
      action: () => {
        navigate('/library/books');
        // Trigger add book modal (would need to pass event or use context)
        setTimeout(() => {
          const addButton = document.querySelector('.book-header .btn-primary') as HTMLElement;
          if (addButton) addButton.click();
        }, 500);
      },
      visible: isLibraryPage,
    },
    {
      id: 'addMember',
      icon: '👤',
      label: t('floating.addMember', { lng: i18n.language }),
      action: () => {
        navigate('/library/members');
        setTimeout(() => {
          const addButton = document.querySelector('.member-header .btn-primary') as HTMLElement;
          if (addButton) addButton.click();
        }, 500);
      },
      visible: isLibraryPage,
    },
  ].filter(action => action.visible);

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
                style={{ animationDelay: `${index * 0.05}s` }}
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
          title={t('floating.notifications', { lng: i18n.language })}
        >
          <span>🔔</span>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </button>

        {/* Search Button */}
        <button
          className="floating-action-btn search-btn"
          onClick={() => {
            if (isLibraryPage) {
              const searchInput = document.querySelector('.search-bar input') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }}
          title={t('floating.search', { lng: i18n.language })}
        >
          <span>🔍</span>
        </button>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            className="floating-action-btn scroll-top-btn visible"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title={t('floating.scrollTop', { lng: i18n.language })}
          >
            <span>⬆️</span>
          </button>
        )}

        {/* Main Toggle Button */}
        <button
          className="floating-action-btn main-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
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
            <h3>{t('floating.notifications', { lng: i18n.language })}</h3>
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
                {t('floating.noNotifications', { lng: i18n.language })}
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

