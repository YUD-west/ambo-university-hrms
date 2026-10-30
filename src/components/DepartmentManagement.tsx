import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Department } from '../types/hrTypes';
import { hrApi } from '../services/api';
import './DepartmentManagement.css';

const DepartmentManagement = () => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Partial<Department>>({
    name: '',
    description: '',
    managerId: '',
    managerName: '',
    employeeCount: 0,
    budget: 0
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await hrApi.getDepartments();
      if (response.success && response.data) {
        const depts = Array.isArray(response.data) ? response.data : [];
        setDepartments(depts);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    setFormData({
      name: '',
      description: '',
      managerId: '',
      managerName: '',
      employeeCount: 0,
      budget: 0
    });
    setShowModal(true);
  };

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData(department);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('home.deleteConfirm'))) {
      try {
        const response = await hrApi.deleteDepartment(id);
        if (response.success) {
          await fetchDepartments();
        } else {
          alert(response.message || 'Failed to delete department');
        }
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        const response = await hrApi.updateDepartment(editingDepartment.id, formData);
        if (response.success) {
          await fetchDepartments();
          setShowModal(false);
        } else {
          alert(response.message || 'Failed to update department');
        }
      } else {
        const response = await hrApi.createDepartment(formData);
        if (response.success) {
          await fetchDepartments();
          setShowModal(false);
        } else {
          alert(response.message || 'Failed to create department');
        }
      }
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Failed to save department');
    }
  };

  return (
    <div className="department-management">
      <div className="page-header">
        <h2>{t('departments.title')}</h2>
        <button className="btn-primary" onClick={handleAdd}>
          + {t('departments.addDepartment')}
        </button>
      </div>

      {loading ? (
        <div className="loading">{t('common.loading')}</div>
      ) : (
        <div className="departments-grid">
          {departments.map((department) => (
          <div key={department.id} className="department-card">
            <div className="department-header">
              <h3>{department.name}</h3>
              <div className="department-actions">
                <button className="btn-edit" onClick={() => handleEdit(department)}>
                  {t('common.edit')}
                </button>
                <button className="btn-delete" onClick={() => handleDelete(department.id)}>
                  {t('common.delete')}
                </button>
              </div>
            </div>
            <p className="department-description">{department.description}</p>
            <div className="department-details">
              <div className="detail-item">
                <span className="detail-label">{t('departments.managerName')}:</span>
                <span className="detail-value">{department.managerName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('departments.employeeCount')}:</span>
                <span className="detail-value">{department.employeeCount}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('departments.budget')}:</span>
                <span className="detail-value">$department.budget.toLocaleString() ETB</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingDepartment ? t('departments.editDepartment') : t('departments.addDepartment')}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('departments.name')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('departments.description')}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('departments.managerName')}</label>
                  <input
                    type="text"
                    value={formData.managerName}
                    onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('departments.managerName')} ID</label>
                  <input
                    type="text"
                    value={formData.managerId}
                    onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('departments.employeeCount')}</label>
                  <input
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('departments.budget')}</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn-primary">
                  {editingDepartment ? t('common.save') : t('common.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;

