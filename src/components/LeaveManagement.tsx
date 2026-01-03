import { useState, useEffect } from 'react';
import type { LeaveRequest, Employee } from '../types/hrTypes';
import { hrApi } from '../services/api';
import './LeaveManagement.css';

const LeaveManagement = () => {
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
    status: 'pending'
  });

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus]);

  const fetchLeaves = async () => {
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
  };

  const fetchEmployees = async () => {
    try {
      const response = await hrApi.getEmployees();
      if (response.success && response.data) {
        const emps = Array.isArray(response.data) ? response.data : [];
        setEmployees(emps);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      type: 'vacation',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'pending'
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      // Note: Backend doesn't have delete endpoint for leaves, so we'll just update status
      try {
        const response = await hrApi.updateLeaveRequest(id, { status: 'rejected' });
        if (response.success) {
          await fetchLeaves();
        }
      } catch (error) {
        console.error('Error deleting leave:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const employee = employees.find(emp => emp.id === formData.employeeId);
      const startDate = new Date(formData.startDate || '');
      const endDate = new Date(formData.endDate || '');
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const leaveData = {
        ...formData,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
        days,
        submittedDate: new Date().toISOString().split('T')[0]
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

  const filteredLeaves = leaves;

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    return <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>{status}</span>;
  };

  const getTypeBadge = (type: string) => {
    return <span className="type-badge">{type}</span>;
  };

  return (
    <div className="leave-management">
      <div className="page-header">
        <h2>Leave Management</h2>
        <button className="btn-primary" onClick={handleAdd}>
          + Request Leave
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
          onClick={() => setFilterStatus('approved')}
        >
          Approved
        </button>
        <button
          className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
          onClick={() => setFilterStatus('rejected')}
        >
          Rejected
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading leave requests...</div>
      ) : (
        <div className="leaves-grid">
          {filteredLeaves.map((leave) => (
          <div key={leave.id} className="leave-card">
            <div className="leave-header">
              <div>
                <h3>{leave.employeeName}</h3>
                <p className="leave-submitted">Submitted: {new Date(leave.submittedDate).toLocaleDateString()}</p>
              </div>
              {getStatusBadge(leave.status)}
            </div>
            <div className="leave-details">
              <div className="leave-detail-row">
                <span className="detail-label">Type:</span>
                {getTypeBadge(leave.type)}
              </div>
              <div className="leave-detail-row">
                <span className="detail-label">Period:</span>
                <span className="detail-value">
                  {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="leave-detail-row">
                <span className="detail-label">Days:</span>
                <span className="detail-value">{leave.days} days</span>
              </div>
              <div className="leave-reason">
                <span className="detail-label">Reason:</span>
                <p>{leave.reason}</p>
              </div>
            </div>
            {leave.status === 'pending' && (
              <div className="leave-actions">
                <button className="btn-approve" onClick={() => handleApprove(leave.id)}>
                  Approve
                </button>
                <button className="btn-reject" onClick={() => handleReject(leave.id)}>
                  Reject
                </button>
                <button className="btn-delete" onClick={() => handleDelete(leave.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {!loading && filteredLeaves.length === 0 && (
        <div className="no-data">
          <p>No leave requests found</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Request Leave</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as LeaveRequest['type'] })}
                  required
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal</option>
                  <option value="maternity">Maternity</option>
                  <option value="paternity">Paternity</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Request
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

