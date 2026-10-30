import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { hrApi } from '../services/api';
import type { DashboardStats, Employee, LeaveRequest } from '../types/hrTypes';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentHires, setRecentHires] = useState<Employee[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [statsResponse, employeesResponse, leavesResponse] = await Promise.all([
        hrApi.getDashboardStats(),
        hrApi.getEmployees(),
        hrApi.getLeaveRequests({ status: 'pending' }),
      ]);

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data as DashboardStats);
      } else {
        throw new Error(statsResponse.message || 'Failed to load dashboard stats');
      }

      if (employeesResponse.success && employeesResponse.data) {
        const employees = Array.isArray(employeesResponse.data) ? employeesResponse.data : [];
        const sorted = employees
          .sort((a: Employee, b: Employee) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime())
          .slice(0, 5);
        setRecentHires(sorted);
      }

      if (leavesResponse.success && leavesResponse.data) {
        const leaves = Array.isArray(leavesResponse.data) ? leavesResponse.data : [];
        setPendingLeaves(leaves);
      }

      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error('Error fetching dashboard data:', err);
      const msg = err instanceof Error ? err.message : 'Failed to load dashboard data. Please check your connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>{t('common.error')}</h3>
        <p>{error}</p>
        <button onClick={fetchData} className="retry-btn">
          🔄 {t('common.back')}
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="dashboard">
      {lastUpdated && (
        <div className="dashboard-header-info">
          <span className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button onClick={fetchData} className="refresh-btn-small" title="Refresh">
            🔄
          </button>
        </div>
      )}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{t('dashboard.totalEmployees')}</h3>
            <p className="stat-value">{stats.totalEmployees}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{t('dashboard.activeEmployees')}</h3>
            <p className="stat-value">{stats.activeEmployees}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{t('dashboard.onLeave')}</h3>
            <p className="stat-value">{stats.onLeave}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{t('dashboard.departments')}</h3>
            <p className="stat-value">{stats.departments}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{t('dashboard.todayPresent')}</h3>
            <p className="stat-value">{stats.todayAttendance.present}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{t('dashboard.todayLate')}</h3>
            <p className="stat-value">{stats.todayAttendance.late}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{t('dashboard.pendingLeaves')}</h3>
            <p className="stat-value">{stats.pendingLeaveRequests}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{t('dashboard.monthlyHires')}</h3>
            <p className="stat-value">{stats.monthlyHires}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>{t('dashboard.recentHires')}</h2>
          <div className="recent-hires">
            {recentHires.length === 0 ? (
              <p className="no-data">{t('dashboard.noRecentHires')}</p>
            ) : (
              recentHires.map((employee) => (
                <div key={employee.id} className="hire-item">
                  <div className="hire-avatar">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                  <div className="hire-info">
                    <p className="hire-name">{employee.firstName} {employee.lastName}</p>
                    <p className="hire-position">{employee.position}</p>
                  </div>
                  <div className="hire-date">
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h2>{t('dashboard.pendingLeaveRequests')}</h2>
          {pendingLeaves.length === 0 ? (
            <p className="no-data">{t('dashboard.noPendingLeaves')}</p>
          ) : (
            <div className="pending-leaves">
              {pendingLeaves.map((leave) => (
                <div key={leave.id} className="leave-item">
                  <div className="leave-info">
                    <p className="leave-employee">{leave.employeeName}</p>
                    <p className="leave-type">{leave.type}</p>
                  </div>
                  <div className="leave-dates">
                    <p>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
                    <p className="leave-days">{leave.days} days</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

