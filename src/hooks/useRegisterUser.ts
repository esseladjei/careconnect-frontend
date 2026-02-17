import { useMutation } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

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
  serviceDescription: string;
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
  referralCode?: string;
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

export const useRegisterUser = () => {
  return useMutation<RegisterResponse, Error, RegisterFormData>({
    mutationFn: async (data: RegisterFormData) => {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...payload } = data;
      const response = await axiosClient.post<RegisterResponse>(
        '/auth/register',
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.role === 'provider') {
        toast.success('Provider account created! Verification pending.');
      } else {
        toast.success('Account created successfully! Please log in.');
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to create account';
      toast.error(message);
    },
  });
};
