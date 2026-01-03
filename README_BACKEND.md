# Library Management System - Full Stack Setup

This project includes both frontend (React + Vite) and backend (Express.js) for a complete Library Management System.

## Quick Start

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

### Option 2: Install Concurrently (Recommended)

```bash
# Install concurrently globally or use npx
npm install -g concurrently

# Run both servers
npm run dev:all
```

Or add concurrently to package.json and use:
```bash
npm install --save-dev concurrently
npm run dev:all
```

## Backend Server

- **Port:** 3001
- **URL:** http://localhost:3001
- **API Base:** http://localhost:3001/api

## Frontend Server

- **Port:** 5173
- **URL:** http://localhost:5173

## API Integration

The frontend is configured to connect to the backend API. The Vite proxy is set up to forward `/api` requests to `http://localhost:3001`.

## Data Persistence

The backend uses a JSON file (`server/data.json`) for data storage. This file is automatically created with sample data on first run.

## Features

✅ Full CRUD operations for Books
✅ Full CRUD operations for Members  
✅ Borrow and Return functionality
✅ Automatic fine calculation for overdue books
✅ Search functionality
✅ Statistics dashboard
✅ Input validation
✅ Error handling
✅ CORS enabled

## Next Steps

To use a real database (PostgreSQL, MongoDB, etc.), you can:
1. Replace the file-based storage in `server/server.js`
2. Add database connection logic
3. Update the data read/write functions

The API structure remains the same, so no frontend changes are needed.

