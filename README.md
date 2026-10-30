# 🏛️ Ambo University - Human Resource Management System (HRMS)

A modern, comprehensive Human Resource Management System (HRMS) and Employee Portal built for Ambo University with complete trilingual support (**English**, **Afaan Oromoo**, **Amharic**), enterprise Role-Based Access Control (RBAC), intelligent HR chatbot assistant, dark/light theme, employee self-service forms, attendance ledger, leave management, and performance evaluations.

---

## ✨ Key Capabilities

- 🌍 **Complete Trilingual Localization (EN / OM / AM):**
  - Instant language switching between **English (Default)**, **Afaan Oromoo**, and **Amharic (አማርኛ)**.
  - Centralized, structured JSON translation dictionaries (`src/locales/{en,om,am}/common.json`).
  - Persistent language selection across navigation and page reloads (`localStorage`).
  - Proper Geez (Amharic) and Latin (Afaan Oromoo) typography and layout adaptation.

- 🔐 **Enterprise Role-Based Access Control (RBAC):**
  - **Public Interface Secured:** Admin Portal and HR Portal links are hidden from public visitors and anonymous navigation.
  - **Protected Routing:** Restricted routes (`/admin`, `/hr/*`) strictly enforce authentication and authorization via `ProtectedRoute`.
  - **Granular Roles:**
    - `admin`: Full administrative privileges, digital form submission reviews (approve/reject), system overview.
    - `hr`: Employee management, department allocations, daily attendance, leave approvals, performance evaluations.
  - **Password Security:** PBKDF2-SHA256 password hashing with 100,000 iterations via Web Crypto API.
  - **Session Management:** Secure token-based session verification with automatic cross-tab synchronization and clean logout.

- 🤖 **Intelligent Multilingual HR Chatbot:**
  - Real project assistant with extensive domain knowledge:
    - Life History Form requirements (Ethiopian Federal Civil Service background documentation).
    - Social Security & Pension Form guidance (Public Servants Social Security Agency - PSSSA).
    - Official working hours (8:30 AM – 5:30 PM, lunch break 12:30 PM – 1:30 PM).
    - University campus contacts (Main Campus, Awaro Campus, Woliso Campus).
    - Leave entitlements (Annual, Sick, Maternity, Paternity, Study).
  - Responds natively in the user's active language (**English**, **Afaan Oromoo**, or **Amharic**).
  - External AI API integration support via `VITE_AI_API_URL` with resilient local domain knowledge fallback.
  - Session history preservation and instant chat reset capability.

- 📊 **Comprehensive HR Management Suite:**
  - **Executive HR Dashboard:** Real-time KPI counts, departmental distribution, attendance rates, pending leaves, and recent staff roster.
  - **Employee Directory:** Searchable staff directory, filters, add/edit records, status tracking.
  - **Department Roster:** Headcounts, designated managers, operational budgets (ETB).
  - **Attendance Ledger:** Daily check-in/out timestamps and total hours calculation.
  - **Leave Management:** Multi-category leave request and supervisor approval workflow.
  - **Performance Evaluations:** 5-star appraisal scoring, supervisor remarks, and goal tracking.
  - **Civil Service Forms:** Public employee self-service digital submissions for Life History and Pension schemes.

---

## 🔑 Initial Staff Credentials

| Role | Email | Default Password | Access Scope |
|---|---|---|---|
| **System Administrator** | `yesufdergu464@gmail.com` | `yes123@gmail.com` | `/admin` (Submission reviews, triage, approvals) & `/hr` |
| **HR Officer** | `hr@ambou.edu.et` | `hr123@ambou` | `/hr/*` (Employees, attendance, leaves, departments, performance) |

> 🔒 **Security Notice:** Initial passwords are automatically hashed with PBKDF2-SHA256 upon authentication. Credentials should be modified in production environments via backend environment variables.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Optional AI Chatbot API Endpoint (falls back gracefully to embedded domain knowledge engine)
VITE_AI_API_URL=https://api.openai.com/v1/chat/completions
VITE_AI_API_KEY=

# Backend API Endpoint (falls back to local storage when backend is not connected)
VITE_API_URL=http://localhost:5000/api
```

See `.env.example` for full reference.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Code Quality & Lint Check
```bash
npm run lint
```

---

## 📁 Project Architecture

```
├── public/                 # Static assets & icons
├── src/
│   ├── assets/             # Brand logos & imagery
│   ├── components/
│   │   ├── auth/           # Login portal & ProtectedRoute guard
│   │   │   ├── Login.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── AdminPanel.tsx            # Digital submission review & approval
│   │   ├── AttendanceManagement.tsx  # Daily attendance ledger
│   │   ├── ChatBot.tsx               # Multilingual AI HR Assistant
│   │   ├── Dashboard.tsx             # Executive HR analytics & KPIs
│   │   ├── DepartmentManagement.tsx  # Department roster & budgets
│   │   ├── EmployeeManagement.tsx    # Employee directory & CRUD
│   │   ├── FloatingActions.tsx       # Auth-aware quick action menu
│   │   ├── Home.tsx                  # Public portal landing page
│   │   ├── LanguageSwitcher.tsx      # EN / OM / AM language switcher
│   │   ├── Layout.tsx                # Authenticated HR portal layout & sidebar
│   │   ├── LeaveManagement.tsx       # Leave request & approval queue
│   │   ├── LifeHistoryForm.tsx       # Civil service life history registration
│   │   ├── PerformanceManagement.tsx # Staff appraisal & review ratings
│   │   ├── SocialSecurityForm.tsx    # Public servants pension registration
│   │   └── ThemeToggle.tsx           # Dark / light theme toggle
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Authentication state & RBAC provider
│   │   └── ThemeContext.tsx          # Dark / light mode state provider
│   ├── locales/                      # Centralized trilingual dictionaries
│   │   ├── en/common.json            # English translations
│   │   ├── om/common.json            # Afaan Oromoo translations
│   │   └── am/common.json            # Amharic (አማርኛ) translations
│   ├── services/
│   │   ├── api.ts                    # Protected HTTP API client
│   │   ├── authService.ts            # PBKDF2 hashing, tokens, RBAC logic
│   │   ├── chatbotService.ts         # Multilingual domain knowledge engine
│   │   └── formSubmission.ts         # Digital form persistence
│   └── types/                        # TypeScript schemas (HR, Auth, Forms)
├── .env.example            # Environment variables template
├── vercel.json             # Vercel SPA routing rewrites
└── vite.config.ts          # Vite build configuration
```

---

## 🌐 Deployment (Vercel)

The project is optimized for instant deployment on Vercel:
1. Push to GitHub (`main` branch).
2. Connect repository to Vercel.
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.

---

## 📝 License

Developed for Ambo University. All rights reserved.
