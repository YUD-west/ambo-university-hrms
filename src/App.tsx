import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Home from './components/Home';
import LifeHistoryForm from './components/LifeHistoryForm';
import SocialSecurityForm from './components/SocialSecurityForm';
import AdminPanel from './components/AdminPanel';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import DepartmentManagement from './components/DepartmentManagement';
import AttendanceManagement from './components/AttendanceManagement';
import LeaveManagement from './components/LeaveManagement';
import PerformanceManagement from './components/PerformanceManagement';
import FloatingActions from './components/FloatingActions';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Visitor Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/form" element={<LifeHistoryForm />} />
            <Route path="/social-security" element={<SocialSecurityForm />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Route (Restricted to 'admin' role) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Protected HR Management Portal (Restricted to 'admin' and 'hr' roles) */}
            <Route
              path="/hr"
              element={
                <ProtectedRoute allowedRoles={['admin', 'hr']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/hr/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="employees" element={<EmployeeManagement />} />
              <Route path="departments" element={<DepartmentManagement />} />
              <Route path="attendance" element={<AttendanceManagement />} />
              <Route path="leaves" element={<LeaveManagement />} />
              <Route path="performance" element={<PerformanceManagement />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FloatingActions />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
