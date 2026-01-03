export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishedYear: number;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  coverImage?: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: string;
  membershipType: 'Student' | 'Faculty' | 'Staff' | 'Public';
  status: 'Active' | 'Inactive' | 'Suspended';
}

export interface Borrowing {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Borrowed' | 'Returned' | 'Overdue';
  fineAmount?: number;
}

export interface LibraryStats {
  totalBooks: number;
  totalMembers: number;
  borrowedBooks: number;
  overdueBooks: number;
  availableBooks: number;
  totalCategories: number;
}

