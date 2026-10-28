# 🏛️ Ambo University - Human Resource Management System (HRMS)

A modern, comprehensive Human Resource Management System (HRMS) and Employee Portal with multilingual support (English, Amharic, Afan Oromo), dark mode, employee self-service forms, attendance, leave management, and performance tracking.

---

## ✨ Core Features

- 📊 **Executive HR Dashboard** - Real-time statistics, departmental breakdowns, attendance summary, pending leave requests, and recent hires.
- 👥 **Employee Management** - Full employee directory with search, filtering by department/status, adding, editing, and archiving staff records.
- 🏢 **Department Management** - Manage organizational departments, headcounts, managers, and operational budgets.
- ⏰ **Attendance Tracking** - Daily employee attendance logging, check-in/check-out timestamps, and working hours calculation.
- 📅 **Leave Management** - Comprehensive leave request workflow (vacation, sick, personal, maternity, paternity) with status management (pending, approved, rejected).
- ⭐ **Performance Evaluation** - Periodic employee reviews, ratings, goals, achievements, and supervisor feedback.
- 📋 **Life History Form** - Extensive digital life history and background documentation form for federal government employees.
- 🛡️ **Social Security & Pension Form** - Pension scheme registration and beneficiary documentation.
- ⚙️ **Admin Panel** - Centralized review dashboard for reviewing, approving, and rejecting pending employee submissions.
- 🌍 **Trilingual i18n Support** - English, Amharic (አማርኛ), and Afan Oromo.
- 🌓 **Dark/Light Mode** - Accessible, high-contrast theme switching.
- 🤖 **AI HR Assistant** - Interactive assistant for employee inquiries, form guides, and portal navigation.
- 💾 **Dual-Mode Persistence** - Connects to backend API when available and automatically falls back to persistent client-side storage when standalone or deployed to static hosting.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Development Mode
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Code Quality Check
```bash
npm run lint
```

---

## 📁 Project Architecture

```
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and SVG icons
│   ├── components/         # HRMS Core Modules
│   │   ├── AdminPanel.tsx            # Submission approval panel
│   │   ├── AttendanceManagement.tsx  # Daily attendance tracking
│   │   ├── BilingualText.tsx         # Multilingual text component
│   │   ├── ChatBot.tsx               # HR Assistant chatbot
│   │   ├── ConnectionStatus.tsx      # Backend connectivity indicator
│   │   ├── Dashboard.tsx             # Main HR dashboard
│   │   ├── DepartmentManagement.tsx  # Department management
│   │   ├── EmployeeManagement.tsx    # Employee directory & CRUD
│   │   ├── FloatingActions.tsx       # Quick actions floating menu
│   │   ├── Home.tsx                  # Public portal landing page
│   │   ├── LanguageSwitcher.tsx      # EN / አማ / OM language switcher
│   │   ├── Layout.tsx                # HRMS sidebar & shell layout
│   │   ├── LeaveManagement.tsx       # Leave request workflow
│   │   ├── LifeHistoryForm.tsx       # Employee life history form
│   │   ├── PerformanceManagement.tsx # Performance review tracking
│   │   ├── SocialSecurityForm.tsx    # Pension & social security form
│   │   └── ThemeToggle.tsx           # Light/dark theme toggle
│   ├── contexts/           # React ThemeContext
│   ├── i18n/               # Localization (English, Amharic, Afan Oromo)
│   ├── services/           # API services & mock data fallbacks
│   └── types/              # TypeScript interfaces (HR, forms, social security)
├── eslint.config.js        # ESLint flat configuration
├── index.html              # Entry HTML
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vercel.json             # Vercel rewrite configuration
└── vite.config.ts          # Vite build and proxy settings
```

---

## 🌐 Deployment (Vercel)

The application is fully configured for deployment on Vercel:
1. Import repository to Vercel.
2. Framework Preset: **Vite**.
3. Root Directory: **`./`**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.

---

## 📝 License

MIT
