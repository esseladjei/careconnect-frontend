'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { fetchSuggestions } from '@/actions/fetch';
import { LocationSuggestions } from '../../types/typesdefinitions';
import SearchButton from './SearchButton';
interface SearchBarProps {
  onFind: (query: Record<string, any>) => void; // Callback for search query
  onSearch: (query: string) => void; // Callback for search query
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFind }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<LocationSuggestions[]>([]);
  const token = Cookies.get('token');
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(query);
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);
  // Fetch suggestions based on user input
  useEffect(() => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }
    (async () => {
      const queryObject = {
        location: query
      }
      const suggestionsResponse = await fetchSuggestions(queryObject, token);
      if (suggestionsResponse.success) {
        setSuggestions(suggestionsResponse.data);
      } else {
        toast.error(suggestionsResponse.error);
      }
    })();

  }, [token, query]);
  //Fetch Results based on selected Location

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setQuery(value);
  };
  // Handle selecting a suggestion
  const handleSelect = (location: string) => {

    setQuery(location);
    setSuggestions([]);
    onSearch(location);

  };
  const handleFind = () => {
    const queries = {
      location: query,
      availability: 'video',
    }
    onFind(queries);
  };

  return (
    <>
      <div className='w-full'>
        <div className="relative">
          <label htmlFor="Search" className="sr-only">Search</label>
          <input
            type="text"
            id="Search"
            value={query}
            onChange={handleSearch}
            placeholder="Search by location..."
            className="w-full rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
          />
          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">
              <span className="sr-only">Search by location</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border border-gray-200 rounded-lg shadow-lg mt-2 w-full z-10">
              {suggestions.map((suggestion, index) => (

                <li
                  key={index}
                  className="flex gap-2 items-center py-2 px-4 hover:bg-gray-200 hover:text-gray-600 cursor-pointer"
                  onClick={() => handleSelect(suggestion.location)}
                >
                  <span className='ti-location-pin'></span>
                  <span>{suggestion.location}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='w-full'>
        <SearchButton onClick={handleFind} lable='Find practitioner'/>
      </div>
    </>
  )
}

export default SearchBar