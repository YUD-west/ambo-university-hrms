import type { Book, Member, Borrowing, LibraryStats } from '../types/libraryTypes';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

// Helper function for API calls
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    // Don't log network errors in production
    if (error.message && !error.message.includes('Failed to fetch')) {
      console.error('API call failed:', error);
    }
    throw error;
  }
};

// Books API
export const bookApi = {
  getAll: async (): Promise<Book[]> => {
    return apiCall<Book[]>('/books');
  },

  getById: async (id: string): Promise<Book | null> => {
    try {
      return await apiCall<Book>(`/books/${id}`);
    } catch (error) {
      return null;
    }
  },

  create: async (book: Omit<Book, 'id'>): Promise<Book> => {
    return apiCall<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  },

  update: async (id: string, book: Partial<Book>): Promise<Book | null> => {
    try {
      return await apiCall<Book>(`/books/${id}`, {
        method: 'PUT',
        body: JSON.stringify(book),
      });
    } catch (error) {
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await apiCall(`/books/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  search: async (query: string): Promise<Book[]> => {
    return apiCall<Book[]>(`/books?search=${encodeURIComponent(query)}`);
  },
};

// Members API
export const memberApi = {
  getAll: async (): Promise<Member[]> => {
    return apiCall<Member[]>('/members');
  },

  getById: async (id: string): Promise<Member | null> => {
    try {
      return await apiCall<Member>(`/members/${id}`);
    } catch (error) {
      return null;
    }
  },

  create: async (member: Omit<Member, 'id'>): Promise<Member> => {
    return apiCall<Member>('/members', {
      method: 'POST',
      body: JSON.stringify(member),
    });
  },

  update: async (id: string, member: Partial<Member>): Promise<Member | null> => {
    try {
      return await apiCall<Member>(`/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(member),
      });
    } catch (error) {
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await apiCall(`/members/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  search: async (query: string): Promise<Member[]> => {
    return apiCall<Member[]>(`/members?search=${encodeURIComponent(query)}`);
  },
};

// Borrowings API
export const borrowingApi = {
  getAll: async (): Promise<Borrowing[]> => {
    return apiCall<Borrowing[]>('/borrowings');
  },

  getByMember: async (memberId: string): Promise<Borrowing[]> => {
    return apiCall<Borrowing[]>(`/borrowings/member/${memberId}`);
  },

  getByBook: async (bookId: string): Promise<Borrowing[]> => {
    return apiCall<Borrowing[]>(`/borrowings/book/${bookId}`);
  },

  borrow: async (bookId: string, memberId: string): Promise<Borrowing> => {
    return apiCall<Borrowing>('/borrowings', {
      method: 'POST',
      body: JSON.stringify({ bookId, memberId }),
    });
  },

  return: async (borrowingId: string): Promise<Borrowing | null> => {
    try {
      return await apiCall<Borrowing>(`/borrowings/${borrowingId}/return`, {
        method: 'PUT',
      });
    } catch (error) {
      return null;
    }
  },
};

// Stats API
export const statsApi = {
  getStats: async (): Promise<LibraryStats> => {
    return apiCall<LibraryStats>('/stats');
  },
};

