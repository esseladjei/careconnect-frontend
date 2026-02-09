import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import appointmentsApi from '../api/appointmentsApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import SEO from '../components/SEO';
import {
  BookingSidebar,
  OverviewTab,
  ProviderHeader,
  ProviderTabs,
  ReviewsTab,
} from '../components/booking';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { IProviderListing, IProviderSlot } from '../types/providerListing';
import { useAuth } from '../hooks/useAuth.ts';

// Types
interface Review {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  slotId?: string;
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    rating: 5,
    date: '2026-01-15',
    comment: 'Excellent care and very professional. Highly recommend!',
    verified: true,
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    rating: 4,
    date: '2026-01-10',
    comment: 'Very knowledgeable and took time to explain everything.',
    verified: true,
  },
  {
    id: '3',
    patientName: 'Emma Davis',
    rating: 5,
    date: '2026-01-05',
    comment: "Best healthcare experience I've had. Very caring and attentive.",
    verified: true,
  },
];

const BookingPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { providerId } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>(
    'overview'
  );
  const [patientCondition, setPatientCondition] = useState<string>('');
  const [knownAllergy, setKnownAllergy] = useState<string>('');

  // Fetch provider details
  const {
    data: providerOfferData,
    isLoading,
    isError,
  } = useQuery<IProviderListing>({
    queryKey: ['provider', userId],
    queryFn: async () => {
      if (!userId) throw new Error('Provider ID is required');
      return await appointmentsApi.getProviderOffer(userId);
    },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch available slots for selected date
  const {
    data: slotsData,
    isLoading: slotsLoading,
    refetch: refetchSlots,
  } = useQuery<IProviderSlot[]>({
    queryKey: ['slots', userId, selectedDate.toDateString()],
    queryFn: async () => {
      if (!providerId) throw new Error('Provider ID is required');
      const dateStr = selectedDate.toISOString().split('T')[0];
      return await appointmentsApi.getAvailableSlots(providerId, dateStr);
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // Refetch every 30 seconds
  });

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (slotId: string) => {
      if (!userId) throw new Error('Provider ID is required');
      return await appointmentsApi.bookAppointment({
        slotId,
        providerId: userId,
      });
    },
    onSuccess: async () => {
      toast.success('Appointment booked successfully!');
      await refetchSlots();
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to book appointment'
      );
    },
  });

  const averageRating = 4.7;

  // Update page metadata
  useEffect(() => {
    if (providerOfferData) {
      const providerName = `${providerOfferData.user.title} ${providerOfferData.user.firstName} ${providerOfferData.user.lastName}`;
      const primarySpecialty =
        providerOfferData.provider.specialties?.[0] || 'Healthcare Provider';
      const seoDescription = `Book an appointment with ${providerName}, a verified ${primarySpecialty} with ${providerOfferData.provider.experience} years of experience in ${providerOfferData.location}. Available for ${providerOfferData.appointmentType} appointments starting at Gh¢${providerOfferData.price}. Rated ${averageRating}/5 by patients.`;

      // Update SEO tags
      document.title = `${providerName} - ${primarySpecialty} | CareConnect`;
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute('content', seoDescription);
      }
      setSelectedDate(new Date(providerOfferData.start));
    }
  }, [providerOfferData]);

  // Check if selected date is a working day
  const isWorkingDay = (date: Date): boolean => {
    if (!providerOfferData?.workingDays) return true;
    const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon...
    const normalizedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    return providerOfferData.workingDays.includes(normalizedDay);
  };

  // Generate time slots from fetched slots data
  const generateTimeSlots = (): TimeSlot[] => {
    if (!slotsData || slotsData.length === 0) {
      return [];
    }

    return slotsData.map((slot) => ({
      time: slot.startTime,
      available: slot.status === 'available',
      slotId: slot._id,
    }));
  };

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
    const slot = slotsData?.find((s) => s.startTime === time);
    if (slot) {
      setSelectedSlotId(slot._id);
    }
  };

  const handleBooking = () => {
    if (!selectedSlotId) {
      toast.error('Please select a time slot');
      return;
    }

    bookAppointmentMutation.mutate(selectedSlotId);
  };

  const handlePatientConditionChange = (value: string) => {
    setPatientCondition(value);
  };
  const handleKnownAllergyChange = (value: string) => {
    setKnownAllergy(value);
  };
  const timeSlots = generateTimeSlots();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isError || !providerOfferData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Provider Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The provider you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/search"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Search
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const providerName = `${providerOfferData.user.title} ${providerOfferData.user.firstName} ${providerOfferData.user.lastName}`;
  const primarySpecialty =
    providerOfferData.provider.specialties?.[0] || 'Healthcare Provider';

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${providerName} - ${primarySpecialty} | CareConnect`}
        description={`Book an appointment with ${providerName}, a verified ${primarySpecialty} with ${providerOfferData.provider.experience} years of experience in ${providerOfferData.location}.`}
        keywords={`${providerName}, ${primarySpecialty}, ${providerOfferData.location}, book appointment`}
      />

      <Navbar />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav
            className="flex items-center space-x-2 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Home
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <Link
              to="/search"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Search Providers
            </Link>
            <ChevronRightIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium truncate">
              {providerName}
            </span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <ProviderHeader
              offer={providerOfferData}
              averageRating={averageRating}
            />

            {/* Tab Navigation */}
            <ProviderTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              reviewCount={mockReviews.length}
            />

            {/* Tab Content */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {activeTab === 'overview' && (
                <OverviewTab offer={providerOfferData} />
              )}

              {activeTab === 'reviews' && <ReviewsTab reviews={mockReviews} />}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <BookingSidebar
            offer={providerOfferData}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onBook={handleBooking}
            isBooking={bookAppointmentMutation.isPending}
            timeSlots={timeSlots}
            onSlotSelect={handleSlotSelect}
            slotsLoading={slotsLoading}
            isWorkingDay={isWorkingDay(selectedDate)}
            patientCondition={patientCondition}
            onPatientConditionChange={handlePatientConditionChange}
            knownAllergy={knownAllergy}
            onKnownAllergyChange={handleKnownAllergyChange}
          />
        </div>
      </main>

      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Physician',
          name: providerName,
          image: 'https://example.com/doctor-image.jpg',
          priceRange: `Gh¢${providerOfferData.price}`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: providerOfferData.location,
          },
          telephone: providerOfferData.user.email,
          medicalSpecialty: providerOfferData.provider.specialties,
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: averageRating,
            reviewCount: mockReviews.length,
          },
        })}
      </script>

      <Footer />
    </div>
  );
};

export default BookingPage;
