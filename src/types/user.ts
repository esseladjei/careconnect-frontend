export interface IUserProfile {
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
  timezone?: string;
}

export interface IUserPassword {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface IPatientProfile {
  gender?: string;
  phone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export interface IProviderProfile {
  practiceName: string;
  licenseNumber: string;
  specialties: string[];
  clinicAddress?: string;
  phone: string;
  hourlyRate?: number;
}

//export type Role = 'patient' | 'provider';

/*export interface RegisterFormData {
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
}*/

export interface IUserResponse {
  user: IUserProfile;
  profile: IProviderProfile | IPatientProfile;
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
  timezone: string;
}
