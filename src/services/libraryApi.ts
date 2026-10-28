import type { Book, Member, Borrowing, LibraryStats } from '../types/libraryTypes';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

const STORAGE_KEY_BOOKS = 'library_books_data';
const STORAGE_KEY_MEMBERS = 'library_members_data';
const STORAGE_KEY_BORROWINGS = 'library_borrowings_data';

// Default initial dataset
const initialBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    category: 'Fiction',
    publishedYear: 1925,
    publisher: 'Scribner',
    totalCopies: 5,
    availableCopies: 3,
    description: 'A classic American novel about the Jazz Age.',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    category: 'Fiction',
    publishedYear: 1960,
    publisher: 'J.B. Lippincott & Co.',
    totalCopies: 4,
    availableCopies: 2,
    description: 'A gripping tale of racial injustice and childhood innocence.',
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-28423-4',
    category: 'Dystopian Fiction',
    publishedYear: 1949,
    publisher: 'Secker & Warburg',
    totalCopies: 6,
    availableCopies: 3,
    description: 'A dystopian social science fiction novel.',
  },
  {
    id: '4',
    title: 'Fikir Eske Mekabir (ፍቅር እስከ መቃብር)',
    author: 'Haddis Alemayehu',
    isbn: '978-1-56902-123-4',
    category: 'Ethiopian Literature',
    publishedYear: 1968,
    publisher: 'Berhanena Selam',
    totalCopies: 5,
    availableCopies: 4,
    description: 'A masterpiece of modern Amharic literature capturing romantic and social realities.',
  },
  {
    id: '5',
    title: 'Oromia & The Horn of Africa',
    author: 'Asafa Jalata',
    isbn: '978-0-932415-94-3',
    category: 'History & Society',
    publishedYear: 1998,
    publisher: 'The Red Sea Press',
    totalCopies: 3,
    availableCopies: 3,
    description: 'An insightful exploration of the history, society, and identity in the Horn of Africa.',
  },
  {
    id: '6',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    isbn: '978-0-13-235088-4',
    category: 'Technology',
    publishedYear: 2008,
    publisher: 'Prentice Hall',
    totalCopies: 5,
    availableCopies: 4,
    description: 'A comprehensive guide to writing clean, maintainable, and readable code.',
  },
];

const initialMembers: Member[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+251-911-010101',
    address: 'Bole Subcity, Addis Ababa',
    membershipDate: '2023-01-15',
    membershipType: 'Student',
    status: 'Active',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+251-912-020202',
    address: 'Campus Main Staff Quarters, Woliso',
    membershipDate: '2023-03-20',
    membershipType: 'Faculty',
    status: 'Active',
  },
  {
    id: '3',
    firstName: 'Chaltu',
    lastName: 'Tolosa',
    email: 'chaltu.tolosa@example.com',
    phone: '+251-914-040404',
    address: 'Ambo University Campus',
    membershipDate: '2023-09-10',
    membershipType: 'Student',
    status: 'Active',
  },
  {
    id: '4',
    firstName: 'Abebe',
    lastName: 'Bikila',
    email: 'abebe.bikila@example.com',
    phone: '+251-915-050505',
    address: 'Arada Subcity, Addis Ababa',
    membershipDate: '2023-11-01',
    membershipType: 'Staff',
    status: 'Active',
  },
];

const initialBorrowings: Borrowing[] = [
  {
    id: '1',
    bookId: '1',
    bookTitle: 'The Great Gatsby',
    memberId: '1',
    memberName: 'John Doe',
    borrowDate: '2024-01-10',
    dueDate: '2024-01-24',
    status: 'Borrowed',
  },
  {
    id: '2',
    bookId: '2',
    bookTitle: 'To Kill a Mockingbird',
    memberId: '2',
    memberName: 'Jane Smith',
    borrowDate: '2024-01-05',
    dueDate: '2024-01-19',
    status: 'Borrowed',
  },
  {
    id: '3',
    bookId: '3',
    bookTitle: '1984',
    memberId: '3',
    memberName: 'Chaltu Tolosa',
    borrowDate: '2024-01-02',
    dueDate: '2024-01-16',
    status: 'Overdue',
    fineAmount: 4.50,
  },
];

// Helper to initialize and retrieve localStorage data
const getLocalBooks = (): Book[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(initialBooks));
      return initialBooks;
    }
    return JSON.parse(raw);
  } catch {
    return initialBooks;
  }
};

const saveLocalBooks = (books: Book[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save books locally', e);
  }
};

const getLocalMembers = (): Member[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(initialMembers));
      return initialMembers;
    }
    return JSON.parse(raw);
  } catch {
    return initialMembers;
  }
};

const saveLocalMembers = (members: Member[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members locally', e);
  }
};

const getLocalBorrowings = (): Borrowing[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BORROWINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BORROWINGS, JSON.stringify(initialBorrowings));
      return initialBorrowings;
    }
    return JSON.parse(raw);
  } catch {
    return initialBorrowings;
  }
};

const saveLocalBorrowings = (borrowings: Borrowing[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_BORROWINGS, JSON.stringify(borrowings));
  } catch (e) {
    console.error('Failed to save borrowings locally', e);
  }
};

// Calculate stats from local arrays
const calculateStats = (books: Book[], members: Member[], borrowings: Borrowing[]): LibraryStats => {
  const categories = new Set(books.map(b => b.category.trim()).filter(Boolean));
  const borrowed = borrowings.filter(b => b.status === 'Borrowed' || b.status === 'Overdue').length;
  const today = new Date();
  
  const overdue = borrowings.filter(b => {
    if (b.status === 'Returned') return false;
    const dueDate = new Date(b.dueDate);
    return dueDate < today;
  }).length;

  return {
    totalBooks: books.length,
    totalMembers: members.length,
    borrowedBooks: borrowed,
    overdueBooks: overdue,
    availableBooks: books.reduce((sum, b) => sum + (Number(b.availableCopies) || 0), 0),
    totalCategories: categories.size,
  };
};

// Helper for API calls with timeout
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for graceful fallback

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    // If server returned non-JSON (like Vercel HTML rewrite)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response from server');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Books API
export const bookApi = {
  getAll: async (): Promise<Book[]> => {
    try {
      const data = await apiCall<Book[]>('/books');
      if (Array.isArray(data)) {
        saveLocalBooks(data);
        return data;
      }
    } catch {
      // Backend unavailable, fallback to localStorage
    }
    return getLocalBooks();
  },

  getById: async (id: string): Promise<Book | null> => {
    try {
      return await apiCall<Book>(`/books/${id}`);
    } catch {
      const books = getLocalBooks();
      return books.find(b => b.id === id) || null;
    }
  },

  create: async (book: Omit<Book, 'id'>): Promise<Book> => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      availableCopies: book.totalCopies,
    };

    try {
      const created = await apiCall<Book>('/books', {
        method: 'POST',
        body: JSON.stringify(book),
      });
      const books = getLocalBooks();
      books.push(created);
      saveLocalBooks(books);
      return created;
    } catch {
      const books = getLocalBooks();
      books.push(newBook);
      saveLocalBooks(books);
      return newBook;
    }
  },

  update: async (id: string, updates: Partial<Book>): Promise<Book | null> => {
    try {
      const updated = await apiCall<Book>(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      const books = getLocalBooks();
      const idx = books.findIndex(b => b.id === id);
      if (idx !== -1) {
        books[idx] = updated;
        saveLocalBooks(books);
      }
      return updated;
    } catch {
      const books = getLocalBooks();
      const idx = books.findIndex(b => b.id === id);
      if (idx === -1) return null;
      
      const old = books[idx];
      const newTotal = updates.totalCopies !== undefined ? updates.totalCopies : old.totalCopies;
      const borrowed = old.totalCopies - old.availableCopies;
      const newAvail = Math.max(0, newTotal - borrowed);

      const updatedBook: Book = {
        ...old,
        ...updates,
        totalCopies: newTotal,
        availableCopies: newAvail,
      };
      books[idx] = updatedBook;
      saveLocalBooks(books);
      return updatedBook;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    // Check if book has active borrowings locally
    const borrowings = getLocalBorrowings();
    const isBorrowed = borrowings.some(b => b.bookId === id && b.status === 'Borrowed');
    if (isBorrowed) {
      throw new Error('Cannot delete book that is currently borrowed');
    }

    try {
      await apiCall(`/books/${id}`, { method: 'DELETE' });
    } catch {
      // Backend offline, proceed with local delete
    }

    const books = getLocalBooks().filter(b => b.id !== id);
    saveLocalBooks(books);
    return true;
  },

  search: async (query: string): Promise<Book[]> => {
    try {
      const results = await apiCall<Book[]>(`/books?search=${encodeURIComponent(query)}`);
      if (Array.isArray(results)) return results;
    } catch {
      // Fallback to local search
    }

    const books = getLocalBooks();
    const q = query.toLowerCase().trim();
    if (!q) return books;
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  },
};

// Members API
export const memberApi = {
  getAll: async (): Promise<Member[]> => {
    try {
      const data = await apiCall<Member[]>('/members');
      if (Array.isArray(data)) {
        saveLocalMembers(data);
        return data;
      }
    } catch {
      // Fallback to local
    }
    return getLocalMembers();
  },

  getById: async (id: string): Promise<Member | null> => {
    try {
      return await apiCall<Member>(`/members/${id}`);
    } catch {
      const members = getLocalMembers();
      return members.find(m => m.id === id) || null;
    }
  },

  create: async (member: Omit<Member, 'id'>): Promise<Member> => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      membershipDate: member.membershipDate || new Date().toISOString().split('T')[0],
      status: member.status || 'Active',
    };

    try {
      const created = await apiCall<Member>('/members', {
        method: 'POST',
        body: JSON.stringify(member),
      });
      const members = getLocalMembers();
      members.push(created);
      saveLocalMembers(members);
      return created;
    } catch {
      const members = getLocalMembers();
      // Check if email exists
      if (members.some(m => m.email.toLowerCase() === member.email.toLowerCase())) {
        throw new Error('A member with this email address already exists');
      }
      members.push(newMember);
      saveLocalMembers(members);
      return newMember;
    }
  },

  update: async (id: string, updates: Partial<Member>): Promise<Member | null> => {
    try {
      const updated = await apiCall<Member>(`/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      const members = getLocalMembers();
      const idx = members.findIndex(m => m.id === id);
      if (idx !== -1) {
        members[idx] = updated;
        saveLocalMembers(members);
      }
      return updated;
    } catch {
      const members = getLocalMembers();
      const idx = members.findIndex(m => m.id === id);
      if (idx === -1) return null;

      const updatedMember = { ...members[idx], ...updates };
      members[idx] = updatedMember;
      saveLocalMembers(members);
      return updatedMember;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    // Check if member has active borrowings
    const borrowings = getLocalBorrowings();
    const hasActive = borrowings.some(b => b.memberId === id && b.status === 'Borrowed');
    if (hasActive) {
      throw new Error('Cannot delete member with active borrowed books');
    }

    try {
      await apiCall(`/members/${id}`, { method: 'DELETE' });
    } catch {
      // Offline fallback
    }

    const members = getLocalMembers().filter(m => m.id !== id);
    saveLocalMembers(members);
    return true;
  },

  search: async (query: string): Promise<Member[]> => {
    try {
      const results = await apiCall<Member[]>(`/members?search=${encodeURIComponent(query)}`);
      if (Array.isArray(results)) return results;
    } catch {
      // Offline fallback
    }

    const members = getLocalMembers();
    const q = query.toLowerCase().trim();
    if (!q) return members;
    return members.filter(m =>
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.includes(q)
    );
  },
};

// Borrowings API
export const borrowingApi = {
  getAll: async (): Promise<Borrowing[]> => {
    try {
      const data = await apiCall<Borrowing[]>('/borrowings');
      if (Array.isArray(data)) {
        saveLocalBorrowings(data);
        return data;
      }
    } catch {
      // Offline fallback
    }
    return getLocalBorrowings();
  },

  getByMember: async (memberId: string): Promise<Borrowing[]> => {
    try {
      return await apiCall<Borrowing[]>(`/borrowings/member/${memberId}`);
    } catch {
      return getLocalBorrowings().filter(b => b.memberId === memberId);
    }
  },

  getByBook: async (bookId: string): Promise<Borrowing[]> => {
    try {
      return await apiCall<Borrowing[]>(`/borrowings/book/${bookId}`);
    } catch {
      return getLocalBorrowings().filter(b => b.bookId === bookId);
    }
  },

  borrow: async (bookId: string, memberId: string): Promise<Borrowing> => {
    try {
      const created = await apiCall<Borrowing>('/borrowings', {
        method: 'POST',
        body: JSON.stringify({ bookId, memberId }),
      });
      const list = getLocalBorrowings();
      list.unshift(created);
      saveLocalBorrowings(list);
      return created;
    } catch {
      // Fallback local logic
      const books = getLocalBooks();
      const members = getLocalMembers();
      const book = books.find(b => b.id === bookId);
      const member = members.find(m => m.id === memberId);

      if (!book) throw new Error('Book not found');
      if (!member) throw new Error('Member not found');
      if (member.status !== 'Active') throw new Error('Member account is not active');
      if (book.availableCopies <= 0) throw new Error('No copies available for borrowing');

      const borrowings = getLocalBorrowings();
      const alreadyBorrowed = borrowings.some(
        b => b.bookId === bookId && b.memberId === memberId && b.status === 'Borrowed'
      );
      if (alreadyBorrowed) {
        throw new Error('Member currently has this book borrowed');
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const newBorrowing: Borrowing = {
        id: Date.now().toString(),
        bookId,
        bookTitle: book.title,
        memberId,
        memberName: `${member.firstName} ${member.lastName}`,
        borrowDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'Borrowed',
      };

      // Decrement available copies
      book.availableCopies = Math.max(0, book.availableCopies - 1);
      saveLocalBooks(books);

      borrowings.unshift(newBorrowing);
      saveLocalBorrowings(borrowings);
      return newBorrowing;
    }
  },

  return: async (borrowingId: string): Promise<Borrowing | null> => {
    try {
      const res = await apiCall<Borrowing>(`/borrowings/${borrowingId}/return`, {
        method: 'PUT',
      });
      const borrowings = getLocalBorrowings();
      const idx = borrowings.findIndex(b => b.id === borrowingId);
      if (idx !== -1) {
        borrowings[idx] = res;
        saveLocalBorrowings(borrowings);
      }
      return res;
    } catch {
      const borrowings = getLocalBorrowings();
      const idx = borrowings.findIndex(b => b.id === borrowingId);
      if (idx === -1) return null;

      const record = borrowings[idx];
      if (record.status === 'Returned') {
        throw new Error('Book has already been returned');
      }

      const returnDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(record.dueDate);
      const returnDateObj = new Date(returnDate);

      let fineAmount = 0;
      if (returnDateObj > dueDate) {
        const daysOverdue = Math.ceil((returnDateObj.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        fineAmount = daysOverdue * 0.50;
      }

      const updatedRecord: Borrowing = {
        ...record,
        returnDate,
        status: 'Returned',
        fineAmount: fineAmount > 0 ? fineAmount : undefined,
      };

      borrowings[idx] = updatedRecord;
      saveLocalBorrowings(borrowings);

      // Restore book copy
      const books = getLocalBooks();
      const bookIdx = books.findIndex(b => b.id === record.bookId);
      if (bookIdx !== -1) {
        books[bookIdx].availableCopies = Math.min(books[bookIdx].totalCopies, books[bookIdx].availableCopies + 1);
        saveLocalBooks(books);
      }

      return updatedRecord;
    }
  },
};

// Stats API
export const statsApi = {
  getStats: async (): Promise<LibraryStats> => {
    try {
      const stats = await apiCall<LibraryStats>('/stats');
      if (stats && typeof stats.totalBooks === 'number') {
        return stats;
      }
    } catch {
      // Offline fallback
    }

    const books = getLocalBooks();
    const members = getLocalMembers();
    const borrowings = getLocalBorrowings();
    return calculateStats(books, members, borrowings);
  },
};
