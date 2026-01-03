// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

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
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Request timeout. Please check your connection.',
        error: 'Timeout',
      };
    }
    return {
      success: false,
      message: error.message || 'Network error. Please check if the backend server is running.',
      error: error.message,
    };
  }
}

// HR API functions
export const hrApi = {
  // Dashboard
  getDashboardStats: () => request('/hr/dashboard/stats'),

  // Employees
  getEmployees: (params?: { search?: string; department?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/hr/employees${query ? `?${query}` : ''}`);
  },
  getEmployee: (id: string) => request(`/hr/employees/${id}`),
  createEmployee: (employee: any) => request('/hr/employees', { method: 'POST', body: JSON.stringify(employee) }),
  updateEmployee: (id: string, employee: any) => request(`/hr/employees/${id}`, { method: 'PUT', body: JSON.stringify(employee) }),
  deleteEmployee: (id: string) => request(`/hr/employees/${id}`, { method: 'DELETE' }),

  // Departments
  getDepartments: () => request('/hr/departments'),
  getDepartment: (id: string) => request(`/hr/departments/${id}`),
  createDepartment: (department: any) => request('/hr/departments', { method: 'POST', body: JSON.stringify(department) }),
  updateDepartment: (id: string, department: any) => request(`/hr/departments/${id}`, { method: 'PUT', body: JSON.stringify(department) }),
  deleteDepartment: (id: string) => request(`/hr/departments/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: (params?: { employeeId?: string; date?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/hr/attendance${query ? `?${query}` : ''}`);
  },
  createAttendance: (attendance: any) => request('/hr/attendance', { method: 'POST', body: JSON.stringify(attendance) }),
  updateAttendance: (id: string, attendance: any) => request(`/hr/attendance/${id}`, { method: 'PUT', body: JSON.stringify(attendance) }),

  // Leave Requests
  getLeaveRequests: (params?: { employeeId?: string; status?: string; type?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/hr/leaves${query ? `?${query}` : ''}`);
  },
  createLeaveRequest: (leaveRequest: any) => request('/hr/leaves', { method: 'POST', body: JSON.stringify(leaveRequest) }),
  updateLeaveRequest: (id: string, leaveRequest: any) => request(`/hr/leaves/${id}`, { method: 'PUT', body: JSON.stringify(leaveRequest) }),

  // Performance Reviews
  getPerformanceReviews: (params?: { employeeId?: string; reviewPeriod?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/hr/performance${query ? `?${query}` : ''}`);
  },
  createPerformanceReview: (review: any) => request('/hr/performance', { method: 'POST', body: JSON.stringify(review) }),
  updatePerformanceReview: (id: string, review: any) => request(`/hr/performance/${id}`, { method: 'PUT', body: JSON.stringify(review) }),
};

// Form API functions
export const formApi = {
  submitLifeHistory: (formData: any) => request('/forms/life-history', { method: 'POST', body: JSON.stringify(formData) }),
  submitSocialSecurity: (formData: any) => request('/forms/social-security', { method: 'POST', body: JSON.stringify(formData) }),
  getSubmissions: (params?: { type?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request(`/forms/submissions${query ? `?${query}` : ''}`);
  },
};

// Admin API functions
export const adminApi = {
  getPendingSubmissions: (type?: string) => request(`/admin/submissions/pending${type ? `?type=${type}` : ''}`),
  approveSubmission: (id: string) => request(`/admin/submissions/${id}/approve`, { method: 'PUT' }),
  rejectSubmission: (id: string) => request(`/admin/submissions/${id}/reject`, { method: 'PUT' }),
};


