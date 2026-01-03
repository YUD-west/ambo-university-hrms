// TypeScript types for the Life History Form

export type Gender = 'male' | 'female';
export type MaritalStatus = 'married' | 'single' | 'separated' | 'widowed';
export type ProficiencyLevel = 'very_good' | 'good' | 'fair' | '';

export interface PersonalInfo {
  employeeName: string;
  fatherName: string;
  paternalGrandfatherName: string;
  placeOfBirth: string;
  nationality: string;
  dateOfBirth: string;
  citizenship: string;
  gender: Gender;
  region: string;
  h3: string;
  woreda: string;
  kebele: string;
  phoneNumber: string;
  houseNumber: string;
  profilePicture?: File | string | null;
}

export interface Child {
  sonName?: string;
  sonDateOfBirth?: string;
  daughterName?: string;
  daughterDateOfBirth?: string;
}

export interface FamilyInfo {
  maritalStatus: MaritalStatus;
  spouseName: string;
  children: Child[];
}

export interface EmergencyContact {
  fullName: string;
  region: string;
  h7: string;
  woreda: string;
  kebele: string;
  phoneNumber: string;
  houseNumber: string;
}

export interface Guarantor {
  fullName: string;
  region: string;
  h7: string;
  woreda: string;
  kebele: string;
  phone: string;
}

export interface Education {
  level: string;
  schoolName: string;
  typeOfEducation: string;
  certificate: string;
}

export interface LanguageProficiency {
  language: string;
  speaking: ProficiencyLevel;
  writing: ProficiencyLevel;
  reading: ProficiencyLevel;
  listening: ProficiencyLevel;
}

export interface SpecialSkill {
  skillType: string;
  timeSpent: string;
  certificate: string;
}

export interface DrivingLicense {
  hasLicense: boolean;
  from: string;
  to: string;
  idNumber: string;
}

export interface WorkExperience {
  employerNameAndAddress: string;
  level: string;
  typeOfWork: string;
  levelAndSalary: string;
  reasonForTransferOrLeaving: string;
}

export interface Appreciation {
  actDescription: string;
  commendationOrReward: string;
}

export interface CourtPenalty {
  penaltyType: string;
  reason: string;
  punishingAuthority: string;
}

export interface AdministrativePenalty {
  reason: string;
  from: string;
  to: string;
  decision: string;
}

export interface Confirmation {
  employeeNameAndSignature: boolean;
  jobTitle: string;
  confirmingOfficialName: string;
  confirmingOfficialTitle: string;
  confirmingOfficialSignature: boolean;
}

export interface LifeHistoryFormData {
  personalInfo: PersonalInfo;
  familyInfo: FamilyInfo;
  emergencyContact: EmergencyContact;
  guarantor: Guarantor;
  education: Education[];
  languages: LanguageProficiency[];
  specialSkills: SpecialSkill[];
  drivingLicense: DrivingLicense;
  workExperience: WorkExperience[];
  appreciation: Appreciation;
  courtPenalties: CourtPenalty[];
  administrativePenalties: AdministrativePenalty[];
  confirmation: Confirmation;
}

