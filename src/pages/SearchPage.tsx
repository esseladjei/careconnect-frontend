import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import SearchFilterPanel from '../components/SearchFilterPanel';
import SideBarFilter from '../components/SideBarFilter';
import SearchResultItem from '../components/SearchResultItem';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { SearchQuery, SearchResult } from '../types/search.ts';

const SearchPage: React.FC = () => {
  const [appointmentOffers, setAppointmentOffers] = useState<SearchResult[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState<SearchQuery>({
    search: {
      startDate: '',
      endDate: '',
      location: '',
    },
    filters: {
      specializations: [],
      appointmentType: 'In-person',
      minPrice: 50,
      maxPrice: 100,
    },
  });

  const fetchFilteredAppointments = async (q: SearchQuery) => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/appointments/offers', {
        params: {
          ...q.search,
          ...q.filters,
        },
      });
      setAppointmentOffers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //Auto-fetch whenever query changes
  useEffect(() => {
    fetchFilteredAppointments(query).catch((err) => console.error(err));
  }, [query]);
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
            {loading && <div>Loading...</div>}

            {!loading && appointmentOffers.length === 0 && (
              <div className="text-gray-500">No results found</div>
            )}

            {/* Search Results List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {appointmentOffers.map((result) => (
                <SearchResultItem key={result.provider._id} result={result} />
              ))}
            </div>

            {/* Pagination Placeholder */}
            {!loading && appointmentOffers.length > 0 && (
              <div className="flex justify-center mt-8 p-4 bg-white rounded-xl shadow-md">
                <span className="text-sm text-gray-500">
                  Pagination Placeholder...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
