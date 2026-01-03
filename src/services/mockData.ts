import type { Employee, Department, Attendance, LeaveRequest, PerformanceReview, DashboardStats } from '../types/hrTypes';

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    hireDate: '2022-01-15',
    salary: 95000,
    status: 'active',
    address: '123 Main St, City, State 12345',
    dateOfBirth: '1990-05-20',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1-555-0102',
      relationship: 'Spouse'
    }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1-555-0201',
    position: 'HR Manager',
    department: 'Human Resources',
    hireDate: '2021-03-10',
    salary: 85000,
    status: 'active',
    address: '456 Oak Ave, City, State 12345',
    dateOfBirth: '1988-08-15',
    emergencyContact: {
      name: 'Bob Smith',
      phone: '+1-555-0202',
      relationship: 'Spouse'
    }
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@company.com',
    phone: '+1-555-0301',
    position: 'Marketing Director',
    department: 'Marketing',
    hireDate: '2020-06-01',
    salary: 110000,
    status: 'active',
    address: '789 Pine Rd, City, State 12345',
    dateOfBirth: '1985-11-30',
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '+1-555-0302',
      relationship: 'Spouse'
    }
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@company.com',
    phone: '+1-555-0401',
    position: 'Product Manager',
    department: 'Product',
    hireDate: '2023-02-20',
    salary: 105000,
    status: 'active',
    address: '321 Elm St, City, State 12345',
    dateOfBirth: '1992-04-10',
    emergencyContact: {
      name: 'David Williams',
      phone: '+1-555-0402',
      relationship: 'Brother'
    }
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    phone: '+1-555-0501',
    position: 'Sales Representative',
    department: 'Sales',
    hireDate: '2023-08-15',
    salary: 65000,
    status: 'on-leave',
    address: '654 Maple Dr, City, State 12345',
    dateOfBirth: '1995-07-25',
    emergencyContact: {
      name: 'Lisa Brown',
      phone: '+1-555-0502',
      relationship: 'Mother'
    }
  }
];

// Mock Departments
export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    description: 'Software development and technical operations',
    managerId: '1',
    managerName: 'John Doe',
    employeeCount: 25,
    budget: 2500000
  },
  {
    id: '2',
    name: 'Human Resources',
    description: 'Employee relations and talent management',
    managerId: '2',
    managerName: 'Jane Smith',
    employeeCount: 8,
    budget: 800000
  },
  {
    id: '3',
    name: 'Marketing',
    description: 'Brand management and marketing campaigns',
    managerId: '3',
    managerName: 'Michael Johnson',
    employeeCount: 15,
    budget: 1500000
  },
  {
    id: '4',
    name: 'Product',
    description: 'Product strategy and development',
    managerId: '4',
    managerName: 'Emily Williams',
    employeeCount: 12,
    budget: 1200000
  },
  {
    id: '5',
    name: 'Sales',
    description: 'Sales operations and customer relations',
    managerId: '5',
    managerName: 'David Brown',
    employeeCount: 20,
    budget: 2000000
  }
];

// Mock Attendance
export const mockAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00',
    checkOut: '18:00',
    hoursWorked: 9,
    status: 'present'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Smith',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:45',
    checkOut: '17:30',
    hoursWorked: 8.75,
    status: 'present'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Michael Johnson',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:15',
    checkOut: '18:00',
    hoursWorked: 8.75,
    status: 'late'
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Emily Williams',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00',
    checkOut: '17:00',
    hoursWorked: 8,
    status: 'present'
  }
];

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '5',
    employeeName: 'David Brown',
    type: 'vacation',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    days: 5,
    status: 'approved',
    reason: 'Family vacation',
    submittedDate: '2024-01-01'
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'John Doe',
    type: 'sick',
    startDate: '2024-01-10',
    endDate: '2024-01-10',
    days: 1,
    status: 'approved',
    reason: 'Medical appointment',
    submittedDate: '2024-01-09'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Michael Johnson',
    type: 'personal',
    startDate: '2024-01-25',
    endDate: '2024-01-25',
    days: 1,
    status: 'pending',
    reason: 'Personal matters',
    submittedDate: '2024-01-20'
  }
];

// Mock Performance Reviews
export const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    reviewPeriod: 'Q4 2023',
    reviewDate: '2024-01-05',
    overallRating: 4.5,
    goals: [
      'Complete project X by end of Q4',
      'Improve code review process',
      'Mentor junior developers'
    ],
    achievements: [
      'Successfully delivered project X ahead of schedule',
      'Reduced bug rate by 30%',
      'Mentored 3 junior developers'
    ],
    areasForImprovement: [
      'Improve documentation',
      'Increase test coverage'
    ],
    reviewerName: 'Tech Lead',
    comments: 'Excellent performance. Keep up the great work!'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Smith',
    reviewPeriod: 'Q4 2023',
    reviewDate: '2024-01-05',
    overallRating: 4.8,
    goals: [
      'Improve employee satisfaction',
      'Streamline hiring process',
      'Implement new HR policies'
    ],
    achievements: [
      'Increased employee satisfaction by 15%',
      'Reduced time-to-hire by 20%',
      'Successfully implemented new policies'
    ],
    areasForImprovement: [
      'Continue improving onboarding process'
    ],
    reviewerName: 'CEO',
    comments: 'Outstanding leadership and results.'
  }
];

// Mock Dashboard Stats
export const getDashboardStats = (): DashboardStats => {
  return {
    totalEmployees: mockEmployees.length,
    activeEmployees: mockEmployees.filter(e => e.status === 'active').length,
    onLeave: mockEmployees.filter(e => e.status === 'on-leave').length,
    departments: mockDepartments.length,
    todayAttendance: {
      present: mockAttendance.filter(a => a.status === 'present').length,
      absent: 1,
      late: mockAttendance.filter(a => a.status === 'late').length
    },
    pendingLeaveRequests: mockLeaveRequests.filter(l => l.status === 'pending').length,
    monthlyHires: 2
  };
};

