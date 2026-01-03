import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BilingualText from '../BilingualText';
import { memberApi } from '../../services/libraryApi';
import type { Member } from '../../types/libraryTypes';
import './MemberManagement.css';

export default function MemberManagement() {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    membershipType: 'Student' as Member['membershipType'],
    status: 'Active' as Member['status'],
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await memberApi.getAll();
      setMembers(data);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadMembers();
      return;
    }
    try {
      setLoading(true);
      const results = await memberApi.search(searchQuery);
      setMembers(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await memberApi.update(editingMember.id, formData);
      } else {
        await memberApi.create({
          ...formData,
          membershipDate: new Date().toISOString().split('T')[0],
        });
      }
      setShowModal(false);
      resetForm();
      loadMembers();
    } catch (error: any) {
      console.error('Failed to save member:', error);
      const errorMessage = error?.message || 'Failed to save member. Please try again.';
      alert(errorMessage);
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      address: member.address,
      membershipType: member.membershipType,
      status: member.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('library.confirmDelete'))) return;
    try {
      await memberApi.delete(id);
      loadMembers();
    } catch (error: any) {
      console.error('Failed to delete member:', error);
      const errorMessage = error?.message || 'Failed to delete member. Please try again.';
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      membershipType: 'Student',
      status: 'Active',
    });
  };

  const getStatusBadgeClass = (status: Member['status']) => {
    switch (status) {
      case 'Active':
        return 'status-badge active';
      case 'Inactive':
        return 'status-badge inactive';
      case 'Suspended':
        return 'status-badge suspended';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="member-management">
      <div className="member-header">
        <h1><BilingualText translationKey="library.memberManagement" /></h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + <BilingualText translationKey="library.addNewMember" />
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={`${t('library.searchMemberPlaceholder', { lng: 'en' })} / ${t('library.searchMemberPlaceholder', { lng: 'am' })}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-secondary" onClick={handleSearch}>
          <BilingualText translationKey="common.search" />
        </button>
        {searchQuery && (
          <button className="btn btn-link" onClick={() => { setSearchQuery(''); loadMembers(); }}>
            <BilingualText translationKey="common.close" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading"><BilingualText translationKey="library.loadingMembers" /></div>
      ) : (
        <div className="members-table-container">
          <table className="members-table">
            <thead>
              <tr>
                <th><BilingualText translationKey="library.firstName" /> / <BilingualText translationKey="library.lastName" /></th>
                <th><BilingualText translationKey="library.email" /></th>
                <th><BilingualText translationKey="library.phone" /></th>
                <th><BilingualText translationKey="library.membershipType" /></th>
                <th><BilingualText translationKey="library.status" /></th>
                <th><BilingualText translationKey="library.membershipDate" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>{member.firstName} {member.lastName}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.membershipType}</td>
                  <td>
                    <span className={getStatusBadgeClass(member.status)}>
                      {member.status}
                    </span>
                  </td>
                  <td>{new Date(member.membershipDate).toLocaleDateString()}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon" onClick={() => handleEdit(member)} title="Edit">
                        ✏️
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(member.id)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {members.length === 0 && !loading && (
        <div className="empty-state"><BilingualText translationKey="library.noMembersFound" /></div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2><BilingualText translationKey={editingMember ? 'library.editMember' : 'library.addNewMember'} /></h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label><BilingualText translationKey="library.firstName" /> *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label><BilingualText translationKey="library.lastName" /> *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label><BilingualText translationKey="library.email" /> *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label><BilingualText translationKey="library.phone" /> *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label><BilingualText translationKey="library.address" /> *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><BilingualText translationKey="library.membershipType" /> *</label>
                  <select
                    required
                    value={formData.membershipType}
                    onChange={(e) => setFormData({ ...formData, membershipType: e.target.value as Member['membershipType'] })}
                  >
                    <option value="Student">{t('library.student', { lng: 'en' })} / {t('library.student', { lng: 'am' })}</option>
                    <option value="Faculty">{t('library.faculty', { lng: 'en' })} / {t('library.faculty', { lng: 'am' })}</option>
                    <option value="Staff">{t('library.staff', { lng: 'en' })} / {t('library.staff', { lng: 'am' })}</option>
                    <option value="Public">{t('library.public', { lng: 'en' })} / {t('library.public', { lng: 'am' })}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><BilingualText translationKey="library.status" /> *</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Member['status'] })}
                  >
                    <option value="Active">{t('library.active', { lng: 'en' })} / {t('library.active', { lng: 'am' })}</option>
                    <option value="Inactive">{t('library.inactive', { lng: 'en' })} / {t('library.inactive', { lng: 'am' })}</option>
                    <option value="Suspended">{t('library.suspended', { lng: 'en' })} / {t('library.suspended', { lng: 'am' })}</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  <BilingualText translationKey="library.cancel" />
                </button>
                <button type="submit" className="btn btn-primary">
                  <BilingualText translationKey={editingMember ? 'library.update' : 'library.add'} /> <BilingualText translationKey="library.member" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

