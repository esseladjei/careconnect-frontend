import type { IUser } from './user.ts';

export interface IProviderListing {
  _id: string;
  providerId: string;
  start: string; // ISO 8601 date string
  end: string; // ISO 8601 date string
  price: number;
  appointmentType: string;
  location: string;
  workingDays?: number[]; // Array of working days (1=Mon, 2=Tue, ..., 7=Sun)
  dailyStartTime?: string; // Format: "HH:MM" (e.g., "09:00")
  dailyEndTime?: string; // Format: "HH:MM" (e.g., "17:00")
  sessionDuration?: number; // Duration in minutes (e.g., 30)
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  provider: IProvider;
  user: IUser;
}

export interface IProviderSlot {
  _id: string;
  providerId: string;
  availabilityId: string;
  date: string; // ISO 8601 date string
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  status?: string;
  patientId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateListingParams {
  userId: string;
  start: string;
  end: string;
  price: number;
  appointmentType: string;
  location: string;
  workingDays?: number[];
  dailyStartTime?: string;
  dailyEndTime?: string;
  sessionDuration?: number;
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
