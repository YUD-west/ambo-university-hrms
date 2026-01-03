// TypeScript types for Social Security Agency Form Tu-1

export interface WorkplaceInfo {
  workplaceName: string;
  poBoxNumber: string;
  phoneNumber: string;
}

export interface EmployeePersonalStatus {
  fullNameWithSurname: string;
  gender: string;
  motherFullName: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  citizenshipObtainedBy: 'birth' | 'legal_permit';
  legalPermitEvidence?: File | string;
}

export interface ServiceHistory {
  serialNumber: number;
  officeName: string;
  serviceStart: {
    day: string;
    month: string;
    year: string;
  };
  serviceEnd: {
    day: string;
    month: string;
    year: string;
  };
  monthlySalary: string;
  terminationReason: string;
}

export interface SpouseInfo {
  fullName: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  photo?: File | string;
  marriageCertificate?: File | string;
}

export interface Child {
  serialNumber: number;
  fullName: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  gender: string;
  motherFullName: string;
  birthCertificate?: File | string;
  isAdopted: boolean;
  adoptionEvidence?: File | string;
}

export interface ParentInfo {
  fullName: string;
  meansOfLivelihood: string;
  yearOfBirth: string;
}

export interface ParentalSupport {
  supportSituation: string;
  supportBy: 'salary' | 'other';
}

export interface SocialSecurityFormData {
  formNumber: string;
  pensionIdNumber: string;
  employerOfficeIdNumber: string;
  employeePhoto?: File | string;
  workplaceInfo: WorkplaceInfo;
  employeePersonalStatus: EmployeePersonalStatus;
  serviceHistory: ServiceHistory[];
  spouseInfo: SpouseInfo;
  children: Child[];
  fatherInfo: ParentInfo;
  motherInfo: ParentInfo;
  parentalSupport: ParentalSupport;
  employeeFullName: string;
  employeeSignature: boolean;
  submissionDate: string;
  employmentEvidence?: File | string;
  serviceRecord?: File | string;
  previousJobApplication?: File | string;
  curriculumVitae?: File | string;
}

