import axiosClient from './axiosClient';
import type {
  ICreateListingParams,
  IProviderListing,
  IProviderSlot,
} from '../types/providerListing';

export const appointmentsApi = {
  // Get all provider offers
  getProviderOffers: async (): Promise<IProviderListing[]> => {
    const response = await axiosClient.get('/appointments/offers');
    return response.data;
  },

  // Get single provider offer
  getProviderOffer: async (id: string): Promise<IProviderListing> => {
    const response = await axiosClient.get(`/appointments/offers/${id}`);
    return response.data;
  },

  // Create/Publish availability
  publishAvailability: async (
    data: ICreateListingParams
  ): Promise<IProviderListing> => {
    const response = await axiosClient.post('/appointments/publish', data);
    return response.data;
  },

  // Get available slots for a specific date and provider
  getAvailableSlots: async (
    availabilityId: string,
    date: string
  ): Promise<IProviderSlot[]> => {
    const response = await axiosClient.get(
      `/appointments/slots/${availabilityId}?date=${date}`
    );
    return response.data;
  },

  // Book an appointment slot
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

  // Cancel an appointment
  cancelAppointment: async (appointmentId: string): Promise<any> => {
    const response = await axiosClient.delete(`/appointments/${appointmentId}`);
    return response.data;
  },

  // Get provider's availability listings
  getProviderAvailability: async (
    providerId: string
  ): Promise<IProviderListing[]> => {
    const response = await axiosClient.get(
      `/appointments/provider/${providerId}/availability`
    );
    return response.data;
  },

  // Update availability
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

  // Delete availability
  deleteAvailability: async (availabilityId: string): Promise<void> => {
    await axiosClient.delete(`/appointments/availability/${availabilityId}`);
  },
};

export default appointmentsApi;
