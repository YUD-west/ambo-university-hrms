import { useState, useEffect, useCallback, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Attendance, Employee } from '../types/hrTypes';
import { hrApi } from '../services/api';
import './AttendanceManagement.css';

const AttendanceManagement = () => {
  const { t } = useTranslation();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Attendance>>({
    employeeId: '',
    date: selectedDate,
    checkIn: '09:00',
    checkOut: '18:00',
    status: 'present',
  });

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await hrApi.getAttendance({ date: selectedDate });
      if (response.success && response.data) {
        const att = Array.isArray(response.data) ? response.data : [];
        setAttendance(att);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

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
    fetchAttendance();
  }, [fetchAttendance]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  const handleAdd = () => {
    setFormData({
      employeeId: '',
      date: selectedDate,
      checkIn: '09:00',
      checkOut: '18:00',
      status: 'present',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const employee = employees.find((emp) => emp.id === formData.employeeId);
      const hoursWorked = calculateHours(formData.checkIn || '09:00', formData.checkOut || '18:00');

      const attendanceData = {
        ...formData,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
        hoursWorked,
      };

      const response = await hrApi.createAttendance(attendanceData);
      if (response.success) {
        await fetchAttendance();
        setShowModal(false);
      } else {
        alert(response.message || 'Failed to create attendance record');
      }
    } catch (error) {
      console.error('Error creating attendance:', error);
      alert('Failed to create attendance record');
    }
  };

  const calculateHours = (checkIn: string, checkOut: string): number => {
    const [inHour, inMin] = checkIn.split(':').map(Number);
    const [outHour, outMin] = checkOut.split(':').map(Number);
    const inTime = inHour * 60 + inMin;
    const outTime = outHour * 60 + outMin;
    return (outTime - inTime) / 60;
  };

  const filteredAttendance = attendance.filter((a) => a.date === selectedDate);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      present: 'status-present',
      absent: 'status-absent',
      late: 'status-late',
      'half-day': 'status-halfday',
    };
    const statusLabels: Record<string, string> = {
      present: t('attendance.present', 'Present'),
      late: t('attendance.late', 'Late'),
      absent: t('attendance.absent', 'Absent'),
      'half-day': t('attendance.halfDay', 'Half Day'),
    };
    return (
      <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses] || 'status-present'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="attendance-management">
      <div className="page-header">
        <div>
          <h2>{t('attendance.title', 'Attendance Management')}</h2>
          <p className="page-subtitle">{t('attendance.subtitle', 'Daily civil service check-in, departure timestamps, and compliance ledger')}</p>
        </div>
        <div className="header-controls">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
            aria-label={t('attendance.dateFilter', 'Selected Date')}
          />
          <button className="btn-primary" onClick={handleAdd}>
            + {t('attendance.markAttendance', 'Log Attendance Record')}
          </button>
        </div>
      </div>

      <div className="attendance-stats">
        <div className="stat-box">
          <span className="stat-label">{t('attendance.presentCount', 'Present on Duty')}</span>
          <span className="stat-number">{filteredAttendance.filter((a) => a.status === 'present').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">{t('attendance.lateCount', 'Late Arrivals')}</span>
          <span className="stat-number">{filteredAttendance.filter((a) => a.status === 'late').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">{t('attendance.absentCount', 'Absences')}</span>
          <span className="stat-number">{filteredAttendance.filter((a) => a.status === 'absent').length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">{t('common.all', 'Total Logged')}</span>
          <span className="stat-number">{filteredAttendance.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading', 'Loading attendance...')}</div>
      ) : (
        <div className="attendance-table-container">
          <table className="attendance-table">
            <thead>
              <tr>
                <th>{t('attendance.employeeName', 'Staff Member')}</th>
                <th>{t('attendance.checkIn', 'Check In')}</th>
                <th>{t('attendance.checkOut', 'Check Out')}</th>
                <th>{t('attendance.hoursWorked', 'Hours Worked')}</th>
                <th>{t('attendance.status', 'Status')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="no-data-cell">
                    {t('attendance.noRecords', 'No attendance records recorded for this date')}
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="employee-name-cell">
                        <div className="employee-avatar">
                          {record.employeeName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        {record.employeeName}
                      </div>
                    </td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                    <td>{record.hoursWorked.toFixed(2)} hrs</td>
                    <td>{getStatusBadge(record.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('attendance.markAttendance', 'Log Attendance Record')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('attendance.employeeName', 'Employee')}</label>
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
                <label>{t('common.date', 'Date')}</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('attendance.checkIn', 'Check In')}</label>
                  <input
                    type="time"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('attendance.checkOut', 'Check Out')}</label>
                  <input
                    type="time"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('attendance.status', 'Status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Attendance['status'] })}
                  required
                >
                  <option value="present">{t('attendance.present', 'Present')}</option>
                  <option value="late">{t('attendance.late', 'Late')}</option>
                  <option value="absent">{t('attendance.absent', 'Absent')}</option>
                  <option value="half-day">{t('attendance.halfDay', 'Half Day')}</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  {t('common.cancel', 'Cancel')}
                </button>
                <button type="submit" className="btn-primary">
                  {t('common.save', 'Save Attendance')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
