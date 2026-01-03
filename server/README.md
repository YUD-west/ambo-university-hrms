# Library Management System - Backend API

Express.js backend server for the Library Management System.

## Features

- RESTful API for Books, Members, and Borrowings
- JSON file-based data persistence
- CORS enabled for frontend integration
- Input validation and error handling
- Automatic fine calculation for overdue books

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Books
- `GET /api/books` - Get all books (supports ?search=query)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Members
- `GET /api/members` - Get all members (supports ?search=query)
- `GET /api/members/:id` - Get member by ID
- `POST /api/members` - Create a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member

### Borrowings
- `GET /api/borrowings` - Get all borrowings
- `GET /api/borrowings/member/:memberId` - Get borrowings by member
- `GET /api/borrowings/book/:bookId` - Get borrowings by book
- `POST /api/borrowings` - Borrow a book
- `PUT /api/borrowings/:id/return` - Return a book

### Statistics
- `GET /api/stats` - Get library statistics

### Health Check
- `GET /api/health` - Check API status

## Data Storage

Data is stored in `data.json` file in the server directory. The file is automatically created with sample data on first run.

## Environment Variables

- `PORT` - Server port (default: 3001)

