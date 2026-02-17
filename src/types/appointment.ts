// Appointment types

import type {
  IProvider,
  IProviderListing,
  IProviderSlot,
} from './providerListing.ts';
import type { IUser } from './user.ts';

export interface Appointment {
  _id: string;
  scheduledAt: string;
  time: string;
  doctor: string;
  specialisation: string;
  type: 'In-Person' | 'Phone Consultation' | 'Home Visit';
  location: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  appointmentType: string;
  providerId: IProvider;
  availabilityId: IProviderListing;
  slotId: IProviderSlot;
  patientId: {
    userId: IUser;
  };
}

export interface FetchAppointmentsParams {
  userId: string;
  role: string;
  actorId: string; //patientId or providerId
  start: string;
  end: string;
}

export interface ConfirmAppointmentParams {
  appointmentId: string;
  status?: string;
}

export interface CancelAppointmentParams {
  appointmentId: string;
  cancelledBy: string;
  reason?: string;
}
