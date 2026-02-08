import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
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
import type { IProviderListing } from '../types/providerListing';

// Types
interface Review {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
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

const OfferDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<
    'overview' | 'availability' | 'reviews'
  >('overview');

  // Fetch provider details
  const {
    data: providerOfferData,
    isLoading,
    isError,
  } = useQuery<IProviderListing>({
    queryKey: ['provider', id],
    queryFn: async () => {
      const response = await axiosClient.get(`/appointments/offers/${id}`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
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

  const handleBooking = () => {
    alert('To be implemented' + id);
    navigate(`/appointments/${id}`, {
      state: {
        providerId: id,
        date: selectedDate,
        price: providerOfferData?.price,
      },
    });
  };

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
            onBook={handleBooking}
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

export default OfferDetailsPage;
