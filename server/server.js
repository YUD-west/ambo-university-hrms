import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize data file if it doesn't exist
const initializeData = () => {
  if (!existsSync(DATA_FILE)) {
    const initialData = {
      books: [
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
          availableCopies: 4,
          description: 'A dystopian social science fiction novel.',
        },
      ],
      members: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '555-0101',
          address: '123 Main St, City, State 12345',
          membershipDate: '2023-01-15',
          membershipType: 'Student',
          status: 'Active',
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          phone: '555-0102',
          address: '456 Oak Ave, City, State 12345',
          membershipDate: '2023-03-20',
          membershipType: 'Faculty',
          status: 'Active',
        },
      ],
      borrowings: [
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
          memberId: '1',
          memberName: 'John Doe',
          borrowDate: '2024-01-05',
          dueDate: '2024-01-19',
          status: 'Borrowed',
        },
      ],
    };
    writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Read data from file
const readData = () => {
  try {
    const data = readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { books: [], members: [], borrowings: [] };
  }
};

// Write data to file
const writeData = (data) => {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
};

// Initialize data on startup
initializeData();

// Helper function to generate ID
const generateId = () => Date.now().toString();

// ==================== BOOKS ROUTES ====================

// Get all books
app.get('/api/books', (req, res) => {
  try {
    const data = readData();
    const { search } = req.query;
    
    let books = data.books;
    
    if (search) {
      const query = search.toLowerCase();
      books = books.filter(
        b =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.isbn.includes(query) ||
          b.category.toLowerCase().includes(query)
      );
    }
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book by ID
app.get('/api/books/:id', (req, res) => {
  try {
    const data = readData();
    const book = data.books.find(b => b.id === req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Create book
app.post('/api/books', (req, res) => {
  try {
    const data = readData();
    const { title, author, isbn, category, publishedYear, publisher, totalCopies, description } = req.body;
    
    if (!title || !author || !isbn || !category || !publisher || !totalCopies) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newBook = {
      id: generateId(),
      title,
      author,
      isbn,
      category,
      publishedYear: parseInt(publishedYear) || new Date().getFullYear(),
      publisher,
      totalCopies: parseInt(totalCopies) || 1,
      availableCopies: parseInt(totalCopies) || 1,
      description: description || '',
    };
    
    data.books.push(newBook);
    writeData(data);
    
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Update book
app.put('/api/books/:id', (req, res) => {
  try {
    const data = readData();
    const bookIndex = data.books.findIndex(b => b.id === req.params.id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const book = data.books[bookIndex];
    const { title, author, isbn, category, publishedYear, publisher, totalCopies, description } = req.body;
    
    // Calculate available copies if total copies changed
    const oldTotalCopies = book.totalCopies;
    const newTotalCopies = totalCopies ? parseInt(totalCopies) : oldTotalCopies;
    const borrowedCopies = oldTotalCopies - book.availableCopies;
    const newAvailableCopies = Math.max(0, newTotalCopies - borrowedCopies);
    
    data.books[bookIndex] = {
      ...book,
      ...(title && { title }),
      ...(author && { author }),
      ...(isbn && { isbn }),
      ...(category && { category }),
      ...(publishedYear && { publishedYear: parseInt(publishedYear) }),
      ...(publisher && { publisher }),
      ...(totalCopies && { totalCopies: newTotalCopies, availableCopies: newAvailableCopies }),
      ...(description !== undefined && { description }),
    };
    
    writeData(data);
    
    res.json(data.books[bookIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
  try {
    const data = readData();
    const bookIndex = data.books.findIndex(b => b.id === req.params.id);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    // Check if book is currently borrowed
    const isBorrowed = data.borrowings.some(
      b => b.bookId === req.params.id && b.status === 'Borrowed'
    );
    
    if (isBorrowed) {
      return res.status(400).json({ error: 'Cannot delete book that is currently borrowed' });
    }
    
    data.books.splice(bookIndex, 1);
    writeData(data);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// ==================== MEMBERS ROUTES ====================

// Get all members
app.get('/api/members', (req, res) => {
  try {
    const data = readData();
    const { search } = req.query;
    
    let members = data.members;
    
    if (search) {
      const query = search.toLowerCase();
      members = members.filter(
        m =>
          m.firstName.toLowerCase().includes(query) ||
          m.lastName.toLowerCase().includes(query) ||
          m.email.toLowerCase().includes(query) ||
          m.phone.includes(query)
      );
    }
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get member by ID
app.get('/api/members/:id', (req, res) => {
  try {
    const data = readData();
    const member = data.members.find(m => m.id === req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch member' });
  }
});

// Create member
app.post('/api/members', (req, res) => {
  try {
    const data = readData();
    const { firstName, lastName, email, phone, address, membershipType, status } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !address || !membershipType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if email already exists
    const emailExists = data.members.some(m => m.email === email);
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const newMember = {
      id: generateId(),
      firstName,
      lastName,
      email,
      phone,
      address,
      membershipDate: new Date().toISOString().split('T')[0],
      membershipType,
      status: status || 'Active',
    };
    
    data.members.push(newMember);
    writeData(data);
    
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create member' });
  }
});

// Update member
app.put('/api/members/:id', (req, res) => {
  try {
    const data = readData();
    const memberIndex = data.members.findIndex(m => m.id === req.params.id);
    
    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const { firstName, lastName, email, phone, address, membershipType, status } = req.body;
    
    // Check if email already exists (excluding current member)
    if (email) {
      const emailExists = data.members.some(
        m => m.email === email && m.id !== req.params.id
      );
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    
    data.members[memberIndex] = {
      ...data.members[memberIndex],
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(membershipType && { membershipType }),
      ...(status && { status }),
    };
    
    writeData(data);
    
    res.json(data.members[memberIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// Delete member
app.delete('/api/members/:id', (req, res) => {
  try {
    const data = readData();
    const memberIndex = data.members.findIndex(m => m.id === req.params.id);
    
    if (memberIndex === -1) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    // Check if member has active borrowings
    const hasActiveBorrowings = data.borrowings.some(
      b => b.memberId === req.params.id && b.status === 'Borrowed'
    );
    
    if (hasActiveBorrowings) {
      return res.status(400).json({ error: 'Cannot delete member with active borrowings' });
    }
    
    data.members.splice(memberIndex, 1);
    writeData(data);
    
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

// ==================== BORROWINGS ROUTES ====================

// Get all borrowings
app.get('/api/borrowings', (req, res) => {
  try {
    const data = readData();
    res.json(data.borrowings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrowings' });
  }
});

// Get borrowings by member
app.get('/api/borrowings/member/:memberId', (req, res) => {
  try {
    const data = readData();
    const borrowings = data.borrowings.filter(b => b.memberId === req.params.memberId);
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrowings' });
  }
});

// Get borrowings by book
app.get('/api/borrowings/book/:bookId', (req, res) => {
  try {
    const data = readData();
    const borrowings = data.borrowings.filter(b => b.bookId === req.params.bookId);
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrowings' });
  }
});

// Borrow a book
app.post('/api/borrowings', (req, res) => {
  try {
    const data = readData();
    const { bookId, memberId } = req.body;
    
    if (!bookId || !memberId) {
      return res.status(400).json({ error: 'Book ID and Member ID are required' });
    }
    
    const book = data.books.find(b => b.id === bookId);
    const member = data.members.find(m => m.id === memberId);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    if (member.status !== 'Active') {
      return res.status(400).json({ error: 'Member is not active' });
    }
    
    if (book.availableCopies <= 0) {
      return res.status(400).json({ error: 'No copies available' });
    }
    
    // Check if member already borrowed this book
    const alreadyBorrowed = data.borrowings.some(
      b => b.bookId === bookId && b.memberId === memberId && b.status === 'Borrowed'
    );
    
    if (alreadyBorrowed) {
      return res.status(400).json({ error: 'Member already has this book borrowed' });
    }
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days loan period
    
    const newBorrowing = {
      id: generateId(),
      bookId,
      bookTitle: book.title,
      memberId,
      memberName: `${member.firstName} ${member.lastName}`,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'Borrowed',
    };
    
    // Update book available copies
    book.availableCopies -= 1;
    
    data.borrowings.push(newBorrowing);
    writeData(data);
    
    res.status(201).json(newBorrowing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create borrowing' });
  }
});

// Return a book
app.put('/api/borrowings/:id/return', (req, res) => {
  try {
    const data = readData();
    const borrowingIndex = data.borrowings.findIndex(b => b.id === req.params.id);
    
    if (borrowingIndex === -1) {
      return res.status(404).json({ error: 'Borrowing not found' });
    }
    
    const borrowing = data.borrowings[borrowingIndex];
    
    if (borrowing.status === 'Returned') {
      return res.status(400).json({ error: 'Book already returned' });
    }
    
    const book = data.books.find(b => b.id === borrowing.bookId);
    if (book) {
      book.availableCopies += 1;
    }
    
    const returnDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(borrowing.dueDate);
    const returnDateObj = new Date(returnDate);
    
    let fineAmount = 0;
    if (returnDateObj > dueDate) {
      const daysOverdue = Math.ceil((returnDateObj.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      fineAmount = daysOverdue * 0.50; // $0.50 per day
    }
    
    data.borrowings[borrowingIndex] = {
      ...borrowing,
      returnDate,
      status: 'Returned',
      fineAmount: fineAmount > 0 ? fineAmount : undefined,
    };
    
    writeData(data);
    
    res.json(data.borrowings[borrowingIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
});

// ==================== STATS ROUTE ====================

app.get('/api/stats', (req, res) => {
  try {
    const data = readData();
    const categories = new Set(data.books.map(b => b.category));
    const borrowed = data.borrowings.filter(b => b.status === 'Borrowed').length;
    const overdue = data.borrowings.filter(b => {
      if (b.status !== 'Borrowed') return false;
      const dueDate = new Date(b.dueDate);
      return dueDate < new Date();
    }).length;
    
    const stats = {
      totalBooks: data.books.length,
      totalMembers: data.members.length,
      borrowedBooks: borrowed,
      overdueBooks: overdue,
      availableBooks: data.books.reduce((sum, b) => sum + b.availableCopies, 0),
      totalCategories: categories.size,
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Library API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Library Management API server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
});

