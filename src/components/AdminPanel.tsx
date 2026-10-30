import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminApi, type FormSubmissionRecord } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import './AdminPanel.css';

interface PersonalInfo {
  employeeName?: string;
  fatherName?: string;
  dateOfBirth?: string | { day?: string; month?: string; year?: string };
  phoneNumber?: string;
  region?: string;
  woreda?: string;
}

interface FamilyInfo {
  maritalStatus?: string;
  spouseName?: string;
  children?: unknown[];
}

interface EducationRecord {
  level?: string;
  schoolName?: string;
}

interface ServiceRecord {
  serialNumber?: number;
  officeName?: string;
}

interface WorkplaceInfo {
  workplaceName?: string;
  poBoxNumber?: string;
  phoneNumber?: string;
}

interface SpouseInfo {
  fullName?: string;
}

interface NormalizedSubmissionData {
  personalInfo?: PersonalInfo;
  familyInfo?: FamilyInfo;
  education?: EducationRecord[];
  workExperience?: unknown[];
  workplaceInfo?: WorkplaceInfo;
  serviceHistory?: ServiceRecord[];
  spouseInfo?: SpouseInfo;
  children?: unknown[];
}

const AdminPanel = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'life-history' | 'social-security'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const type = filterType === 'all' ? undefined : filterType;
      const status = filterStatus === 'all' ? undefined : filterStatus;
      const response = await adminApi.getSubmissions({ type, status });
      if (response.success && response.data) {
        const subs = Array.isArray(response.data) ? response.data : [];
        setSubmissions(subs);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [filterType, filterStatus]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleStatusChange = async (submissionId: string, newStatus: 'approved' | 'rejected') => {
    try {
      let response;
      if (newStatus === 'approved') {
        response = await adminApi.approveSubmission(submissionId);
      } else {
        response = await adminApi.rejectSubmission(submissionId);
      }

      if (response.success) {
        await loadSubmissions();
        if (selectedSubmission?.id === submissionId) {
          setSelectedSubmission({ ...selectedSubmission, status: newStatus });
        }
      } else {
        alert(response.message || 'Failed to update submission status');
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
      alert('Failed to update submission status');
    }
  };

  const getSubmissionName = (submission: FormSubmissionRecord): string => {
    const rawData = submission.data as Record<string, unknown>;
    if (submission.type === 'life-history') {
      const personal = rawData?.personalInfo as PersonalInfo | undefined;
      if (personal?.employeeName) return personal.employeeName;
    }
    if (submission.type === 'social-security') {
      const status = rawData?.employeePersonalStatus as { fullNameWithSurname?: string } | undefined;
      if (status?.fullNameWithSurname) return status.fullNameWithSurname;
    }
    return submission.submittedBy || 'Unnamed';
  };

  const getSubmissionData = (submission: FormSubmissionRecord): NormalizedSubmissionData => {
    const rawData = submission.data as Record<string, unknown>;
    if (submission.type === 'life-history') {
      return {
        personalInfo: (rawData?.personalInfo as PersonalInfo) || {},
        familyInfo: (rawData?.familyInfo as FamilyInfo) || {},
        education: (rawData?.education as EducationRecord[]) || [],
        workExperience: (rawData?.workExperience as unknown[]) || [],
      };
    }
    if (submission.type === 'social-security') {
      const personalStatus = (rawData?.employeePersonalStatus as {
        fullNameWithSurname?: string;
        dateOfBirth?: { day?: string; month?: string; year?: string };
      }) || {};
      const workplace = (rawData?.workplaceInfo as WorkplaceInfo) || {};
      return {
        personalInfo: {
          employeeName: personalStatus.fullNameWithSurname || 'N/A',
          dateOfBirth: personalStatus.dateOfBirth || {},
          phoneNumber: workplace.phoneNumber || 'N/A',
        },
        workplaceInfo: workplace,
        serviceHistory: (rawData?.serviceHistory as ServiceRecord[]) || [],
        spouseInfo: (rawData?.spouseInfo as SpouseInfo) || {},
        children: (rawData?.children as unknown[]) || [],
      };
    }
    return {};
  };

  return (
    <div className="admin-panel">
      {/* Top Navigation with Auth & Role */}
      <nav className="admin-nav-bar">
        <div className="admin-nav-brand">
          <Link to="/" className="brand-link">
            <h2>{t('nav.brandTitle', 'Ambo University')}</h2>
            <span>{t('admin.title', 'Administrative Review Center')}</span>
          </Link>
        </div>
        <div className="admin-nav-links">
          <Link to="/" className="admin-nav-link">🏠 {t('nav.home', 'Portal Home')}</Link>
          <Link to="/hr" className="admin-nav-link">📊 {t('nav.dashboard', 'HR Dashboard')}</Link>
          <Link to="/form" className="admin-nav-link">📋 {t('nav.lifeHistoryForm', 'Life History')}</Link>
          <Link to="/social-security" className="admin-nav-link">🛡️ {t('nav.socialSecurityForm', 'Social Security')}</Link>
        </div>
        <div className="admin-nav-actions">
          <span className="admin-user-pill">
            👤 {user?.name || 'Administrator'}
          </span>
          <button type="button" onClick={logout} className="admin-logout-btn" title={t('nav.logout', 'Log Out')}>
            🚪 {t('nav.logout', 'Log Out')}
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>

      <div className="admin-header">
        <div>
          <h1>{t('admin.title', 'Administrative Review & Approval Center')}</h1>
          <p className="admin-header-subtitle">{t('admin.subtitle', 'Triage, verify, and approve incoming employee civil service filings')}</p>
        </div>
        <div className="header-controls">
          <div className="filter-controls">
            <label>{t('admin.filterType', 'Category')}:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'life-history' | 'social-security')}
              className="filter-select"
            >
              <option value="all">{t('admin.allTypes', 'All Form Types')}</option>
              <option value="life-history">{t('admin.lifeHistoryType', 'Life History Forms')}</option>
              <option value="social-security">{t('admin.socialSecurityType', 'Social Security Forms')}</option>
            </select>
          </div>
          <div className="filter-controls">
            <label>{t('admin.filterStatus', 'Status')}:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
              className="filter-select"
            >
              <option value="all">{t('admin.allStatuses', 'All Statuses')}</option>
              <option value="pending">{t('admin.pendingStatus', 'Pending Review')}</option>
              <option value="approved">{t('admin.approvedStatus', 'Approved')}</option>
              <option value="rejected">{t('admin.rejectedStatus', 'Declined')}</option>
            </select>
          </div>
          <button onClick={loadSubmissions} className="refresh-btn" disabled={loading}>
            {loading ? t('common.loading', 'Loading...') : `🔄 ${t('common.refresh', 'Refresh')}`}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="submissions-list">
          <h2>{t('admin.title', 'Submissions')} ({submissions.length})</h2>
          {loading ? (
            <div className="empty-state">
              <p>{t('common.loading', 'Loading submissions...')}</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="empty-state">
              <p>{t('admin.emptyList', 'No submissions found matching criteria.')}</p>
            </div>
          ) : (
            <div className="submissions-grid">
              {submissions.map((submission) => {
                const submissionData = getSubmissionData(submission);
                return (
                  <div
                    key={submission.id}
                    className={`submission-card ${selectedSubmission?.id === submission.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="card-header">
                      <h3>{getSubmissionName(submission)}</h3>
                      <div className="card-badges">
                        <span className={`status-badge ${submission.status}`}>
                          {submission.status === 'pending'
                            ? t('admin.pendingStatus', 'Pending')
                            : submission.status === 'approved'
                            ? t('admin.approvedStatus', 'Approved')
                            : t('admin.rejectedStatus', 'Rejected')}
                        </span>
                        <span className="type-badge">
                          {submission.type === 'life-history'
                            ? `📋 ${t('admin.lifeHistoryType', 'Life History')}`
                            : `📄 ${t('admin.socialSecurityType', 'Social Security')}`}
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <p><strong>{t('admin.submissionId', 'ID')}:</strong> {submission.id}</p>
                      <p><strong>{t('admin.submittedAt', 'Submitted')}:</strong> {formatDate(submission.submittedAt)}</p>
                      {submission.type === 'life-history' && (
                        <>
                          <p><strong>{t('employees.phone', 'Phone')}:</strong> {submissionData.personalInfo?.phoneNumber || 'N/A'}</p>
                          <p><strong>{t('lifeHistory.region', 'Region')}:</strong> {submissionData.personalInfo?.region || 'N/A'}</p>
                        </>
                      )}
                      {submission.type === 'social-security' && (
                        <>
                          <p><strong>{t('socialSecurity.workplaceName', 'Workplace')}:</strong> {submissionData.workplaceInfo?.workplaceName || 'N/A'}</p>
                          <p><strong>{t('employees.phone', 'Phone')}:</strong> {submissionData.workplaceInfo?.phoneNumber || 'N/A'}</p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedSubmission && (() => {
          const submissionData = getSubmissionData(selectedSubmission);
          const isLifeHistory = selectedSubmission.type === 'life-history';
          const isSocialSecurity = selectedSubmission.type === 'social-security';

          return (
            <div className="submission-details">
              <div className="details-header">
                <h2>{t('admin.detailTitle', 'Submission Document Inspector')}</h2>
                <div className="header-badges">
                  <span className={`status-badge ${selectedSubmission.status}`}>
                    {selectedSubmission.status}
                  </span>
                  <span className="type-badge">
                    {isLifeHistory
                      ? `📋 ${t('nav.lifeHistoryForm', 'Life History Form')}`
                      : `📄 ${t('nav.socialSecurityForm', 'Social Security Form')}`}
                  </span>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="close-btn" aria-label="Close details">
                  ✕
                </button>
              </div>

              <div className="details-content">
                {isLifeHistory && (
                  <>
                    <div className="detail-section">
                      <h3>{t('lifeHistory.sectionPersonal', '1. Personal Information')}</h3>
                      <div className="detail-grid">
                        <div><strong>{t('lifeHistory.employeeName', 'Employee Name')}:</strong> {submissionData.personalInfo?.employeeName || 'N/A'}</div>
                        <div><strong>{t('lifeHistory.fatherName', "Father's Name")}:</strong> {submissionData.personalInfo?.fatherName || 'N/A'}</div>
                        <div><strong>{t('lifeHistory.dateOfBirth', 'Date of Birth')}:</strong> {typeof submissionData.personalInfo?.dateOfBirth === 'string' ? submissionData.personalInfo.dateOfBirth : 'N/A'}</div>
                        <div><strong>{t('employees.phone', 'Phone')}:</strong> {submissionData.personalInfo?.phoneNumber || 'N/A'}</div>
                        <div><strong>{t('lifeHistory.region', 'Region')}:</strong> {submissionData.personalInfo?.region || 'N/A'}</div>
                        <div><strong>{t('lifeHistory.woreda', 'Woreda')}:</strong> {submissionData.personalInfo?.woreda || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>{t('lifeHistory.sectionFamily', '2. Family Information')}</h3>
                      <div className="detail-grid">
                        <div><strong>{t('lifeHistory.maritalStatus', 'Marital Status')}:</strong> {submissionData.familyInfo?.maritalStatus || 'N/A'}</div>
                        <div><strong>{t('lifeHistory.spouseName', 'Spouse Name')}:</strong> {submissionData.familyInfo?.spouseName || 'N/A'}</div>
                        <div><strong>{t('lifeHistory.children', 'Children')}:</strong> {submissionData.familyInfo?.children?.length || 0}</div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>{t('lifeHistory.sectionEducation', '3. Education')}</h3>
                      {submissionData.education && submissionData.education.length > 0 ? (
                        submissionData.education.map((edu, index) => (
                          <div key={index} className="education-item">
                            <strong>{edu.level}:</strong> {edu.schoolName || 'Not specified'}
                          </div>
                        ))
                      ) : (
                        <p>No education records</p>
                      )}
                    </div>

                    <div className="detail-section">
                      <h3>{t('lifeHistory.sectionExperience', '4. Work Experience')}</h3>
                      <p>{submissionData.workExperience?.length || 0} previous job(s)</p>
                    </div>
                  </>
                )}

                {isSocialSecurity && (
                  <>
                    <div className="detail-section">
                      <h3>{t('lifeHistory.sectionPersonal', 'Employee Information')}</h3>
                      <div className="detail-grid">
                        <div><strong>{t('socialSecurity.employeeFullName', 'Full Name')}:</strong> {submissionData.personalInfo?.employeeName || 'N/A'}</div>
                        <div><strong>{t('lifeHistory.dateOfBirth', 'Date of Birth')}:</strong> {
                          typeof submissionData.personalInfo?.dateOfBirth === 'object' && submissionData.personalInfo?.dateOfBirth !== null
                            ? `${submissionData.personalInfo.dateOfBirth.day || ''}/${submissionData.personalInfo.dateOfBirth.month || ''}/${submissionData.personalInfo.dateOfBirth.year || ''}`
                            : 'N/A'
                        }</div>
                        <div><strong>{t('employees.phone', 'Phone')}:</strong> {submissionData.workplaceInfo?.phoneNumber || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>{t('socialSecurity.workplaceName', 'Workplace Information')}</h3>
                      <div className="detail-grid">
                        <div><strong>{t('socialSecurity.workplaceName', 'Workplace Name')}:</strong> {submissionData.workplaceInfo?.workplaceName || 'N/A'}</div>
                        <div><strong>{t('socialSecurity.poBox', 'P.O. Box')}:</strong> {submissionData.workplaceInfo?.poBoxNumber || 'N/A'}</div>
                        <div><strong>{t('socialSecurity.phone', 'Phone')}:</strong> {submissionData.workplaceInfo?.phoneNumber || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>{t('socialSecurity.serviceHistory', 'Service History')}</h3>
                      {submissionData.serviceHistory && submissionData.serviceHistory.length > 0 ? (
                        submissionData.serviceHistory.map((service, index) => (
                          <div key={index} className="service-item">
                            <strong>Office {service.serialNumber}:</strong> {service.officeName || 'N/A'}
                          </div>
                        ))
                      ) : (
                        <p>No service history</p>
                      )}
                    </div>

                    <div className="detail-section">
                      <h3>{t('lifeHistory.sectionFamily', 'Family')}</h3>
                      <div className="detail-grid">
                        <div><strong>{t('socialSecurity.spouseInfo', 'Spouse')}:</strong> {submissionData.spouseInfo?.fullName || 'N/A'}</div>
                        <div><strong>{t('socialSecurity.childrenInfo', 'Children')}:</strong> {submissionData.children?.length || 0}</div>
                      </div>
                    </div>
                  </>
                )}

                <div className="detail-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleStatusChange(selectedSubmission.id, 'approved')}
                    disabled={selectedSubmission.status === 'approved'}
                  >
                    {t('admin.approveBtn', '✓ Approve')}
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleStatusChange(selectedSubmission.id, 'rejected')}
                    disabled={selectedSubmission.status === 'rejected'}
                  >
                    {t('admin.rejectBtn', '✗ Decline')}
                  </button>
                  <button
                    className="btn-export"
                    onClick={() => {
                      const dataStr = JSON.stringify(selectedSubmission.data, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `submission-${selectedSubmission.id}.json`;
                      link.click();
                    }}
                  >
                    {t('admin.exportBtn', '📥 Export JSON')}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default AdminPanel;
