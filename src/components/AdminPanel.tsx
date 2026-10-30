import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, type FormSubmissionRecord } from '../services/api';
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
        console.error('Failed to load submissions:', response.message);
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
      const personalStatus = (rawData?.employeePersonalStatus as { fullNameWithSurname?: string; dateOfBirth?: { day?: string; month?: string; year?: string } }) || {};
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
      {/* Top Navigation */}
      <nav className="admin-nav-bar">
        <div className="admin-nav-brand">
          <Link to="/" className="brand-link">
            <h2>Ambo University</h2>
            <span>Admin Review Center</span>
          </Link>
        </div>
        <div className="admin-nav-links">
          <Link to="/" className="admin-nav-link">🏠 Portal Home</Link>
          <Link to="/hr" className="admin-nav-link">📊 HR Dashboard</Link>
          <Link to="/form" className="admin-nav-link">📋 Life History</Link>
          <Link to="/social-security" className="admin-nav-link">🛡️ Social Security</Link>
        </div>
        <div className="admin-nav-actions">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>

      <div className="admin-header">
        <h1>Admin Panel - Form Submissions</h1>
        <div className="header-controls">
          <div className="filter-controls">
            <label>Type:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as 'all' | 'life-history' | 'social-security')}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="life-history">Life History</option>
              <option value="social-security">Social Security</option>
            </select>
          </div>
          <div className="filter-controls">
            <label>Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button onClick={loadSubmissions} className="refresh-btn" disabled={loading}>
            {loading ? '⏳ Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="submissions-list">
          <h2>Submissions ({submissions.length})</h2>
          {loading ? (
            <div className="empty-state">
              <p>Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="empty-state">
              <p>No submissions found.</p>
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
                          {submission.status}
                        </span>
                        <span className="type-badge">
                          {submission.type === 'life-history' ? '📋 Life History' : '📄 Social Security'}
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <p><strong>ID:</strong> {submission.id}</p>
                      <p><strong>Submitted:</strong> {formatDate(submission.submittedAt)}</p>
                      {submission.type === 'life-history' && (
                        <>
                          <p><strong>Phone:</strong> {submissionData.personalInfo?.phoneNumber || 'N/A'}</p>
                          <p><strong>Region:</strong> {submissionData.personalInfo?.region || 'N/A'}</p>
                        </>
                      )}
                      {submission.type === 'social-security' && (
                        <>
                          <p><strong>Workplace:</strong> {submissionData.workplaceInfo?.workplaceName || 'N/A'}</p>
                          <p><strong>Phone:</strong> {submissionData.workplaceInfo?.phoneNumber || 'N/A'}</p>
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
                <h2>Submission Details</h2>
                <div className="header-badges">
                  <span className={`status-badge ${selectedSubmission.status}`}>
                    {selectedSubmission.status}
                  </span>
                  <span className="type-badge">
                    {isLifeHistory ? '📋 Life History Form' : '📄 Social Security Form'}
                  </span>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="close-btn">
                  ✕
                </button>
              </div>
              
              <div className="details-content">
                {isLifeHistory && (
                  <>
                    <div className="detail-section">
                      <h3>Personal Information</h3>
                      <div className="detail-grid">
                        <div><strong>Employee Name:</strong> {submissionData.personalInfo?.employeeName || 'N/A'}</div>
                        <div><strong>Father's Name:</strong> {submissionData.personalInfo?.fatherName || 'N/A'}</div>
                        <div><strong>Date of Birth:</strong> {typeof submissionData.personalInfo?.dateOfBirth === 'string' ? submissionData.personalInfo.dateOfBirth : 'N/A'}</div>
                        <div><strong>Phone:</strong> {submissionData.personalInfo?.phoneNumber || 'N/A'}</div>
                        <div><strong>Region:</strong> {submissionData.personalInfo?.region || 'N/A'}</div>
                        <div><strong>Woreda:</strong> {submissionData.personalInfo?.woreda || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Family Information</h3>
                      <div className="detail-grid">
                        <div><strong>Marital Status:</strong> {submissionData.familyInfo?.maritalStatus || 'N/A'}</div>
                        <div><strong>Spouse Name:</strong> {submissionData.familyInfo?.spouseName || 'N/A'}</div>
                        <div><strong>Children:</strong> {submissionData.familyInfo?.children?.length || 0}</div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Education</h3>
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
                      <h3>Work Experience</h3>
                      <p>{submissionData.workExperience?.length || 0} previous job(s)</p>
                    </div>
                  </>
                )}

                {isSocialSecurity && (
                  <>
                    <div className="detail-section">
                      <h3>Employee Information</h3>
                      <div className="detail-grid">
                        <div><strong>Full Name:</strong> {submissionData.personalInfo?.employeeName || 'N/A'}</div>
                        <div><strong>Date of Birth:</strong> {
                          typeof submissionData.personalInfo?.dateOfBirth === 'object' && submissionData.personalInfo?.dateOfBirth !== null
                            ? `${submissionData.personalInfo.dateOfBirth.day || ''}/${submissionData.personalInfo.dateOfBirth.month || ''}/${submissionData.personalInfo.dateOfBirth.year || ''}`
                            : 'N/A'
                        }</div>
                        <div><strong>Phone:</strong> {submissionData.workplaceInfo?.phoneNumber || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Workplace Information</h3>
                      <div className="detail-grid">
                        <div><strong>Workplace Name:</strong> {submissionData.workplaceInfo?.workplaceName || 'N/A'}</div>
                        <div><strong>P.O. Box:</strong> {submissionData.workplaceInfo?.poBoxNumber || 'N/A'}</div>
                        <div><strong>Phone:</strong> {submissionData.workplaceInfo?.phoneNumber || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Service History</h3>
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
                      <h3>Family</h3>
                      <div className="detail-grid">
                        <div><strong>Spouse:</strong> {submissionData.spouseInfo?.fullName || 'N/A'}</div>
                        <div><strong>Children:</strong> {submissionData.children?.length || 0}</div>
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
                    ✓ Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleStatusChange(selectedSubmission.id, 'rejected')}
                    disabled={selectedSubmission.status === 'rejected'}
                  >
                    ✗ Reject
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
                    📥 Export JSON
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
