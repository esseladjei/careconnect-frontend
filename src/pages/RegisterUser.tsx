import React, { useState } from 'react';
import { GiftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  type PatientProfile,
  type ProviderProfile,
  type RegisterFormData,
  type Role,
  useRegisterUser,
} from '../hooks/useRegisterUser';

interface FormData extends RegisterFormData {
  patientProfile: PatientProfile;
  providerProfile: ProviderProfile;
  referralCode?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  patientProfile?: Record<string, string>;
  providerProfile?: Record<string, string>;
}

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'General Practice',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Telemedicine',
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate: registerUser, isPending } = useRegisterUser();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    referralCode: searchParams.get('ref') || '',
    patientProfile: {
      dateOfBirth: '',
      gender: '',
      phone: '',
      insuranceProvider: '',
      insuranceNumber: '',
    },
    providerProfile: {
      practiceName: '',
      serviceDescription: '',
      licenseNumber: '',
      specialties: [],
      clinicAddress: '',
      phone: '',
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'role') {
      setFormData((prev) => ({
        ...prev,
        role: value as Role,
      }));
      setErrors((prev) => ({
        ...prev,
        role: undefined,
      }));
      return;
    }

    // Handle top-level fields
    if (
      [
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword',
        'referralCode',
      ].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
      return;
    }

    // Handle patient profile fields
    if (name.startsWith('patient_')) {
      const fieldName = name.replace('patient_', '');
      setFormData((prev) => ({
        ...prev,
        patientProfile: {
          ...prev.patientProfile,
          [fieldName]: value,
        },
      }));
      if (errors.patientProfile?.[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          patientProfile: {
            ...prev.patientProfile,
            // [fieldName]: undefined,
          },
        }));
      }
      return;
    }

    // Handle provider profile fields
    if (name.startsWith('provider_')) {
      const fieldName = name.replace('provider_', '');
      setFormData((prev) => ({
        ...prev,
        providerProfile: {
          ...prev.providerProfile,
          [fieldName]: value,
        },
      }));
      if (errors.providerProfile?.[fieldName]) {
        setErrors((prev) => ({
          ...prev,
          providerProfile: {
            ...prev.providerProfile,
            // [fieldName]: undefined,
          },
        }));
      }
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      providerProfile: {
        ...prev.providerProfile,
        specialties: prev.providerProfile.specialties.includes(specialty)
          ? prev.providerProfile.specialties.filter((s) => s !== specialty)
          : [...prev.providerProfile.specialties, specialty],
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Common validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Provider-specific validations
    if (formData.role === 'provider') {
      const providerErrors: Record<string, string> = {};

      if (!formData.providerProfile.practiceName.trim()) {
        providerErrors.practiceName = 'Practice name is required';
      }
      if (!formData.providerProfile.licenseNumber.trim()) {
        providerErrors.licenseNumber = 'License number is required';
      }
      if (formData.providerProfile.specialties.length === 0) {
        providerErrors.specialties = 'Please select at least one specialty';
      }
      if (!formData.providerProfile.phone.trim()) {
        providerErrors.phone = 'Phone number is required';
      }

      if (Object.keys(providerErrors).length > 0) {
        newErrors.providerProfile = providerErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    registerUser(formData, {
      onSuccess: (response) => {
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'patient',
          patientProfile: {
            dateOfBirth: '',
            gender: '',
            phone: '',
            insuranceProvider: '',
            insuranceNumber: '',
          },
          providerProfile: {
            practiceName: '',
            serviceDescription: '',
            licenseNumber: '',
            specialties: [],
            clinicAddress: '',
            phone: '',
          },
        });

        // Navigate based on role
        if (response.role === 'provider') {
          setTimeout(
            () =>
              navigate(`/provider/onboarding/${response.userId}`, {
                state: {
                  status: response.providerStatus,
                  userId: response.userId,
                },
              }),
            1500
          );
        } else {
          setTimeout(() => navigate('/login'), 1500);
        }
      },
    });
  };

  const isProvider = formData.role === 'provider';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Join CareConnect as a patient or healthcare provider
        </p>

        {/* Role Selector */}
        <div className="mb-6 flex gap-4">
          <label className="flex items-center cursor-pointer flex-1">
            <input
              type="radio"
              name="role"
              value="patient"
              checked={formData.role === 'patient'}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              I'm a Patient
              <span className="block text-xs text-gray-500">
                Looking for healthcare services
              </span>
            </span>
          </label>
          <label className="flex items-center cursor-pointer flex-1">
            <input
              type="radio"
              name="role"
              value="provider"
              checked={formData.role === 'provider'}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              I'm a Provider
              <span className="block text-xs text-gray-500">
                Offering healthcare services
              </span>
            </span>
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  errors.firstName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  errors.lastName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="referralCode"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Referral Code (Optional)
            </label>
            <input
              type="text"
              id="referralCode"
              name="referralCode"
              placeholder="Enter referral code if you have one"
              value={formData.referralCode || ''}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <div className="inline-flex items-center gap-2">
              <GiftIcon className="h-4 w-4 text-amber-500" aria-hidden="true" />
              <span>
                Use a friend's referral code to get a discount on your first
                booking.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Provider-Specific Fields */}
          {isProvider && (
            <div className="border-t pt-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Provider Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="provider_practiceName"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Practice Name *
                  </label>
                  <input
                    type="text"
                    id="provider_practiceName"
                    name="provider_practiceName"
                    placeholder="e.g., Downtown Clinic"
                    value={formData.providerProfile.practiceName}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      errors.providerProfile?.practiceName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.providerProfile?.practiceName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.providerProfile.practiceName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="provider_licenseNumber"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    License Number *
                  </label>
                  <input
                    type="text"
                    id="provider_licenseNumber"
                    name="provider_licenseNumber"
                    placeholder="e.g., MED-123456"
                    value={formData.providerProfile.licenseNumber}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      errors.providerProfile?.licenseNumber
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.providerProfile?.licenseNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.providerProfile.licenseNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="provider_servicerDescription"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Service Description *
                </label>
                <input
                  type="text"
                  id="provider_servicerDescription"
                  name="provider_serviceDescription"
                  placeholder="Enter the description of your service"
                  value={formData.providerProfile.serviceDescription}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    errors.providerProfile?.serviceDescription
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {errors.providerProfile?.serviceDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.providerProfile?.serviceDescription}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Specialties *{' '}
                  {errors.providerProfile?.specialties && (
                    <span className="text-red-500 text-sm">
                      {errors.providerProfile.specialties}
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SPECIALTIES.map((specialty) => (
                    <label
                      key={specialty}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.providerProfile.specialties.includes(
                          specialty
                        )}
                        onChange={() => handleSpecialtyToggle(specialty)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {specialty}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="provider_phone"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="provider_phone"
                    name="provider_phone"
                    placeholder="e.g., +1234567890"
                    value={formData.providerProfile.phone}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                      errors.providerProfile?.phone
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.providerProfile?.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.providerProfile.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="provider_clinicAddress"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Clinic Address (Optional)
                </label>
                <input
                  type="text"
                  id="provider_clinicAddress"
                  name="provider_clinicAddress"
                  placeholder="e.g., 123 Main St, City, Country"
                  value={formData.providerProfile.clinicAddress}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          )}

          {/* Patient-Specific Fields */}
          {!isProvider && (
            <div className="border-t pt-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Health Information (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="patient_dateOfBirth"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="patient_dateOfBirth"
                    name="patient_dateOfBirth"
                    value={formData.patientProfile.dateOfBirth}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="patient_gender"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Gender
                  </label>
                  <select
                    id="patient_gender"
                    name="patient_gender"
                    value={formData.patientProfile.gender}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="patient_phone"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="patient_phone"
                    name="patient_phone"
                    placeholder="e.g., +1234567890"
                    value={formData.patientProfile.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="patient_insuranceProvider"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Insurance Provider
                  </label>
                  <input
                    type="text"
                    id="patient_insuranceProvider"
                    name="patient_insuranceProvider"
                    placeholder="e.g., Blue Cross"
                    value={formData.patientProfile.insuranceProvider}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="patient_insuranceNumber"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Insurance Number
                </label>
                <input
                  type="text"
                  id="patient_insuranceNumber"
                  name="patient_insuranceNumber"
                  placeholder="Your insurance member ID"
                  value={formData.patientProfile.insuranceNumber}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-md mt-6"
          >
            {isPending ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
