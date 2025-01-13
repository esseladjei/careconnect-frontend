'use client';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchSuggestions } from '@/actions/fetch';
interface SearchBarProps {
  onFind: (query: Record<string, any>) => void; // Callback for search query
  onSearch: (query: string) => void; // Callback for search query
}
interface LocationSuggestions {
  location: string
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
        location:query
      }
      const suggestionsReponse = await fetchSuggestions(queryObject, token);
      setSuggestions(suggestionsReponse);
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
        <button
          onClick={handleFind}
          className="flex gap-2 items-center w-full bg-blue-500 text-white text-sm font-medium py-2.5 px-2.5 rounded-lg hover:bg-blue-600 transition">
          <span className='ti ti-search'></span>
          <span title='eg.(doctor, nurse e.t.c)'>Find practitioner</span>
        </button>
      </div>
    </>
  )
}

export default SearchBar