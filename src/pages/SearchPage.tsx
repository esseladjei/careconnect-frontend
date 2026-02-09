import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';
import SearchFilterPanel from '../components/SearchFilterPanel';
import SideBarFilter from '../components/SideBarFilter';
import SearchResultItem from '../components/SearchResultItem';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { SearchQuery, SearchResult } from '../types/search.ts';

const SearchPage: React.FC = () => {
  // Helper function to format date as DD-MM-YYYY
  const getFormattedDate = (daysOffset: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
  };

  const [query, setQuery] = useState<SearchQuery>({
    search: {
      startDate: getFormattedDate(0), // Today
      endDate: getFormattedDate(30), // 7 days from today
      location: '',
    },
    filters: {
      specialties: [],
      appointmentType: 'In-Person',
      minPrice: 50,
      maxPrice: 500,
    },
  });

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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto p-4 md:p-8">
        {/* Primary Search Bar (Top of page) */}
        <SearchFilterPanel
          value={query.search}
          filters={query.filters}
          onChange={(search) => setQuery((prev) => ({ ...prev, search }))}
        />

        {/* Main Content: Sidebar + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
          {/* Column 1: Filter Sidebar (Hidden on small screens, 1/3 width on large screens) */}
          <aside className="w-200px lg:col-span-1 hidden lg:block self-start">
            <SideBarFilter
              filters={query.filters}
              resultsCount={appointmentOffers.length}
              location={query.search.location}
              onChange={(filters) => setQuery((prev) => ({ ...prev, filters }))}
            />
          </aside>

          {/* Column 2: Search Results (Full width on small, 2/3 width on large) */}
          <div className="lg:col-span-2">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Spinner size="lg" className="mb-4" />
                <p className="text-gray-600 font-medium">
                  Loading appointments...
                </p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl mt-1">⚠️</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-red-900 mb-2">
                      Unable to Load Providers
                    </h2>
                    <p className="text-red-800 mb-4">
                      {error instanceof Error
                        ? error.message
                        : 'An error occurred while fetching appointments. Please try again.'}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* No Results State */}
            {!isLoading && !isError && appointmentOffers.length === 0 && (
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Providers Found
                </h2>
                <p className="text-gray-600 font-medium max-w-md mx-auto mb-6">
                  Try adjusting your search filters or location to find
                  available healthcare providers.
                </p>
                <div className="inline-block">
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
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {/* Search Results List */}
            {!isLoading && !isError && appointmentOffers.length > 0 && (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {appointmentOffers.map((result) => (
                    <SearchResultItem
                      key={result.provider._id}
                      result={result}
                    />
                  ))}
                </div>

                {/* Pagination Placeholder */}
                <nav
                  className="flex justify-center mt-8 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
                  aria-label="Search results pagination"
                >
                  <span className="text-sm text-gray-500 font-medium">
                    Showing {appointmentOffers.length} providers
                  </span>
                </nav>
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
