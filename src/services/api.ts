import type {
  Employee,
  Department,
  Attendance,
  LeaveRequest,
  PerformanceReview,
  DashboardStats,
} from '../types/hrTypes';
import {
  mockEmployees,
  mockDepartments,
  mockAttendance,
  mockLeaveRequests,
  mockPerformanceReviews,
} from './mockData';
import { authService } from './authService';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Storage keys for offline persistence
const KEYS = {
  EMPLOYEES: 'hrms_employees_data',
  DEPARTMENTS: 'hrms_departments_data',
  ATTENDANCE: 'hrms_attendance_data',
  LEAVES: 'hrms_leaves_data',
  PERFORMANCE: 'hrms_performance_data',
  SUBMISSIONS: 'formSubmissions',
};

// Safe localStorage helpers
function getLocal<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function setLocal<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Low-level HTTP request helper
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout for responsive fallback

    const token = authService.getToken();
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Non-JSON response from server');
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${response.status}`,
        error: data.error,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      success: false,
      message: err.message || 'Network error. Please check if the backend server is running.',
      error: err.message,
    };
  }
}

// ==================== HR API FUNCTIONS ====================
export const hrApi = {
  // Dashboard
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const res = await request<DashboardStats>('/hr/dashboard/stats');
    if (res.success && res.data) return res;

    // Local fallback
    const emps = getLocal<Employee[]>(KEYS.EMPLOYEES, mockEmployees);
    const deps = getLocal<Department[]>(KEYS.DEPARTMENTS, mockDepartments);
    const atts = getLocal<Attendance[]>(KEYS.ATTENDANCE, mockAttendance);
    const leaves = getLocal<LeaveRequest[]>(KEYS.LEAVES, mockLeaveRequests);

    const stats: DashboardStats = {
      totalEmployees: emps.length,
      activeEmployees: emps.filter(e => e.status === 'active').length,
      onLeave: emps.filter(e => e.status === 'on-leave').length,
      departments: deps.length,
      todayAttendance: {
        present: atts.filter(a => a.status === 'present').length,
        absent: atts.filter(a => a.status === 'absent').length || 1,
        late: atts.filter(a => a.status === 'late').length,
      },
      pendingLeaveRequests: leaves.filter(l => l.status === 'pending').length,
      monthlyHires: 2,
    };

    return { success: true, data: stats };
  },

  // Employees
  getEmployees: async (params?: { search?: string; department?: string; status?: string }): Promise<ApiResponse<Employee[]>> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await request<Employee[]>(`/hr/employees${query ? `?${query}` : ''}`);
    if (res.success && res.data) {
      setLocal(KEYS.EMPLOYEES, res.data);
      return res;
    }

    let list = getLocal<Employee[]>(KEYS.EMPLOYEES, mockEmployees);
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
      );
    }
    if (params?.department) {
      list = list.filter(e => e.department.toLowerCase() === params.department?.toLowerCase());
    }
    if (params?.status) {
      list = list.filter(e => e.status === params.status);
    }

    return { success: true, data: list };
  },

  getEmployee: async (id: string): Promise<ApiResponse<Employee>> => {
    const res = await request<Employee>(`/hr/employees/${id}`);
    if (res.success && res.data) return res;

    const list = getLocal<Employee[]>(KEYS.EMPLOYEES, mockEmployees);
    const emp = list.find(e => e.id === id);
    if (!emp) return { success: false, message: 'Employee not found' };
    return { success: true, data: emp };
  },

  createEmployee: async (employee: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    const res = await request<Employee>('/hr/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
    if (res.success && res.data) {
      const list = getLocal<Employee[]>(KEYS.EMPLOYEES, mockEmployees);
      list.push(res.data);
      setLocal(KEYS.EMPLOYEES, list);
      return res;
    }

    const list = getLocal<Employee[]>(KEYS.EMPLOYEES, mockEmployees);
    const newEmp: Employee = {
      id: Date.now().toString(),
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.department || 'Engineering',
      hireDate: employee.hireDate || new Date().toISOString().split('T')[0],
      salary: Number(employee.salary) || 50000,
      status: employee.status || 'active',
      address: employee.address || '',
      dateOfBirth: employee.dateOfBirth || '1995-01-01',
      emergencyContact: employee.emergencyContact || {
        name: 'Contact',
        phone: '+251-900-000000',
        relationship: 'Family',
      },
    };
    list.push(newEmp);
    setLocal(KEYS.EMPLOYEES, list);
    return { success: true, data: newEmp, message: 'Employee created successfully' };
  },

  updateEmployee: async (id: string, updates: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    const res = await request<Employee>(`/hr/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      const list = getLocal<Employee[]>(KEYS.EMPLOYEES, mockEmployees);
      const idx = list.findIndex(e => e.id === id);
      if (idx !== -1) {
        list[idx] = res.data;
        setLocal(KEYS.EMPLOYEES, list);
      }
      return res;
    }

    const list = getLocal<Employee[]>(KEYS.EMPLOYEES, mockEmployees);
    const idx = list.findIndex(e => e.id === id);
    if (idx === -1) return { success: false, message: 'Employee not found' };

    list[idx] = { ...list[idx], ...updates };
    setLocal(KEYS.EMPLOYEES, list);
    return { success: true, data: list[idx], message: 'Employee updated successfully' };
  },

  deleteEmployee: async (id: string): Promise<ApiResponse<void>> => {
    await request(`/hr/employees/${id}`, { method: 'DELETE' });
    const list = getLocal<Employee[]>(KEYS.EMPLOYEES, mockEmployees).filter(e => e.id !== id);
    setLocal(KEYS.EMPLOYEES, list);
    return { success: true, message: 'Employee deleted successfully' };
  },

  // Departments
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const res = await request<Department[]>('/hr/departments');
    if (res.success && res.data) {
      setLocal(KEYS.DEPARTMENTS, res.data);
      return res;
    }
    return { success: true, data: getLocal<Department[]>(KEYS.DEPARTMENTS, mockDepartments) };
  },

  getDepartment: async (id: string): Promise<ApiResponse<Department>> => {
    const res = await request<Department>(`/hr/departments/${id}`);
    if (res.success && res.data) return res;
    const list = getLocal<Department[]>(KEYS.DEPARTMENTS, mockDepartments);
    const dept = list.find(d => d.id === id);
    if (!dept) return { success: false, message: 'Department not found' };
    return { success: true, data: dept };
  },

  createDepartment: async (dept: Partial<Department>): Promise<ApiResponse<Department>> => {
    const res = await request<Department>('/hr/departments', {
      method: 'POST',
      body: JSON.stringify(dept),
    });
    if (res.success && res.data) {
      const list = getLocal<Department[]>(KEYS.DEPARTMENTS, mockDepartments);
      list.push(res.data);
      setLocal(KEYS.DEPARTMENTS, list);
      return res;
    }

    const list = getLocal<Department[]>(KEYS.DEPARTMENTS, mockDepartments);
    const newDept: Department = {
      id: Date.now().toString(),
      name: dept.name || 'New Department',
      description: dept.description || '',
      managerId: dept.managerId || '1',
      managerName: dept.managerName || 'John Doe',
      employeeCount: Number(dept.employeeCount) || 1,
      budget: Number(dept.budget) || 100000,
    };
    list.push(newDept);
    setLocal(KEYS.DEPARTMENTS, list);
    return { success: true, data: newDept, message: 'Department created successfully' };
  },

  updateDepartment: async (id: string, updates: Partial<Department>): Promise<ApiResponse<Department>> => {
    const res = await request<Department>(`/hr/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      const list = getLocal<Department[]>(KEYS.DEPARTMENTS, mockDepartments);
      const idx = list.findIndex(d => d.id === id);
      if (idx !== -1) {
        list[idx] = res.data;
        setLocal(KEYS.DEPARTMENTS, list);
      }
      return res;
    }

    const list = getLocal<Department[]>(KEYS.DEPARTMENTS, mockDepartments);
    const idx = list.findIndex(d => d.id === id);
    if (idx === -1) return { success: false, message: 'Department not found' };

    list[idx] = { ...list[idx], ...updates };
    setLocal(KEYS.DEPARTMENTS, list);
    return { success: true, data: list[idx], message: 'Department updated successfully' };
  },

  deleteDepartment: async (id: string): Promise<ApiResponse<void>> => {
    await request(`/hr/departments/${id}`, { method: 'DELETE' });
    const list = getLocal<Department[]>(KEYS.DEPARTMENTS, mockDepartments).filter(d => d.id !== id);
    setLocal(KEYS.DEPARTMENTS, list);
    return { success: true, message: 'Department deleted successfully' };
  },

  // Attendance
  getAttendance: async (params?: { employeeId?: string; date?: string }): Promise<ApiResponse<Attendance[]>> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await request<Attendance[]>(`/hr/attendance${query ? `?${query}` : ''}`);
    if (res.success && res.data) {
      setLocal(KEYS.ATTENDANCE, res.data);
      return res;
    }

    let list = getLocal<Attendance[]>(KEYS.ATTENDANCE, mockAttendance);
    if (params?.employeeId) {
      list = list.filter(a => a.employeeId === params.employeeId);
    }
    if (params?.date) {
      list = list.filter(a => a.date === params.date);
    }
    return { success: true, data: list };
  },

  createAttendance: async (attendance: Partial<Attendance>): Promise<ApiResponse<Attendance>> => {
    const res = await request<Attendance>('/hr/attendance', {
      method: 'POST',
      body: JSON.stringify(attendance),
    });
    if (res.success && res.data) {
      const list = getLocal<Attendance[]>(KEYS.ATTENDANCE, mockAttendance);
      list.unshift(res.data);
      setLocal(KEYS.ATTENDANCE, list);
      return res;
    }

    const list = getLocal<Attendance[]>(KEYS.ATTENDANCE, mockAttendance);
    const record: Attendance = {
      id: Date.now().toString(),
      employeeId: attendance.employeeId || '1',
      employeeName: attendance.employeeName || 'John Doe',
      date: attendance.date || new Date().toISOString().split('T')[0],
      checkIn: attendance.checkIn || '09:00',
      checkOut: attendance.checkOut || '17:00',
      hoursWorked: Number(attendance.hoursWorked) || 8,
      status: attendance.status || 'present',
    };
    list.unshift(record);
    setLocal(KEYS.ATTENDANCE, list);
    return { success: true, data: record, message: 'Attendance recorded' };
  },

  updateAttendance: async (id: string, updates: Partial<Attendance>): Promise<ApiResponse<Attendance>> => {
    const res = await request<Attendance>(`/hr/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      const list = getLocal<Attendance[]>(KEYS.ATTENDANCE, mockAttendance);
      const idx = list.findIndex(a => a.id === id);
      if (idx !== -1) {
        list[idx] = res.data;
        setLocal(KEYS.ATTENDANCE, list);
      }
      return res;
    }

    const list = getLocal<Attendance[]>(KEYS.ATTENDANCE, mockAttendance);
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return { success: false, message: 'Attendance record not found' };

    list[idx] = { ...list[idx], ...updates };
    setLocal(KEYS.ATTENDANCE, list);
    return { success: true, data: list[idx] };
  },

  // Leave Requests
  getLeaveRequests: async (params?: { employeeId?: string; status?: string }): Promise<ApiResponse<LeaveRequest[]>> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await request<LeaveRequest[]>(`/hr/leaves${query ? `?${query}` : ''}`);
    if (res.success && res.data) {
      setLocal(KEYS.LEAVES, res.data);
      return res;
    }

    let list = getLocal<LeaveRequest[]>(KEYS.LEAVES, mockLeaveRequests);
    if (params?.status) {
      list = list.filter(l => l.status === params.status);
    }
    if (params?.employeeId) {
      list = list.filter(l => l.employeeId === params.employeeId);
    }
    return { success: true, data: list };
  },

  createLeaveRequest: async (leaveRequest: Partial<LeaveRequest>): Promise<ApiResponse<LeaveRequest>> => {
    const res = await request<LeaveRequest>('/hr/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveRequest),
    });
    if (res.success && res.data) {
      const list = getLocal<LeaveRequest[]>(KEYS.LEAVES, mockLeaveRequests);
      list.unshift(res.data);
      setLocal(KEYS.LEAVES, list);
      return res;
    }

    const list = getLocal<LeaveRequest[]>(KEYS.LEAVES, mockLeaveRequests);
    const newReq: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: leaveRequest.employeeId || '1',
      employeeName: leaveRequest.employeeName || 'John Doe',
      type: leaveRequest.type || 'vacation',
      startDate: leaveRequest.startDate || new Date().toISOString().split('T')[0],
      endDate: leaveRequest.endDate || new Date().toISOString().split('T')[0],
      days: Number(leaveRequest.days) || 1,
      status: 'pending',
      reason: leaveRequest.reason || 'Personal request',
      submittedDate: new Date().toISOString().split('T')[0],
    };
    list.unshift(newReq);
    setLocal(KEYS.LEAVES, list);
    return { success: true, data: newReq, message: 'Leave request submitted' };
  },

  updateLeaveRequest: async (id: string, updates: Partial<LeaveRequest>): Promise<ApiResponse<LeaveRequest>> => {
    const res = await request<LeaveRequest>(`/hr/leaves/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      const list = getLocal<LeaveRequest[]>(KEYS.LEAVES, mockLeaveRequests);
      const idx = list.findIndex(l => l.id === id);
      if (idx !== -1) {
        list[idx] = res.data;
        setLocal(KEYS.LEAVES, list);
      }
      return res;
    }

    const list = getLocal<LeaveRequest[]>(KEYS.LEAVES, mockLeaveRequests);
    const idx = list.findIndex(l => l.id === id);
    if (idx === -1) return { success: false, message: 'Leave request not found' };

    list[idx] = { ...list[idx], ...updates };
    setLocal(KEYS.LEAVES, list);
    return { success: true, data: list[idx] };
  },

  // Performance Reviews
  getPerformanceReviews: async (params?: { employeeId?: string }): Promise<ApiResponse<PerformanceReview[]>> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await request<PerformanceReview[]>(`/hr/performance${query ? `?${query}` : ''}`);
    if (res.success && res.data) {
      setLocal(KEYS.PERFORMANCE, res.data);
      return res;
    }

    let list = getLocal<PerformanceReview[]>(KEYS.PERFORMANCE, mockPerformanceReviews);
    if (params?.employeeId) {
      list = list.filter(p => p.employeeId === params.employeeId);
    }
    return { success: true, data: list };
  },

  createPerformanceReview: async (review: Partial<PerformanceReview>): Promise<ApiResponse<PerformanceReview>> => {
    const res = await request<PerformanceReview>('/hr/performance', {
      method: 'POST',
      body: JSON.stringify(review),
    });
    if (res.success && res.data) {
      const list = getLocal<PerformanceReview[]>(KEYS.PERFORMANCE, mockPerformanceReviews);
      list.unshift(res.data);
      setLocal(KEYS.PERFORMANCE, list);
      return res;
    }

    const list = getLocal<PerformanceReview[]>(KEYS.PERFORMANCE, mockPerformanceReviews);
    const newRev: PerformanceReview = {
      id: Date.now().toString(),
      employeeId: review.employeeId || '1',
      employeeName: review.employeeName || 'John Doe',
      reviewPeriod: review.reviewPeriod || 'Q4 2024',
      reviewDate: review.reviewDate || new Date().toISOString().split('T')[0],
      overallRating: Number(review.overallRating) || 4.5,
      goals: review.goals || ['Achieve targets'],
      achievements: review.achievements || ['Completed key initiatives'],
      areasForImprovement: review.areasForImprovement || ['Continuing professional education'],
      reviewerName: review.reviewerName || 'HR Director',
      comments: review.comments || 'Strong performance throughout the quarter.',
    };
    list.unshift(newRev);
    setLocal(KEYS.PERFORMANCE, list);
    return { success: true, data: newRev, message: 'Review recorded' };
  },

  updatePerformanceReview: async (id: string, updates: Partial<PerformanceReview>): Promise<ApiResponse<PerformanceReview>> => {
    const res = await request<PerformanceReview>(`/hr/performance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (res.success && res.data) {
      const list = getLocal<PerformanceReview[]>(KEYS.PERFORMANCE, mockPerformanceReviews);
      const idx = list.findIndex(p => p.id === id);
      if (idx !== -1) {
        list[idx] = res.data;
        setLocal(KEYS.PERFORMANCE, list);
      }
      return res;
    }

    const list = getLocal<PerformanceReview[]>(KEYS.PERFORMANCE, mockPerformanceReviews);
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return { success: false, message: 'Review not found' };

    list[idx] = { ...list[idx], ...updates };
    setLocal(KEYS.PERFORMANCE, list);
    return { success: true, data: list[idx] };
  },

  deletePerformanceReview: async (id: string): Promise<ApiResponse<void>> => {
    await request(`/hr/performance/${id}`, { method: 'DELETE' });
    const list = getLocal<PerformanceReview[]>(KEYS.PERFORMANCE, mockPerformanceReviews).filter(p => p.id !== id);
    setLocal(KEYS.PERFORMANCE, list);
    return { success: true, message: 'Review deleted successfully' };
  },
};

// ==================== FORM SUBMISSION TYPES ====================
export interface FormSubmissionRecord {
  id: string;
  type: 'life-history' | 'social-security';
  data: Record<string, unknown>;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
}

// ==================== FORM API FUNCTIONS ====================
export const formApi = {
  submitLifeHistory: async (formData: unknown): Promise<ApiResponse<FormSubmissionRecord>> => {
    const res = await request<FormSubmissionRecord>('/forms/life-history', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (res.success && res.data) return res;

    // Fallback save in localStorage
    const subs = getLocal<FormSubmissionRecord[]>(KEYS.SUBMISSIONS, []);
    const newSub: FormSubmissionRecord = {
      id: `SUB-${Date.now()}`,
      type: 'life-history',
      data: (formData as Record<string, unknown>) || {},
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    subs.push(newSub);
    setLocal(KEYS.SUBMISSIONS, subs);
    return { success: true, data: newSub, message: 'Life history form submitted successfully' };
  },

  submitSocialSecurity: async (formData: unknown): Promise<ApiResponse<FormSubmissionRecord>> => {
    const res = await request<FormSubmissionRecord>('/forms/social-security', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (res.success && res.data) return res;

    const subs = getLocal<FormSubmissionRecord[]>(KEYS.SUBMISSIONS, []);
    const newSub: FormSubmissionRecord = {
      id: `SUB-SS-${Date.now()}`,
      type: 'social-security',
      data: (formData as Record<string, unknown>) || {},
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };
    subs.push(newSub);
    setLocal(KEYS.SUBMISSIONS, subs);
    return { success: true, data: newSub, message: 'Social security form submitted successfully' };
  },

  getSubmissions: async (params?: { type?: string; status?: string }): Promise<ApiResponse<FormSubmissionRecord[]>> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await request<FormSubmissionRecord[]>(`/forms/submissions${query ? `?${query}` : ''}`);
    if (res.success && res.data) return res;

    let subs = getLocal<FormSubmissionRecord[]>(KEYS.SUBMISSIONS, []);
    if (params?.type && params.type !== 'all') subs = subs.filter(s => s.type === params.type);
    if (params?.status && params.status !== 'all') subs = subs.filter(s => s.status === params.status);
    return { success: true, data: subs };
  },
};

// ==================== ADMIN API FUNCTIONS ====================
export const adminApi = {
  getSubmissions: async (params?: { type?: string; status?: string }): Promise<ApiResponse<FormSubmissionRecord[]>> => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await request<FormSubmissionRecord[]>(`/admin/submissions${query ? `?${query}` : ''}`);
    if (res.success && res.data) return res;

    let subs = getLocal<FormSubmissionRecord[]>(KEYS.SUBMISSIONS, []);
    if (params?.type && params.type !== 'all') subs = subs.filter(s => s.type === params.type);
    if (params?.status && params.status !== 'all') subs = subs.filter(s => s.status === params.status);
    return { success: true, data: subs };
  },

  getPendingSubmissions: async (type?: string): Promise<ApiResponse<FormSubmissionRecord[]>> => {
    const res = await request<FormSubmissionRecord[]>(`/admin/submissions/pending${type ? `?type=${type}` : ''}`);
    if (res.success && res.data) return res;

    let subs = getLocal<FormSubmissionRecord[]>(KEYS.SUBMISSIONS, []);
    subs = subs.filter(s => s.status === 'pending');
    if (type && type !== 'all') subs = subs.filter(s => s.type === type);
    return { success: true, data: subs };
  },

  approveSubmission: async (id: string): Promise<ApiResponse<FormSubmissionRecord>> => {
    if (!authService.hasRole('admin')) {
      return { success: false, message: 'Unauthorized: Admin privileges required' };
    }
    const res = await request<FormSubmissionRecord>(`/admin/submissions/${id}/approve`, { method: 'PUT' });
    if (res.success && res.data) return res;

    const subs = getLocal<FormSubmissionRecord[]>(KEYS.SUBMISSIONS, []);
    const idx = subs.findIndex(s => s.id === id);
    if (idx !== -1) {
      subs[idx].status = 'approved';
      setLocal(KEYS.SUBMISSIONS, subs);
      return { success: true, data: subs[idx], message: 'Submission approved' };
    }
    return { success: false, message: 'Submission not found' };
  },

  rejectSubmission: async (id: string): Promise<ApiResponse<FormSubmissionRecord>> => {
    if (!authService.hasRole('admin')) {
      return { success: false, message: 'Unauthorized: Admin privileges required' };
    }
    const res = await request<FormSubmissionRecord>(`/admin/submissions/${id}/reject`, { method: 'PUT' });
    if (res.success && res.data) return res;

    const subs = getLocal<FormSubmissionRecord[]>(KEYS.SUBMISSIONS, []);
    const idx = subs.findIndex(s => s.id === id);
    if (idx !== -1) {
      subs[idx].status = 'rejected';
      setLocal(KEYS.SUBMISSIONS, subs);
      return { success: true, data: subs[idx], message: 'Submission rejected' };
    }
    return { success: false, message: 'Submission not found' };
  },
};
