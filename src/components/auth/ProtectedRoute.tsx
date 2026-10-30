import { type ReactNode } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../services/authService';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-spinner"></div>
        <p>{t('common.loading', 'Verifying security credentials...')}</p>
      </div>
    );
  }

  // If not logged in, redirect to login page with return URL
  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If role is restricted and user does not have required role
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return (
      <div className="access-denied-container">
        <div className="access-denied-card">
          <div className="denied-icon">🚫</div>
          <h2>{t('auth.accessDenied', 'Access Denied')}</h2>
          <p>
            {t(
              'auth.restrictedNotice',
              'You do not possess the required permissions to access this administrative portal.'
            )}
          </p>
          <div className="denied-user-info">
            <span>
              <strong>Logged in as:</strong> {user.name} ({user.role.toUpperCase()})
            </span>
          </div>
          <div className="denied-actions">
            {user.role === 'hr' ? (
              <Link to="/hr/dashboard" className="btn-primary">
                Return to HR Dashboard
              </Link>
            ) : (
              <Link to="/" className="btn-primary">
                Return to Portal Home
              </Link>
            )}
            <Link to="/login" className="btn-secondary">
              Switch Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
}
