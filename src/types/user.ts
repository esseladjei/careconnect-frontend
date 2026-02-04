export interface UserProfile {
  title: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserPassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type Role = 'patient' | 'provider';

export interface PatientProfile {
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface ProviderProfile {
  practiceName: string;
  licenseNumber: string;
  specialties: string[];
  clinicAddress?: string;
  phone: string;
  hourlyRate?: number;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
  patientProfile?: PatientProfile;
  providerProfile?: ProviderProfile;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  role: Role;
  providerStatus?: 'pending' | 'verified' | 'rejected';
  message: string;
}
