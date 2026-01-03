import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BilingualText from '../BilingualText';
import { statsApi } from '../../services/libraryApi';
import type { LibraryStats } from '../../types/libraryTypes';
import './LibraryDashboard.css';

export default function LibraryDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statsApi.getStats();
      setStats(data);
    } catch (error: any) {
      console.error('Failed to load stats:', error);
      // Set default stats if API fails
      setStats({
        totalBooks: 0,
        totalMembers: 0,
        borrowedBooks: 0,
        overdueBooks: 0,
        availableBooks: 0,
        totalCategories: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="library-dashboard">
        <div className="loading">{t('common.loading')}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="library-dashboard">
        <div className="error">{t('common.error')}</div>
      </div>
    );
  }

  return (
    <div className="library-dashboard">
      <h1><BilingualText translationKey="library.dashboardTitle" /></h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3><BilingualText translationKey="library.totalBooks" /></h3>
            <p className="stat-value">{stats.totalBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3><BilingualText translationKey="library.totalMembers" /></h3>
            <p className="stat-value">{stats.totalMembers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3><BilingualText translationKey="library.borrowedBooks" /></h3>
            <p className="stat-value">{stats.borrowedBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3><BilingualText translationKey="library.overdueBooks" /></h3>
            <p className="stat-value">{stats.overdueBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3><BilingualText translationKey="library.availableBooks" /></h3>
            <p className="stat-value">{stats.availableBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-content">
            <h3><BilingualText translationKey="library.categories" /></h3>
            <p className="stat-value">{stats.totalCategories}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

