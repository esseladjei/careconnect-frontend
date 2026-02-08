export interface IProviderListing {
  _id: string;
  providerId: string;
  start: string; // ISO 8601 date string
  end: string; // ISO 8601 date string
  price: number;
  appointmentType: string;
  location: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  provider: IProvider;
  user: IUser;
}

export interface IProvider {
  _id: string;
  userId: string;
  serviceDescription: string;
  specialties: string[];
  available: string;
  clinicPhone: string;
  clinicAddress: string;
  experience: number;
  practiceName: string;
  licenseNumber: string;
  providerStatus: string;
  hourlyRate: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  location: string;
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  emailVerified: boolean;
  phone: string;
  languages: string[];
  gender: string;
  title: string;
}
