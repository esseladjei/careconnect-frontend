import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import SearchFilterPanel from '../components/SearchFilterPanel';
import SideBarFilter from '../components/SideBarFilter';
import SearchResultItem from '../components/SearchResultItem';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { SearchQuery, SearchResult } from '../types/search.ts';
import { getFormattedDate } from '../hooks/useDate.ts';

const SearchPage: React.FC = () => {
  // Get location from URL query parameter
  const getInitialLocation = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('location') || '';
  };

  // Helper function to format date as DD-MM-YYYY
  const [query, setQuery] = useState<SearchQuery>({
    search: {
      startDate: getFormattedDate(0), // Today
      endDate: getFormattedDate(30), // 30 days from today
      location: getInitialLocation(),
    },
    filters: {
      specialties: [],
      appointmentType: 'In-Person',
      minPrice: 50,
      maxPrice: 500,
    },
  });

  // Update URL when location changes
  useEffect(() => {
    if (query.search.location) {
      const params = new URLSearchParams(window.location.search);
      params.set('location', query.search.location);
      window.history.replaceState(null, '', `?${params.toString()}`);
    }
  }, [query.search.location]);

  // TanStack Query hook to fetch filtered appointments
  const {
    data: appointmentOffers = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['appointments', query], // Refetch when query changes
    queryFn: async () => {
      const response = await axiosClient.get<SearchResult[]>(
        '/appointments/offers',
        {
          params: {
            ...query.search,
            ...query.filters,
          },
        }
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* Hero Section with Search Bar */}
      <div className="bg-gradient-to-b from-slate-50 via-blue-50 to-white pt-8 pb-32 relative border-b border-blue-100">
        <div className="container mx-auto px-4 md:px-8">
          <SearchFilterPanel
            value={query.search}
            filters={query.filters}
            onChange={(search) => setQuery((prev) => ({ ...prev, search }))}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-8">
        {/* Main Content: Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 -mt-24 relative z-10">
          {/* Column 1: Filter Sidebar (Hidden on small screens, 1/4 width on large screens) */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="sticky top-24">
              <SideBarFilter
                filters={query.filters}
                resultsCount={appointmentOffers.length}
                location={query.search.location}
                onChange={(filters) =>
                  setQuery((prev) => ({ ...prev, filters }))
                }
              />
            </div>
          </aside>

          {/* Column 2: Search Results (Full width on small, 3/4 width on large) */}
          <div className="lg:col-span-3 pb-12">
            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center justify-center">
                <div className="mb-6">
                  <Spinner size="lg" />
                </div>
                <p className="text-gray-600 font-medium text-lg">
                  Finding the perfect providers for you...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  This may take a few moments
                </p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="bg-white rounded-2xl shadow-lg border border-red-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-red-100 px-8 py-6 border-b border-red-200">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl mt-1">⚠️</div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-red-900 mb-1">
                        Unable to Load Providers
                      </h2>
                      <p className="text-red-700 text-sm">
                        We encountered an issue while searching for providers.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                    {error instanceof Error
                      ? error.message
                      : 'An error occurred while fetching appointments. Please verify your search criteria and try again.'}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => {
                        setQuery({
                          search: {
                            startDate: getFormattedDate(0),
                            endDate: getFormattedDate(7),
                            location: '',
                          },
                          filters: {
                            specialties: [],
                            appointmentType: 'In-Person',
                            minPrice: 50,
                            maxPrice: 500,
                          },
                        });
                      }}
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
                    >
                      Reset Search
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!isLoading && !isError && appointmentOffers.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-12 text-center border-b border-blue-200">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                    <MagnifyingGlassIcon
                      className="h-7 w-7 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    No Providers Found
                  </h2>
                  <p className="text-gray-700 max-w-lg mx-auto leading-relaxed">
                    We couldn't find any healthcare providers matching your
                    search criteria. Try adjusting your filters or explore
                    providers in other locations.
                  </p>
                </div>
                <div className="p-8 text-center">
                  <div className="inline-flex gap-4">
                    <button
                      onClick={() => {
                        setQuery({
                          search: {
                            startDate: getFormattedDate(0),
                            endDate: getFormattedDate(7),
                            location: '',
                          },
                          filters: {
                            specialties: [],
                            appointmentType: 'In-Person',
                            minPrice: 50,
                            maxPrice: 500,
                          },
                        });
                      }}
                      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Reset All Filters
                    </button>
                    <button
                      onClick={() => (window.location.href = '/')}
                      className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-all duration-200"
                    >
                      Go Home
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Search Results List */}
            {!isLoading && !isError && appointmentOffers.length > 0 && (
              <>
                {/* Results Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Available Providers
                      </h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Showing {appointmentOffers.length} result
                        {appointmentOffers.length !== 1 ? 's' : ''}
                        {query.search.location &&
                          ` in ${query.search.location}`}
                      </p>
                    </div>
                  </div>

                  {/* Results Grid with smooth animations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {appointmentOffers.map((result, index) => (
                      <div
                        key={result.provider._id}
                        className="animate-fade-in-up"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <SearchResultItem result={result} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Results Footer with Pagination Placeholder */}
                <div className="mt-12 text-center">
                  <p className="text-gray-600 text-sm font-medium mb-4">
                    ✓ Showing all available providers matching your search
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
