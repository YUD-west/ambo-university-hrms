import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employee } from '../types/hrTypes';
import { hrApi } from '../services/api';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hireDate: '',
    salary: 0,
    status: 'active'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await hrApi.getEmployees();
      if (response.success && response.data) {
        const employeesList = Array.isArray(response.data) ? response.data : [];
        setEmployees(employeesList);
        setFilteredEmployees(employeesList);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = employees.filter(emp =>
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      hireDate: '',
      salary: 0,
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData(employee);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('home.deleteConfirm'))) {
      try {
        const response = await hrApi.deleteEmployee(id);
        if (response.success) {
          await fetchEmployees();
        } else {
          alert(response.message || 'Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        const response = await hrApi.updateEmployee(editingEmployee.id, formData);
        if (response.success) {
          await fetchEmployees();
          setShowModal(false);
        } else {
          alert(response.message || 'Failed to update employee');
        }
      } else {
        const response = await hrApi.createEmployee(formData);
        if (response.success) {
          await fetchEmployees();
          setShowModal(false);
        } else {
          alert(response.message || 'Failed to create employee');
        }
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'status-active',
      inactive: 'status-inactive',
      'on-leave': 'status-leave'
    };
    const statusLabels: Record<string, string> = {
      active: t('employees.active'),
      inactive: t('employees.inactive'),
      'on-leave': t('employees.onLeave')
    };
    return <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>{statusLabels[status] || status}</span>;
  };

  return (
    <div className="employee-management">
      <div className="page-header">
        <h2>{t('employees.title')}</h2>
        <button className="btn-primary" onClick={handleAdd}>
          + {t('employees.addEmployee')}
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : (
        <div className="employee-table-container">
          <table className="employee-table">
          <thead>
            <tr>
              <th>{t('employees.firstName')}</th>
              <th>{t('employees.email')}</th>
              <th>{t('employees.position')}</th>
              <th>{t('employees.department')}</th>
              <th>{t('employees.hireDate')}</th>
              <th>{t('employees.salary')}</th>
              <th>{t('employees.status')}</th>
              <th>{t('common.actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="employee-name-cell">
                    <div className="employee-avatar">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    {employee.firstName} {employee.lastName}
                  </div>
                </td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{new Date(employee.hireDate).toLocaleDateString()}</td>
                <td>$employee.salary.toLocaleString() ETB</td>
                <td>{getStatusBadge(employee.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" onClick={() => handleEdit(employee)}>
                      {t('common.edit')}
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(employee.id)}>
                      {t('common.delete')}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingEmployee ? t('employees.editEmployee') : t('employees.addEmployee')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('employees.firstName')}</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('employees.lastName')}</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('employees.email')}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('employees.phone')}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('employees.position')}</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('employees.department')}</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  >
                    <option value="">{t('departments.name')}</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Product">Product</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('employees.hireDate')}</label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('employees.salary')}</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('employees.status')}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                  required
                >
                  <option value="active">{t('employees.active')}</option>
                  <option value="inactive">{t('employees.inactive')}</option>
                  <option value="on-leave">{t('employees.onLeave')}</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn-primary">
                  {editingEmployee ? t('common.save') : t('common.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;

