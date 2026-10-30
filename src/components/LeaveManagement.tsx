import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { LeaveRequest, Employee } from '../types/hrTypes';
import { hrApi } from '../services/api';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const { t } = useTranslation();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<LeaveRequest>>({
    employeeId: '',
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'pending',
  });

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const params = filterStatus === 'all' ? {} : { status: filterStatus };
      const response = await hrApi.getLeaveRequests(params);
      if (response.success && response.data) {
        const leavesList = Array.isArray(response.data) ? response.data : [];
        setLeaves(leavesList);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  const fetchEmployees = useCallback(async () => {
    try {
      const response = await hrApi.getEmployees();
      if (response.success && response.data) {
        const emps = Array.isArray(response.data) ? response.data : [];
        setEmployees(emps);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'pending',
    });
    setShowModal(true);
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await hrApi.updateLeaveRequest(id, { status: 'approved' });
      if (response.success) {
        await fetchLeaves();
      } else {
        alert(response.message || 'Failed to approve leave request');
      }
    } catch (error) {
      console.error('Error approving leave:', error);
      alert('Failed to approve leave request');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await hrApi.updateLeaveRequest(id, { status: 'rejected' });
      if (response.success) {
        await fetchLeaves();
      } else {
        alert(response.message || 'Failed to reject leave request');
      }
    } catch (error) {
      console.error('Error rejecting leave:', error);
      alert('Failed to reject leave request');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const employee = employees.find((emp) => emp.id === formData.employeeId);
      const startDate = new Date(formData.startDate || '');
      const endDate = new Date(formData.endDate || '');
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const leaveData = {
        ...formData,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
        days,
        submittedDate: new Date().toISOString().split('T')[0],
      };

      const response = await hrApi.createLeaveRequest(leaveData);
      if (response.success) {
        await fetchLeaves();
        setShowModal(false);
      } else {
        alert(response.message || 'Failed to create leave request');
      }
    } catch (error) {
      console.error('Error creating leave request:', error);
      alert('Failed to create leave request');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
    };
    const statusLabels: Record<string, string> = {
      pending: t('leaves.pending', 'Under Review'),
      approved: t('leaves.approved', 'Approved'),
      rejected: t('leaves.rejected', 'Declined'),
    };
    return (
      <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses] || 'status-pending'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeLabels: Record<string, string> = {
      vacation: t('leaves.typeVacation', 'Annual Leave'),
      sick: t('leaves.typeSick', 'Sick Leave'),
      personal: t('leaves.typePersonal', 'Personal'),
      maternity: t('leaves.typeMaternity', 'Maternity'),
      paternity: t('leaves.typePaternity', 'Paternity'),
      study: t('leaves.typeStudy', 'Study Leave'),
    };
    return <span className="type-badge">{typeLabels[type] || type}</span>;
  };

  return (
    <div className="leave-management">
      <div className="page-header">
        <div>
          <h2>{t('leaves.title', 'Leave Administration & Approvals')}</h2>
          <p className="page-subtitle">{t('leaves.subtitle', 'Absence requests, entitlements, statutory balances, and approvals')}</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          + {t('leaves.requestLeave', 'Submit Leave Application')}
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          {t('common.all', 'All')}
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          {t('leaves.pending', 'Pending Review')}
        </button>
        <button
          className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
          onClick={() => setFilterStatus('approved')}
        >
          {t('leaves.approved', 'Approved')}
        </button>
        <button
          className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilterStatus('rejected')}
        >
          {t('leaves.rejected', 'Declined')}
        </button>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading', 'Loading leave requests...')}</div>
      ) : (
        <div className="leaves-grid">
          {leaves.length === 0 ? (
            <p className="no-data" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              {t('leaves.noLeaves', 'No leave applications matching selected criteria')}
            </p>
          ) : (
            leaves.map((leave) => (
              <div key={leave.id} className="leave-card">
                <div className="leave-header">
                  <div>
                    <h3>{leave.employeeName}</h3>
                    <p className="leave-submitted">
                      {t('common.date', 'Submitted')}: {new Date(leave.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="badges">
                    {getTypeBadge(leave.type)}
                    {getStatusBadge(leave.status)}
                  </div>
                </div>

                <div className="leave-details">
                  <div className="detail-item">
                    <span className="detail-label">{t('leaves.startDate', 'Duration')}:</span>
                    <span className="detail-value">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">{t('leaves.days', 'Days')}:</span>
                    <span className="detail-value">{leave.days} {t('leaves.days', 'days')}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">{t('leaves.reason', 'Reason')}:</span>
                    <span className="detail-value">{leave.reason}</span>
                  </div>
                </div>

                {leave.status === 'pending' && (
                  <div className="leave-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(leave.id)}
                    >
                      ✓ {t('leaves.approveAction', 'Approve')}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(leave.id)}
                    >
                      ✗ {t('leaves.rejectAction', 'Decline')}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('leaves.requestLeave', 'Submit Leave Application')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('leaves.employeeName', 'Staff Member')}</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                >
                  <option value="">-- {t('common.search', 'Select Staff Member')} --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>{t('leaves.type', 'Leave Category')}</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LeaveRequest['type'] })}
                  required
                >
                  <option value="vacation">{t('leaves.typeVacation', 'Annual Statutory Leave')}</option>
                  <option value="sick">{t('leaves.typeSick', 'Medical / Sick Leave')}</option>
                  <option value="personal">{t('leaves.typePersonal', 'Personal / Compassionate')}</option>
                  <option value="maternity">{t('leaves.typeMaternity', 'Maternity Leave')}</option>
                  <option value="paternity">{t('leaves.typePaternity', 'Paternity Leave')}</option>
                  <option value="study">{t('leaves.typeStudy', 'Academic Study Leave')}</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('leaves.startDate', 'Start Date')}</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('leaves.endDate', 'End Date')}</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('leaves.reason', 'Justification / Reason')}</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  {t('common.cancel', 'Cancel')}
                </button>
                <button type="submit" className="btn-primary">
                  {t('common.submit', 'Submit Request')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
