import React, { useState } from 'react';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  GiftIcon,
  LockClosedIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  type PatientProfile,
  type ProviderProfile,
  type RegisterFormData,
  type Role,
  useRegisterUser,
} from '../hooks/useRegisterUser';
import { validateGhanaPhoneNumber } from '../utils/phoneValidation';
import { validatePasswordMatch } from '../utils/passwordValidation';
import PhoneInput from '../components/PhoneInput';
import PasswordInput from '../components/PasswordInput';
import SEO from '../components/SEO';
import { validateDateOfBirth } from '../hooks/useDate.ts';

interface FormData extends RegisterFormData {
  patientProfile: PatientProfile;
  providerProfile: ProviderProfile;
  referralCode?: string;
}

interface FormErrors {
  title?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
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
  'Gynecologist',
  'Midwifery and Obstetrical',
  'Telemedicine & Others',
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate: registerUser, isPending } = useRegisterUser();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
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
      dateOfBirth: '',
      gender: '',
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        'title',
        'firstName',
        'lastName',
        'email',
        'gender',
        'dateOfBirth',
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
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    const dobError = validateDateOfBirth(formData.dateOfBirth);
    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (dobError) {
      newErrors.dateOfBirth =
        'Please enter a valid date. You must be at least 18 years old.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePasswordMatch(
        formData.password,
        formData.confirmPassword
      );
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.error;
      }
    }

    // Provider-specific validations
    if (formData.role === 'provider') {
      const providerErrors: Record<string, string> = {};

      if (!formData.providerProfile.practiceName.trim()) {
        providerErrors.practiceName = 'Practice name is required';
      }
      if (!formData.providerProfile.serviceDescription.trim()) {
        providerErrors.serviceDescription =
          'Service description is required. Describe the healthcare services you offer in 100 characters or less.';
      }
      if (!formData.providerProfile.licenseNumber.trim()) {
        providerErrors.licenseNumber = 'License number is required';
      }
      if (formData.providerProfile.specialties.length === 0) {
        providerErrors.specialties = 'Please select at least one specialty';
      }
      if (!formData.providerProfile.phone.trim()) {
        providerErrors.phone = 'Phone number is required';
      } else {
        // Validate Ghana phone number format
        const phoneValidation = validateGhanaPhoneNumber(
          formData.providerProfile.phone
        );
        if (!phoneValidation.isValid) {
          providerErrors.phone = phoneValidation.message;
        }
      }

      if (Object.keys(providerErrors).length > 0) {
        newErrors.providerProfile = providerErrors;
      }
    }

    // Patient-specific validations (phone is optional but if provided, must be valid)
    if (formData.role === 'patient' && formData.patientProfile?.phone?.trim()) {
      const patientErrors: Record<string, string> = {};
      const phoneValidation = validateGhanaPhoneNumber(
        formData.patientProfile.phone
      );
      if (!phoneValidation.isValid) {
        patientErrors.phone = phoneValidation.message;
      }

      if (Object.keys(patientErrors).length > 0) {
        newErrors.patientProfile = patientErrors;
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
      onSuccess: () => {
        // Reset form
        setFormData({
          title: '',
          firstName: '',
          lastName: '',
          gender: '',
          dateOfBirth: '',
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
        setTimeout(() => navigate('/login'), 1500);
      },
    });
  };

  const isProvider = formData.role === 'provider';

  return (
    <>
      <SEO
        title="Register for CareConnect - Create Your Account | Ghana's Telemedicine Platform"
        description="Sign up for CareConnect as a patient or healthcare provider. Create your account in minutes and start booking consultations or managing your practice."
        keywords="register CareConnect, sign up Ghana healthcare, telemedicine account, doctor registration, patient registration"
        ogTitle="Create Your CareConnect Account"
        ogDescription="Join thousands of Ghanaians using CareConnect for healthcare services. Register now as a patient or provider."
      />
      {/* Background with gradient and decorative elements */}
      <div className="min-h-screen bg-gradient-to-br from-slate-700 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        {/* Container */}
        <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-16 relative z-10">
          {/* Trust Indicators at Top */}
          <div className="mb-12 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Secure Card */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full mb-3 border border-white/20">
                  <CheckCircleIcon className="h-7 w-7 text-green-300" />
                </div>
                <h4 className="font-semibold text-white mb-1 text-sm">
                  Secure & Safe
                </h4>
                <p className="text-blue-100 text-xs">
                  Your data is encrypted and protected
                </p>
              </div>

              {/* Verified Card */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full mb-3 border border-white/20">
                  <LockClosedIcon className="h-7 w-7 text-amber-300" />
                </div>
                <h4 className="font-semibold text-white mb-1 text-sm">
                  Verified Providers
                </h4>
                <p className="text-blue-100 text-xs">
                  All providers are licensed professionals
                </p>
              </div>

              {/* Community Card */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full mb-3 border border-white/20">
                  <UserGroupIcon className="h-7 w-7 text-cyan-300" />
                </div>
                <h4 className="font-semibold text-white mb-1 text-sm">
                  Trusted Community
                </h4>
                <p className="text-blue-100 text-xs">
                  Join 5,000+ satisfied users
                </p>
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg mb-4 border border-white/20">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Create Your Account
            </h1>
            <p className="text-blue-100 text-sm md:text-base max-w-lg mx-auto">
              Join CareConnect to access quality healthcare services. Choose
              your role below and get started.
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
            {/* Role Selection Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 md:px-8 py-5 md:py-6 border-b border-white/10">
              <h2 className="text-base font-semibold text-white mb-4">
                Who are you?
              </h2>

              {/* Role Selector with Enhanced Styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Patient Role Card */}
                <label
                  className={`group relative flex flex-col items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    formData.role === 'patient'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={formData.role === 'patient'}
                    onChange={handleChange}
                    className="sr-only"
                    aria-label="Register as a patient"
                  />
                  <div className="flex items-center gap-2 w-full mb-1">
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                        formData.role === 'patient'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600 group-hover:bg-blue-200'
                      }`}
                    >
                      <UserIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      I'm a Patient
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 ml-9">
                    Looking for healthcare services and consultations
                  </p>
                </label>

                {/* Provider Role Card */}
                <label
                  className={`group relative flex flex-col items-start p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    formData.role === 'provider'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={formData.role === 'provider'}
                    onChange={handleChange}
                    className="sr-only"
                    aria-label="Register as a healthcare provider"
                  />
                  <div className="flex items-center gap-2 w-full mb-1">
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                        formData.role === 'provider'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600 group-hover:bg-blue-200'
                      }`}
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2 w-full mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        I'm a Provider
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 ml-9">
                    Offering healthcare services and building your practice
                  </p>
                </label>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="px-6 md:px-8 py-6 md:py-7">
              {/* Common Fields Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                  Account Information
                </h3>

                {/* Title, First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Title */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="title"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      Title<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="title"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleChange}
                      aria-invalid={!!errors.title}
                      aria-describedby={
                        errors.title ? 'title-error' : undefined
                      }
                      className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors  ${
                        errors.title
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <option value="">Select</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Miss.">Miss.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                      <option value="Rev.">Rev.</option>
                      <option value="Sir.">Sir.</option>
                      <option value="Lady.">Lady.</option>
                      <option value="Madam.">Madam.</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.title && (
                      <p
                        id="title-error"
                        className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                      >
                        <ExclamationCircleIcon className="h-3 w-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* First Name */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="firstName"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.firstName}
                      aria-describedby={
                        errors.firstName ? 'firstName-error' : undefined
                      }
                      className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.firstName
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    {errors.firstName && (
                      <p
                        id="firstName-error"
                        className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                      >
                        <ExclamationCircleIcon className="h-3 w-3" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="lastName"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={
                        errors.lastName ? 'lastName-error' : undefined
                      }
                      className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.lastName
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    {errors.lastName && (
                      <p
                        id="lastName-error"
                        className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                      >
                        <ExclamationCircleIcon className="h-3 w-3" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4 flex flex-col">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-2"
                  >
                    <EnvelopeIcon className="h-3.5 w-3.5 text-gray-600" />
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-white'
                    }`}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                    >
                      <ExclamationCircleIcon className="h-3 w-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <LockClosedIcon className="h-4 w-4 text-blue-600" />
                  Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <PasswordInput
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, password: value }))
                    }
                    label="Password"
                    placeholder="Create a strong password"
                    error={errors.password}
                    required={true}
                    showStrengthMeter={true}
                    showChecklist={true}
                  />

                  <div className="flex flex-col h-full">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex-1 flex flex-col justify-start">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        aria-required="true"
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={
                          errors.confirmPassword
                            ? 'confirmPassword-error'
                            : undefined
                        }
                        className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.confirmPassword
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p
                        id="confirmPassword-error"
                        className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                      >
                        <ExclamationCircleIcon className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Provider-Specific Fields */}
              {isProvider && (
                <div className="mb-6 pb-6 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-4 mt-6 flex items-center gap-2 uppercase tracking-wide">
                    <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                    Practice Information
                  </h3>

                  {/* Practice Name */}
                  <div className="mb-4 flex flex-col">
                    <label
                      htmlFor="provider_practiceName"
                      className="block text-xs font-semibold text-gray-600 mb-1"
                    >
                      Practice Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="provider_practiceName"
                      name="provider_practiceName"
                      placeholder="e.g., Downtown Clinic"
                      value={formData.providerProfile.practiceName}
                      onChange={handleChange}
                      aria-required="true"
                      aria-invalid={!!errors.providerProfile?.practiceName}
                      className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.providerProfile?.practiceName
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    {errors.providerProfile?.practiceName && (
                      <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1">
                        <ExclamationCircleIcon className="h-3 w-3" />
                        {errors.providerProfile.practiceName}
                      </p>
                    )}
                  </div>

                  {/* Gender, Date of Birth, Phone number - Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="provider_gender"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="provider_gender"
                        name="provider_gender"
                        value={formData.providerProfile.gender || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm text-gray-900 
                         ${
                           errors.firstName
                             ? 'border-red-500 bg-red-50'
                             : 'border-gray-300 bg-white'
                         }`}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <p
                          id="title-error"
                          className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                        >
                          <ExclamationCircleIcon className="h-3 w-3" />
                          {errors.gender}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="provider_dateOfBirth"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="provider_dateOfBirth"
                        name="provider_dateOfBirth"
                        value={formData.providerProfile.dateOfBirth || ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm text-gray-900 
                         ${
                           errors.firstName
                             ? 'border-red-500 bg-red-50'
                             : 'border-gray-300 bg-white'
                         }`}
                      />
                      {errors.dateOfBirth && (
                        <p
                          id="title-error"
                          className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                        >
                          <ExclamationCircleIcon className="h-3 w-3" />
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>
                    <PhoneInput
                      id="provider_phone"
                      name="provider_phone"
                      value={formData.providerProfile.phone}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          providerProfile: {
                            ...prev.providerProfile,
                            phone: value,
                          },
                        }))
                      }
                      error={errors.providerProfile?.phone}
                      required={false}
                      showOperatorInfo={true}
                      variant="registration"
                    />
                  </div>

                  {/* Service Description, Phone Number, Clinic Address - Row 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="provider_servicerDescription"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Service Description{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="provider_servicerDescription"
                        name="provider_serviceDescription"
                        placeholder="Describe the services you offer"
                        value={formData.providerProfile.serviceDescription}
                        onChange={handleChange}
                        aria-required="true"
                        aria-invalid={
                          !!errors.providerProfile?.serviceDescription
                        }
                        className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.providerProfile?.serviceDescription
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      />
                      {errors.providerProfile?.serviceDescription && (
                        <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-3 w-3" />
                          {errors.providerProfile?.serviceDescription}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="provider_licenseNumber"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        License Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="provider_licenseNumber"
                        name="provider_licenseNumber"
                        placeholder="e.g., MED-123456"
                        value={formData.providerProfile.licenseNumber}
                        onChange={handleChange}
                        aria-required="true"
                        aria-invalid={!!errors.providerProfile?.licenseNumber}
                        className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                          errors.providerProfile?.licenseNumber
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      />
                      {errors.providerProfile?.licenseNumber && (
                        <p className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1">
                          <ExclamationCircleIcon className="h-3 w-3" />
                          {errors.providerProfile.licenseNumber}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="provider_clinicAddress"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Clinic Address (Optional)
                      </label>
                      <input
                        type="text"
                        id="provider_clinicAddress"
                        name="provider_clinicAddress"
                        placeholder="e.g., 123 Main St, Accra, Ghana"
                        value={formData.providerProfile.clinicAddress}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-2 uppercase tracking-wide">
                      <span>
                        Specialties <span className="text-red-500">*</span>
                      </span>
                      {errors.providerProfile?.specialties && (
                        <span className="text-red-500 text-xs font-medium bg-red-50 px-2 py-0.5 rounded">
                          {errors.providerProfile.specialties}
                        </span>
                      )}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {SPECIALTIES.map((specialty) => (
                        <label
                          key={specialty}
                          className={`group relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                            formData.providerProfile.specialties.includes(
                              specialty
                            )
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.providerProfile.specialties.includes(
                              specialty
                            )}
                            onChange={() => handleSpecialtyToggle(specialty)}
                            className="w-4 h-4 text-blue-600 cursor-pointer"
                            aria-label={`Select ${specialty}`}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-900 group-hover:text-gray-900">
                            {specialty}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Referral Code */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="referralCode"
                      className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-2"
                    >
                      <GiftIcon className="h-3.5 w-3.5 text-amber-600" />
                      Referral Code (Optional)
                    </label>
                    <input
                      type="text"
                      id="referralCode"
                      name="referralCode"
                      placeholder="e.g., FRIEND2024"
                      value={formData.referralCode || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 text-sm text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Get discounts on your first booking with a referral code
                    </p>
                  </div>
                </div>
              )}

              {/* Patient-Specific Fields */}
              {!isProvider && (
                <div className="mb-6 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-900 mb-6 mt-8 flex items-center gap-2 uppercase tracking-wide">
                    <UserIcon className="h-4 w-4 text-blue-600" />
                    Health Information (Optional)
                  </h3>

                  {/* Date of Birth and Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="patient_dateOfBirth"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="patient_dateOfBirth"
                        name="patient_dateOfBirth"
                        value={formData.patientProfile.dateOfBirth}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 tex-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors
                        ${
                          errors.firstName
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      />
                      {errors.dateOfBirth && (
                        <p
                          id="title-error"
                          className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                        >
                          <ExclamationCircleIcon className="h-3 w-3" />
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="patient_gender"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="patient_gender"
                        name="patient_gender"
                        value={formData.patientProfile.gender}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors   ${
                          errors.firstName
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && (
                        <p
                          id="title-error"
                          className="text-red-600 text-xs font-medium mt-1 flex items-center gap-1"
                        >
                          <ExclamationCircleIcon className="h-3 w-3" />
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone and Referral Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <PhoneInput
                      id="patient_phone"
                      name="patient_phone"
                      value={formData.patientProfile.phone || ''}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          patientProfile: {
                            ...prev.patientProfile,
                            phone: value,
                          },
                        }))
                      }
                      error={errors.patientProfile?.phone}
                      required={false}
                      showOperatorInfo={true}
                      variant="registration"
                    />

                    <div className="flex flex-col">
                      <label
                        htmlFor="referralCode"
                        className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-2"
                      >
                        <GiftIcon className="h-3.5 w-3.5 text-amber-600" />
                        Referral Code (Optional)
                      </label>
                      <input
                        type="text"
                        id="referralCode"
                        name="referralCode"
                        placeholder="e.g., FRIEND2024"
                        value={formData.referralCode || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border text-sm text-gray-900 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors "
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Get discounts on your first booking with a referral code
                      </p>
                    </div>
                  </div>

                  {/* Insurance Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col">
                      <label
                        htmlFor="patient_insuranceProvider"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        id="patient_insuranceProvider"
                        name="patient_insuranceProvider"
                        placeholder="e.g., Blue Cross, NHIA"
                        value={formData.patientProfile.insuranceProvider}
                        onChange={handleChange}
                        className="w-full px-3 py-2  text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label
                        htmlFor="patient_insuranceNumber"
                        className="block text-xs font-semibold text-gray-600 mb-1"
                      >
                        Insurance Number
                      </label>
                      <input
                        type="text"
                        id="patient_insuranceNumber"
                        name="patient_insuranceNumber"
                        placeholder="Your member ID"
                        value={formData.patientProfile.insuranceNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 mb-6">
                <button
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg text-sm hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 group"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin">
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center">
                <a
                  href="/login"
                  className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors inline-flex items-center gap-1 group"
                >
                  Sign in instead
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
