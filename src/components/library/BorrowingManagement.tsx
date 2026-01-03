import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BilingualText from '../BilingualText';
import { borrowingApi, bookApi, memberApi } from '../../services/libraryApi';
import type { Borrowing, Book, Member } from '../../types/libraryTypes';
import './BorrowingManagement.css';

export default function BorrowingManagement() {
  const { t } = useTranslation();
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowFormData, setBorrowFormData] = useState({
    bookId: '',
    memberId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [borrowingsData, booksData, membersData] = await Promise.all([
        borrowingApi.getAll(),
        bookApi.getAll(),
        memberApi.getAll(),
      ]);
      setBorrowings(borrowingsData);
      setBooks(booksData);
      setMembers(membersData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowFormData.bookId || !borrowFormData.memberId) {
      alert('Please select both a book and a member');
      return;
    }

    try {
      await borrowingApi.borrow(borrowFormData.bookId, borrowFormData.memberId);
      setShowBorrowModal(false);
      setBorrowFormData({ bookId: '', memberId: '' });
      loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to borrow book. Please try again.');
    }
  };

  const handleReturn = async (id: string) => {
    if (!confirm(t('library.confirmReturn'))) return;
    try {
      const result = await borrowingApi.return(id);
      if (result && result.fineAmount && result.fineAmount > 0) {
        alert(`${t('library.bookReturnedWithFine')} $${result.fineAmount.toFixed(2)}`);
      } else {
        alert(t('library.bookReturned'));
      }
      loadData();
    } catch (error: any) {
      console.error('Failed to return book:', error);
      const errorMessage = error?.message || 'Failed to return book. Please try again.';
      alert(errorMessage);
    }
  };

  const getStatusBadgeClass = (status: Borrowing['status'], dueDate: string) => {
    if (status === 'Returned') {
      return 'status-badge returned';
    }
    const due = new Date(dueDate);
    const today = new Date();
    if (due < today) {
      return 'status-badge overdue';
    }
    return 'status-badge borrowed';
  };

  const getStatusText = (status: Borrowing['status'], dueDate: string) => {
    if (status === 'Returned') {
      return t('library.returned');
    }
    const due = new Date(dueDate);
    const today = new Date();
    if (due < today) {
      return t('library.overdue');
    }
    return t('library.borrowed');
  };

  const availableBooks = books.filter(b => b.availableCopies > 0);
  const activeMembers = members.filter(m => m.status === 'Active');

  return (
    <div className="borrowing-management">
      <div className="borrowing-header">
        <h1><BilingualText translationKey="library.borrowingManagement" /></h1>
        <button className="btn btn-primary" onClick={() => setShowBorrowModal(true)}>
          + <BilingualText translationKey="library.borrowBook" />
        </button>
      </div>

      {loading ? (
        <div className="loading"><BilingualText translationKey="library.loadingBorrowings" /></div>
      ) : (
        <div className="borrowings-table-container">
          <table className="borrowings-table">
            <thead>
              <tr>
                <th><BilingualText translationKey="library.book" /></th>
                <th><BilingualText translationKey="library.member" /></th>
                <th><BilingualText translationKey="library.borrowDate" /></th>
                <th><BilingualText translationKey="library.dueDate" /></th>
                <th><BilingualText translationKey="library.returnDate" /></th>
                <th><BilingualText translationKey="library.status" /></th>
                <th><BilingualText translationKey="library.fine" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map(borrowing => (
                <tr key={borrowing.id}>
                  <td>{borrowing.bookTitle}</td>
                  <td>{borrowing.memberName}</td>
                  <td>{new Date(borrowing.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(borrowing.dueDate).toLocaleDateString()}</td>
                  <td>{borrowing.returnDate ? new Date(borrowing.returnDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={getStatusBadgeClass(borrowing.status, borrowing.dueDate)}>
                      {getStatusText(borrowing.status, borrowing.dueDate)}
                    </span>
                  </td>
                  <td>
                    {borrowing.fineAmount ? `$${borrowing.fineAmount.toFixed(2)}` : '-'}
                  </td>
                  <td>
                    {borrowing.status === 'Borrowed' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleReturn(borrowing.id)}
                      >
                        <BilingualText translationKey="library.returnBook" />
                      </button>
                    )}
                    {borrowing.status === 'Returned' && (
                      <span className="text-muted"><BilingualText translationKey="library.returned" /></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {borrowings.length === 0 && !loading && (
        <div className="empty-state"><BilingualText translationKey="library.noBorrowingsFound" /></div>
      )}

      {showBorrowModal && (
        <div className="modal-overlay" onClick={() => { setShowBorrowModal(false); setBorrowFormData({ bookId: '', memberId: '' }); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2><BilingualText translationKey="library.borrowBook" /></h2>
            <form onSubmit={handleBorrow}>
              <div className="form-group">
                <label><BilingualText translationKey="library.selectBook" /> *</label>
                <select
                  required
                  value={borrowFormData.bookId}
                  onChange={(e) => setBorrowFormData({ ...borrowFormData, bookId: e.target.value })}
                >
                  <option value=""><BilingualText translationKey="library.chooseBook" /></option>
                  {availableBooks.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author} ({book.availableCopies} available)
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label><BilingualText translationKey="library.selectMember" /> *</label>
                <select
                  required
                  value={borrowFormData.memberId}
                  onChange={(e) => setBorrowFormData({ ...borrowFormData, memberId: e.target.value })}
                >
                  <option value=""><BilingualText translationKey="library.chooseMember" /></option>
                  {activeMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} ({member.membershipType})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setShowBorrowModal(false); setBorrowFormData({ bookId: '', memberId: '' }); }}
                >
                  <BilingualText translationKey="library.cancel" />
                </button>
                <button type="submit" className="btn btn-primary">
                  <BilingualText translationKey="library.borrowBook" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

