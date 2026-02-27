export interface UserProfile {
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  location?: string;
  gender?: string;
  dateOfBirth?: Date;
  languages?: string[];
  address?: string;
  createdAt?: Date;
}

export interface UserPassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type Role = 'patient' | 'provider';

export interface PatientProfile {
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

export interface UserResponse {
  user: UserProfile;
  profile: ProviderProfile | PatientProfile;
}

export interface IUser {
  _id: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  role: string;
  dateOfBirth: string;
  gender: string;
  profilePicture: string;
  address: string;
  location: string;
  phone: string;
  languages: string[];
}
