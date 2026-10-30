import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';
import './Login.css';

export default function Login() {
  const { t } = useTranslation();
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse redirect query parameter
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');

  // If already authenticated, redirect
  if (isAuthenticated && user) {
    if (redirectUrl) {
      navigate(redirectUrl, { replace: true });
    } else if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/hr/dashboard', { replace: true });
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        if (redirectUrl) {
          navigate(redirectUrl, { replace: true });
        } else if (res.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/hr/dashboard', { replace: true });
        }
      } else {
        setErrorMsg(res.message || t('auth.invalidCredentials', 'Invalid email or password.'));
      }
    } catch {
      setErrorMsg(t('auth.invalidCredentials', 'Authentication failed. Please check credentials.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <header className="login-top-bar">
        <Link to="/" className="login-back-link">
          ← {t('nav.home', 'Home Portal')}
        </Link>
        <div className="login-top-actions">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-emblem">🏛️</div>
            <h1>{t('nav.brandTitle', 'Ambo University')}</h1>
            <h2>{t('auth.loginTitle', 'Authorized Personnel Authentication')}</h2>
            <p className="login-subtitle">
              {t('auth.loginSubtitle', 'Secure portal for System Administrators and HR Officers')}
            </p>
          </div>

          {errorMsg && (
            <div className="login-error-alert" role="alert">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="login-email">{t('auth.emailLabel', 'Institutional Email')}</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder', 'name@ambou.edu.et')}
                required
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">{t('auth.passwordLabel', 'Password')}</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                disabled={isSubmitting}
              />
            </div>

            <button type="submit" className="login-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? t('auth.signingIn', 'Verifying...') : t('auth.signInBtn', 'Sign In to Portal')}
            </button>
          </form>

          <div className="login-footer">
            <p className="security-notice">
              🔒 {t('auth.restrictedNotice', 'This is a restricted federal government system.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
