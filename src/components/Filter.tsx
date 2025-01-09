'use client';
import React, { useState, useEffect } from 'react'
import { FilterBoxProps, FiltersProps, SpecialisationsProps } from '../../types/typesdefinitions';
import { fetchSpecialisations } from '@/actions/fetch';
import Cookies from 'js-cookie';

const FilterBox: React.FC<FilterBoxProps> = ({ onFilter }) => {
  const token = Cookies.get('token');
  const [specialisations, setSpecialisations] = useState<SpecialisationsProps[]>([]);
  const [filters, setFilters] = useState<FiltersProps>({
    'appointment_type': 'flexible',
    'availability': ['private_clinic'],
    'fee': [0, 100.00],
    'specialisations': [],
  });
  const [loading, setLoading] = useState(true);
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value, checked, dataset } = event.target;

    setFilters((prevFilters) => {
      let updatedFilters = { ...prevFilters };
      switch (name) {
        case 'fee':
          if (dataset.type === 'min' || dataset.type === 'max') {
            const [minFee, maxFee] = Array.isArray(prevFilters.fee) ? prevFilters.fee : [0, 0];
            const updatedRange: [number, number] = dataset.type === 'min'
              ? [Number(value), maxFee]
              : [minFee, Number(value)];
            updatedFilters = { ...prevFilters, fee: updatedRange };
          }
          break;
        case 'appointment_type':
          updatedFilters = { ...prevFilters, [name]: value };
          break;
        case 'availability':
          const updatedAvailability = checked
            ? [...prevFilters.availability, value]
            : prevFilters.availability.filter((type) => type !== value);
          updatedFilters = { ...prevFilters, availability: updatedAvailability };
          break;
        case 'specialisation':
          const key = id.split('specialisation_')[1];
          const updatedSpecialisations = checked
            ? [...prevFilters.specialisations, { specialisationId: key, name: value }]
            : prevFilters.specialisations.filter((type) => type.name !== value);
          updatedFilters = { ...prevFilters, specialisations: updatedSpecialisations };
          break;
        default:
          updatedFilters = { ...prevFilters, [name]: value };
      }
      onFilter(updatedFilters);
      return updatedFilters;
    });

  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const specs = await fetchSpecialisations(token);
        setSpecialisations(specs);
      } catch (error) {
        console.error('Failed to fetch specialisations:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);
  return (
    <div className="space-y-2" >
      <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden" open >
        <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"  >
          <span className="text-sm font-medium">Appointment Type</span>
          <span className="transition group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </summary>

        <div className="border-t border-gray-200 bg-white">
          <header className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-700"> 0 Selected </span>
            <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
              Reset
            </button>
          </header>

          <ul className="space-y-4 border-t border-gray-200 p-4">
            <li className="flex items-center gap-2">
              <label htmlFor="immediately" className="relative inline-block h-7 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500" >
                <input type="radio"
                  id="immediately"
                  name="appointment_type"
                  className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
                  value="immediately"
                  checked={filters.appointment_type === 'immediately'}
                  onChange={handleFilterChange}
                />
                <span className="absolute inset-y-0 start-0 z-10 m-1 inline-flex size-5 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600"  >
                  <svg
                    data-unchecked-icon
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <svg
                    data-checked-icon
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </label>
              <span>Immediately</span>
            </li>
            <li className="flex items-center gap-2">
              <label htmlFor="flexible" className="relative inline-block h-7 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500">
                <input type="radio"
                  id="flexible"
                  name="appointment_type"
                  className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
                  value="flexible"
                  checked={filters.appointment_type === 'flexible'} // Check if the value is in the array
                  onChange={handleFilterChange}
                />
                <span className="absolute inset-y-0 start-0 z-10 m-1 inline-flex size-5 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600">
                  <svg
                    data-unchecked-icon
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <svg
                    data-checked-icon
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </label>
              <span>Flexible or later</span>
            </li>
            <li className="flex items-center gap-2">
              <label htmlFor="sameday" className="relative inline-block h-7 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-green-500">
                <input type="radio"
                  id="sameday"
                  name="appointment_type"
                  className="peer sr-only [&:checked_+_span_svg[data-checked-icon]]:block [&:checked_+_span_svg[data-unchecked-icon]]:hidden"
                  value="sameday"
                  checked={filters.appointment_type === 'sameday'} // Check if the value is in the array
                  onChange={handleFilterChange}
                />
                <span className="absolute inset-y-0 start-0 z-10 m-1 inline-flex size-5 items-center justify-center rounded-full bg-white text-gray-400 transition-all peer-checked:start-6 peer-checked:text-green-600" >
                  <svg
                    data-unchecked-icon
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <svg
                    data-checked-icon
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </label>
              <span>Same day appointment</span>
            </li>
          </ul>
        </div>
      </details>
      <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden" open >
        <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"  >
          <span className="text-sm font-medium">Availability</span>
          <span className="transition group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </summary>

        <div className="border-t border-gray-200 bg-white">
          <header className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-700"> 0 Selected </span>
            <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
              Reset
            </button>
          </header>

          <ul className="space-y-1 border-t border-gray-200 p-4">
            <li>
              <label htmlFor="office" className="inline-flex items-center gap-2">
                <input type="checkbox"
                  id="office"
                  className="size-5 rounded border-gray-300"
                  name="availability"
                  value="office"
                  checked={filters.availability?.includes('office')}
                  onChange={handleFilterChange}
                />
                <span className="text-sm font-medium text-gray-700">Office visit</span>
              </label>
            </li>
            <li>
              <label htmlFor="homevisit" className="inline-flex items-center gap-2">
                <input type="checkbox"
                  id="homevisit"
                  className="size-5 rounded border-gray-300"
                  name="availability"
                  value="homevisit"
                  checked={filters.availability?.includes('homevisit')}
                  onChange={handleFilterChange}
                />
                <span className="text-sm font-medium text-gray-700">Home visit </span>
              </label>
            </li>
            <li>
              <label htmlFor="private_clinic" className="inline-flex items-center gap-2">
                <input type="checkbox"
                  id="private_clinic"
                  className="size-5 rounded border-gray-300"
                  name="availability"
                  value="private_clinic"
                  checked={filters.availability?.includes('private_clinic')}
                  onChange={handleFilterChange}
                />
                <span className="text-sm font-medium text-gray-700">Private clinic</span>
              </label>
            </li>
            <li>
              <label htmlFor="freeconsultation" className="inline-flex items-center gap-2">
                <input type="checkbox"
                  id="freeconsultation"
                  className="size-5 rounded border-gray-300"
                  name="availability"
                  value="freeconsultation"
                  checked={filters.availability?.includes('freeconsultation')}
                  onChange={handleFilterChange}

                />
                <span className="text-sm font-medium text-gray-700">Free consultation</span>
              </label>
            </li>
            <li>
              <label htmlFor="video_consultation" className="inline-flex items-center gap-2">
                <input type="checkbox"
                  id="video_consultation"
                  className="size-5 rounded border-gray-300"
                  name="availability"
                  value="video"
                  checked={filters.availability?.includes('video')}
                  onChange={handleFilterChange}
                />
                <span className="text-sm font-medium text-gray-700">Video Consultation</span>
              </label>
            </li>

            <li>
              <label htmlFor="government_hospital" className="inline-flex items-center gap-2">
                <input type="checkbox"
                  id="government_hospital"
                  className="size-5 rounded border-gray-300"
                  name="availability"
                  value="government_hospital"
                  checked={filters.availability?.includes('government_hospital')}
                  onChange={handleFilterChange}
                />
                <span className="text-sm font-medium text-gray-700">Government hospital</span>
              </label>
            </li>
            <li>
              <label htmlFor="telephone" className="inline-flex items-center gap-2">
                <input type="checkbox"
                  id="telephone"
                  className="size-5 rounded border-gray-300"
                  name="availability"
                  value="telephone"
                  checked={filters.availability?.includes('telephone')}
                  onChange={handleFilterChange}
                />
                <span className="text-sm font-medium text-gray-700">Telephone consultation</span>
              </label>
            </li>
          </ul>
        </div>
      </details>
      <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden" open >
        <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"  >
          <span className="text-sm font-medium">Care Type</span>

          <span className="transition group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </summary>

        <div className="border-t border-gray-200 bg-white">
          <header className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-700"> 0 Selected </span>

            <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
              Reset
            </button>
          </header>

          <ul className="space-y-1 border-t border-gray-200 p-4">
            {
              loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                specialisations.length > 0 ? (
                  specialisations.map((specialisation: SpecialisationsProps,) => (
                    <li key={specialisation.specialisationId}>
                      <label htmlFor={`specialisation_${specialisation.specialisationId}`} className="inline-flex items-center gap-2">
                        <input type="checkbox"
                          id={`specialisation_${specialisation.specialisationId}`}
                          className="size-5 rounded border-gray-300"
                          name="specialisation"
                          value={specialisation.name}
                          checked={filters.specialisations.some(spec => spec.name === specialisation.name)} // Check if the value is in the array
                          onChange={handleFilterChange}
                        />
                        <span className="text-sm font-medium text-gray-700">{specialisation.name}</span>
                      </label>
                    </li>
                  ))

                ) : (<p>No specilisation</p>)
              )}
          </ul>
        </div>
      </details>
      <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden" open>
        <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
          <span className="text-sm font-medium">Fee (Charge) </span>
          <span className="transition group-open:-rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </summary>
        <div className="border-t border-gray-200 bg-white">
          <header className="flex items-center justify-between p-4">
            <span className="text-sm text-gray-700">Practitioner fee (inc VAT)</span>
            <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
              Reset
            </button>
          </header>

          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between gap-4">
              <label htmlFor="FilterPriceFrom" className="flex items-center gap-2">
                <span className="text-sm text-gray-600">¢</span>

                <input
                  type="number"
                  id="minFee"
                  placeholder="Min fee"
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  name="fee"
                  data-type="min" // Use data-type to identify min or max
                  value={Array.isArray(filters.fee) ? filters.fee[0] : ''}
                  onChange={handleFilterChange}
                />
              </label>

              <label htmlFor="maxFee" className="flex items-center gap-2">
                <span className="text-sm text-gray-600">¢</span>

                <input
                  type="number"
                  id="maxFee"
                  placeholder="Max fee"
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  name="fee"
                  data-type="max" // Use data-type to identify min or max
                  value={Array.isArray(filters.fee) ? filters.fee[1] : ''}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}

export default FilterBox