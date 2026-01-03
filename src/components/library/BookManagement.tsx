import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BilingualText from '../BilingualText';
import { bookApi } from '../../services/libraryApi';
import type { Book } from '../../types/libraryTypes';
import './BookManagement.css';

export default function BookManagement() {
  const { t } = useTranslation();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishedYear: new Date().getFullYear(),
    publisher: '',
    totalCopies: 1,
    description: '',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await bookApi.getAll();
      setBooks(data);
    } catch (error) {
      console.error('Failed to load books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadBooks();
      return;
    }
    try {
      setLoading(true);
      const results = await bookApi.search(searchQuery);
      setBooks(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await bookApi.update(editingBook.id, formData);
      } else {
        await bookApi.create({
          ...formData,
          availableCopies: formData.totalCopies,
        });
      }
      setShowModal(false);
      resetForm();
      loadBooks();
    } catch (error: any) {
      console.error('Failed to save book:', error);
      const errorMessage = error?.message || t('library.failedToSave');
      alert(errorMessage);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publishedYear: book.publishedYear,
      publisher: book.publisher,
      totalCopies: book.totalCopies,
      description: book.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('library.confirmDelete'))) return;
    try {
      await bookApi.delete(id);
      loadBooks();
    } catch (error: any) {
      console.error('Failed to delete book:', error);
      const errorMessage = error?.message || t('library.failedToDelete');
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      publishedYear: new Date().getFullYear(),
      publisher: '',
      totalCopies: 1,
      description: '',
    });
  };

  const filteredBooks = books.filter(book => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.includes(query) ||
      book.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="book-management">
      <div className="book-header">
        <h1><BilingualText translationKey="library.bookManagement" /></h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + <BilingualText translationKey="library.addNewBook" />
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder={`${t('library.searchPlaceholder', { lng: 'en' })} / ${t('library.searchPlaceholder', { lng: 'am' })}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn btn-secondary" onClick={handleSearch}>
          <BilingualText translationKey="common.search" />
        </button>
        {searchQuery && (
          <button className="btn btn-link" onClick={() => { setSearchQuery(''); loadBooks(); }}>
            {t('common.close')}
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading"><BilingualText translationKey="library.loadingBooks" /></div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-card-header">
                <h3>{book.title}</h3>
                <div className="book-actions">
                  <button className="btn-icon" onClick={() => handleEdit(book)} title={t('common.edit')}>
                    ✏️
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(book.id)} title={t('common.delete')}>
                    🗑️
                  </button>
                </div>
              </div>
              <p className="book-author">by {book.author}</p>
              <div className="book-details">
                <div className="book-detail-item">
                  <span className="label"><BilingualText translationKey="library.isbn" />:</span>
                  <span>{book.isbn}</span>
                </div>
                <div className="book-detail-item">
                  <span className="label"><BilingualText translationKey="library.category" />:</span>
                  <span>{book.category}</span>
                </div>
                <div className="book-detail-item">
                  <span className="label"><BilingualText translationKey="library.publisher" />:</span>
                  <span>{book.publisher}</span>
                </div>
                <div className="book-detail-item">
                  <span className="label"><BilingualText translationKey="library.publishedYear" />:</span>
                  <span>{book.publishedYear}</span>
                </div>
                <div className="book-detail-item">
                  <span className="label"><BilingualText translationKey="library.totalCopies" />:</span>
                  <span>{book.availableCopies} / {book.totalCopies} <BilingualText translationKey="library.availableCopies" /></span>
                </div>
              </div>
              {book.description && (
                <p className="book-description">{book.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredBooks.length === 0 && !loading && (
        <div className="empty-state"><BilingualText translationKey="library.noBooksFound" /></div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2><BilingualText translationKey={editingBook ? 'library.editBook' : 'library.addNewBook'} /></h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label><BilingualText translationKey="library.bookTitle" /> *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label><BilingualText translationKey="library.author" /> *</label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><BilingualText translationKey="library.isbn" /> *</label>
                  <input
                    type="text"
                    required
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label><BilingualText translationKey="library.category" /> *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label><BilingualText translationKey="library.publisher" /> *</label>
                  <input
                    type="text"
                    required
                    value={formData.publisher}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label><BilingualText translationKey="library.publishedYear" /> *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    max={new Date().getFullYear()}
                    value={formData.publishedYear}
                    onChange={(e) => setFormData({ ...formData, publishedYear: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label><BilingualText translationKey="library.totalCopies" /> *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalCopies}
                  onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label><BilingualText translationKey="library.description" /></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  <BilingualText translationKey="library.cancel" />
                </button>
                <button type="submit" className="btn btn-primary">
                  <BilingualText translationKey={editingBook ? 'library.update' : 'library.add'} /> <BilingualText translationKey="library.book" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

