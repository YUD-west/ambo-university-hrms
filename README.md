# Library Management System

A modern, multilingual library management system with dark mode support, chatbot assistant, and floating action buttons.

## Features

- 📚 Complete Library Management (Books, Members, Borrowings)
- 🌍 Multilingual Support (English, Amharic, Afan Oromo)
- 🌓 Dark/Light Mode Toggle
- 🤖 AI Chatbot Assistant
- ⚡ Floating Action Buttons
- 📱 Fully Responsive Design
- 🎨 Modern UI/UX

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment

### Easy Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy library system"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to: https://vercel.com
   - Sign up with GitHub
   - Import your repository
   - Click "Deploy"
   - Get your live link!

See `EASY_DEPLOY.md` for detailed instructions.

## Backend Setup (Optional)

If you need the backend API:

```bash
cd server
npm install
npm start
```

Backend runs on: http://localhost:3001

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: CSS3 with CSS Variables
- **Routing**: React Router v7
- **i18n**: react-i18next
- **Backend**: Express.js, Node.js

## Project Structure

```
├── src/
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── types/             # TypeScript types
│   ├── i18n/             # Translations
│   └── contexts/         # React contexts
├── server/                # Backend API
└── dist/                 # Build output
```

## License

MIT
