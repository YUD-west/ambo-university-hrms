import { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'life-history' | 'social-security'>('all');

  useEffect(() => {
    loadSubmissions();
  }, [filterType]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const type = filterType === 'all' ? undefined : filterType;
      const response = await adminApi.getPendingSubmissions(type);
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
  };

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
        // Reload submissions to get updated data
        await loadSubmissions();
        // Update selected submission if it's the one we just changed
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

  const getSubmissionName = (submission: any): string => {
    if (submission.type === 'life-history' && submission.data?.personalInfo?.employeeName) {
      return submission.data.personalInfo.employeeName;
    }
    if (submission.type === 'social-security' && submission.data?.employeePersonalStatus?.fullNameWithSurname) {
      return submission.data.employeePersonalStatus.fullNameWithSurname;
    }
    return submission.submittedBy || 'Unnamed';
  };

  const getSubmissionData = (submission: any) => {
    if (submission.type === 'life-history') {
      return {
        personalInfo: submission.data?.personalInfo || {},
        familyInfo: submission.data?.familyInfo || {},
        education: submission.data?.education || [],
        workExperience: submission.data?.workExperience || [],
      };
    }
    if (submission.type === 'social-security') {
      return {
        personalInfo: {
          employeeName: submission.data?.employeePersonalStatus?.fullNameWithSurname || 'N/A',
          dateOfBirth: submission.data?.employeePersonalStatus?.dateOfBirth || {},
          phoneNumber: submission.data?.workplaceInfo?.phoneNumber || 'N/A',
        },
        workplaceInfo: submission.data?.workplaceInfo || {},
        serviceHistory: submission.data?.serviceHistory || [],
        spouseInfo: submission.data?.spouseInfo || {},
        children: submission.data?.children || [],
      };
    }
    return {};
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel - Form Submissions</h1>
        <div className="header-controls">
          <div className="filter-controls">
            <label>Filter by Type:</label>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value as any)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="life-history">Life History</option>
              <option value="social-security">Social Security</option>
            </select>
          </div>
          <button onClick={loadSubmissions} className="refresh-btn" disabled={loading}>
            {loading ? '⏳ Loading...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="submissions-list">
          <h2>Pending Submissions ({submissions.length})</h2>
          {loading ? (
            <div className="empty-state">
              <p>Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="empty-state">
              <p>No pending submissions found.</p>
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
                        <div><strong>Date of Birth:</strong> {submissionData.personalInfo?.dateOfBirth || 'N/A'}</div>
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
                        submissionData.education.map((edu: any, index: number) => (
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
                          submissionData.personalInfo?.dateOfBirth 
                            ? `${submissionData.personalInfo.dateOfBirth.day}/${submissionData.personalInfo.dateOfBirth.month}/${submissionData.personalInfo.dateOfBirth.year}`
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
                        submissionData.serviceHistory.map((service: any, index: number) => (
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

