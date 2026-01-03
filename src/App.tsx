import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import LifeHistoryForm from './components/LifeHistoryForm'
import SocialSecurityForm from './components/SocialSecurityForm'
import AdminPanel from './components/AdminPanel'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import EmployeeManagement from './components/EmployeeManagement'
import DepartmentManagement from './components/DepartmentManagement'
import AttendanceManagement from './components/AttendanceManagement'
import LeaveManagement from './components/LeaveManagement'
import PerformanceManagement from './components/PerformanceManagement'
import LibraryLayout from './components/library/LibraryLayout'
import LibraryDashboard from './components/library/LibraryDashboard'
import BookManagement from './components/library/BookManagement'
import MemberManagement from './components/library/MemberManagement'
import BorrowingManagement from './components/library/BorrowingManagement'
import FloatingActions from './components/FloatingActions'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<LifeHistoryForm />} />
          <Route path="/social-security" element={<SocialSecurityForm />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/hr" element={<Layout />}>
            <Route index element={<Navigate to="/hr/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="attendance" element={<AttendanceManagement />} />
            <Route path="leaves" element={<LeaveManagement />} />
            <Route path="performance" element={<PerformanceManagement />} />
          </Route>
          <Route path="/library" element={<LibraryLayout />}>
            <Route index element={<LibraryDashboard />} />
            <Route path="books" element={<BookManagement />} />
            <Route path="members" element={<MemberManagement />} />
            <Route path="borrowings" element={<BorrowingManagement />} />
          </Route>
        </Routes>
        <FloatingActions />
      </div>
    </Router>
  )
}

export default App
