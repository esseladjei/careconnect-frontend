import axiosClient from './axiosClient';
import type {
  ICreateListingParams,
  IProviderListing,
  IProviderSlot,
} from '../types/providerListing';
import type {
  Appointment,
  CancelAppointmentParams,
  CheckInAppointmentParams,
  CheckOutAppointmentParams,
  ConfirmAppointmentParams,
  FetchAppointmentsParams,
  IGetAppointmentParams,
} from '../types/appointment.ts';

export const appointmentsApi = {
  // ...existing code...
  getProviderOffers: async (): Promise<IProviderListing[]> => {
    const response = await axiosClient.get('/appointments/offers');
    return response.data;
  },

  getProviderOffer: async (id: string): Promise<IProviderListing> => {
    const response = await axiosClient.get(`/appointments/offers/${id}`);
    return response.data;
  },

  checkExistingReview: async (
    appointmentId: string,
    patientId: string
  ): Promise<{ existing: boolean }> => {
    const response = await axiosClient.get(
      `/reviews/${appointmentId}/${patientId}/check-review`
    );
    return response.data;
  },
  checkExistingFlag: async (
    appointmentId: string,
    providerId: string
  ): Promise<{ existing: boolean }> => {
    const response = await axiosClient.get(
      `/reviews/${appointmentId}/${providerId}/check-flag`
    );
    return response.data;
  },
  publishAvailability: async (
    data: ICreateListingParams
  ): Promise<IProviderListing> => {
    const response = await axiosClient.post('/appointments/publish', data);
    return response.data;
  },

  getAvailableSlots: async (
    availabilityId: string,
    date: string
  ): Promise<IProviderSlot[]> => {
    const response = await axiosClient.get(
      `/appointments/slots/${availabilityId}?date=${date}`
    );
    return response.data;
  },

  bookAppointment: async (data: {
    slotId: string;
    providerId: string;
    patientId?: string;
    availabilityId: string;
    knownAllergies: string;
    duration: number;
    patientCondition: string;
    scheduledAt: Date;
    status: 'pending';
    price: number;
    appointmentType: string;
  }): Promise<any> => {
    const response = await axiosClient.post('/appointments/booklisting', data);
    return response.data;
  },

  getProviderAvailability: async (
    providerId: string
  ): Promise<IProviderListing[]> => {
    const response = await axiosClient.get(
      `/appointments/provider/${providerId}/availability`
    );
    return response.data;
  },

  updateAvailability: async (
    availabilityId: string,
    data: Partial<ICreateListingParams>
  ): Promise<IProviderListing> => {
    const response = await axiosClient.put(
      `/appointments/availability/${availabilityId}`,
      data
    );
    return response.data;
  },

  deleteAvailability: async (availabilityId: string): Promise<void> => {
    await axiosClient.delete(`/appointments/availability/${availabilityId}`);
  },

  // Fetch user appointments with filters
  fetchUserAppointments: async (
    params: FetchAppointmentsParams
  ): Promise<Appointment[]> => {
    const { actorId, ...queryParams } = params;
    const response = await axiosClient.get(
      `/appointments/${actorId}/fetchappointments`,
      {
        params: queryParams,
      }
    );
    return response.data;
  },
  // Fetch user appointment By AppointmentId
  fetchUserAppointment: async (
    params: IGetAppointmentParams
  ): Promise<Appointment> => {
    const { appointmentId } = params;
    const response = await axiosClient.get(`/appointments/${appointmentId}`);
    return response.data;
  },
  // Confirm an appointment
  confirmAppointment: async (
    params: ConfirmAppointmentParams
  ): Promise<Appointment> => {
    const { appointmentId, ...data } = params;
    const response = await axiosClient.patch(
      `/appointments/${appointmentId}/confirm`,
      data
    );
    return response.data;
  },

  // Cancel an appointment
  cancelAppointment: async (
    params: CancelAppointmentParams
  ): Promise<Appointment> => {
    const { appointmentId, ...data } = params;
    const response = await axiosClient.patch(
      `/appointments/${appointmentId}/cancel`,
      data
    );
    return response.data;
  },

  // Check in an appointment
  checkInAppointment: async (
    params: CheckInAppointmentParams
  ): Promise<Appointment> => {
    const { appointmentId } = params;
    const response = await axiosClient.patch(
      `/appointments/${appointmentId}/check-in`
    );
    return response.data;
  },

  // Check out an appointment
  checkOutAppointment: async (
    params: CheckOutAppointmentParams
  ): Promise<Appointment> => {
    const { appointmentId } = params;
    const response = await axiosClient.patch(
      `/appointments/${appointmentId}/check-out`
    );
    return response.data;
  },
};

export default appointmentsApi;
