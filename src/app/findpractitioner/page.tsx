'use client';
import Card from '@/components/Cards';
import FilterBox from '@/components/Filter';
import SearchBar from '@/components/SearchBar';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { fetchPractitioners } from '@/actions/fetch';
import { HandleFilterParams, FilteredPractitioners } from '../../../types/typesdefinitions';
import NoResultsCard from '@/components/NoResultsCard';

function FindPage() {
  const [results, setResults] = useState<FilteredPractitioners>({
    data: [],
    total: 0,
    page: 1,
    pages: 0,
  });
  const token = Cookies.get('token');
  const defaultFilters = useMemo(() => ({
    'appointment_type': 'flexible',
    'availability': ['private_clinic'],
    'fee': [0, 1000],
    'specialisations': [],
  }), []);
  useEffect(() => {
    (async () => {
      const practitioners = await fetchPractitioners(defaultFilters, token);
      if (practitioners.success) {
        setResults(practitioners.data)
      } else {
        toast.error(practitioners.error);
      }
    })();
  }, [token, defaultFilters])

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;
    const practitioners = await fetchPractitioners({ location: query, ...defaultFilters }, token);
    if (practitioners.success) {
      setResults(practitioners.data)
    } else {
      toast.error(practitioners.error);
    }
  }, [token, defaultFilters]);

  const handleFilter = useCallback(async (filters: HandleFilterParams) => {
    const practitioners = await fetchPractitioners(filters, token);
    if (practitioners.success) {
      setResults(practitioners.data)
    } else {
      toast.error(practitioners.error);
    }
  }, [token]);

  const handleFind = useCallback(async (queries: Record<string, any>) => {
    if (!queries) return;
    const practitioners = await fetchPractitioners(queries, token);
    if (practitioners.success) {
      setResults(practitioners.data)
    } else {
      toast.error(practitioners.error);
    }
  }, [token]);


  return (
    <div className="container max-w-7xl center mx-auto p-4 flex flex-col space-y-4 bg-white">
      {/* Search Bar */}
      <div className="container max-w-2xl my-6">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-4 place-items-center w-full">
          <SearchBar onSearch={handleSearch} onFind={handleFind} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        {/* Filter Section */}
        <div className="filter w-full lg:w-1/3 bg-gray-100 p-4 rounded">
          <FilterBox onFilter={handleFilter} />
        </div>

        {/* Results Section */}
        <div className="results w-full lg:w-2/3 bg-gray-100 p-4 rounded">
          {results && results.data.length > 0 ? (
            <div className='card-results py-1'>
              {results.data.map((result, index) => (
                <Card key={index} practitioner={result} />
              ))}
            </div>
          ) : (
            <NoResultsCard title='Info:' message='No Results found with for the selected filters' />
          )}
        </div>
      </div>
    </div >

  )
}

export default FindPage