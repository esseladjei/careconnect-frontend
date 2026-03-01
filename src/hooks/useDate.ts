/**
 * @fileoverview Date Utilities for Forms and API Requests
 * 
 * This module provides utility functions for working with dates in a user-friendly way.
 * All functions return dates in YYYY-MM-DD format, which is the standard format for:
 * - HTML date input elements (<input type="date" />)
 * - Backend API requests
 * - Form validation constraints (min/max attributes)
 * 
 * IMPORTANT: These utilities work with the browser's LOCAL TIMEZONE, not the user's 
 * selected timezone. For DISPLAYING dates to users, use timezoneUtils.ts instead.
 * 
 * @example
 * // Get today's date for a form input
 * const today = useGetToday(); // "2026-03-01"
 * <input type="date" value={today} />
 * 
 * @example
 * // Set max date for appointment booking (3 months from today)
 * <input type="date" max={useGetThreeMonthsFromNow()} /> // max="2026-06-01"
 * 
 * @example
 * // Validate user's date of birth (must be 18+)
 * const error = validateDateOfBirth(dob);
 * if (error) showError(error);
 * 
 * @see timezoneUtils.ts - Use for displaying dates to users with timezone awareness
 */

/**
 * Formats a Date object to YYYY-MM-DD string in local timezone
 * 
 * This is a helper function used internally by all other functions in this module.
 * It ensures consistent date formatting across the application.
 * 
 * @param {Date} date - The date to format
 * @returns {string} Date string in YYYY-MM-DD format (e.g., "2026-03-01")
 * 
 * @example
 * formatLocalDate(new Date("2026-03-01")) // "2026-03-01"
 * formatLocalDate(new Date("2026-03-05")) // "2026-03-05"
 * 
 * @internal
 */
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculates the maximum date for age validation (18 years ago from today)
 * 
 * Use this function to set the maximum date a user can select in a date of birth picker.
 * It ensures users must be at least 18 years old.
 * 
 * @returns {string} Date string representing 18 years ago in YYYY-MM-DD format
 * 
 * @example
 * // Current date: March 1, 2026
 * useGetMaxDate() // "2008-03-01" (18 years ago)
 * 
 * @example
 * // Use in date input
 * <input type="date" max={useGetMaxDate()} />
 * // This prevents users from selecting dates after March 1, 2008
 * 
 * @see validateDateOfBirth - For validating dates of birth programmatically
 */
export const useGetMaxDate = () => {
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return formatLocalDate(maxDate);
};

/**
 * Gets today's date in YYYY-MM-DD format
 * 
 * Use this function to get the current date for form inputs, date pickers,
 * and API requests.
 * 
 * @returns {string} Today's date in YYYY-MM-DD format (e.g., "2026-03-01")
 * 
 * @example
 * // Current date: March 1, 2026
 * useGetToday() // "2026-03-01"
 * 
 * @example
 * // Use in date input as minimum selectable date
 * <input type="date" min={useGetToday()} />
 * // This prevents users from selecting dates in the past
 * 
 * @example
 * // Use in date calculations
 * const searchStart = useGetToday();
 * const searchEnd = getFormattedDate(30); // 30 days from today
 */
export const useGetToday = () => {
  return formatLocalDate(new Date());
};

/**
 * Gets a date 3 months from today in YYYY-MM-DD format
 * 
 * Use this function to set a maximum booking date or search range.
 * Commonly used to allow appointments to be booked up to 3 months in advance.
 * 
 * @returns {string} Date 3 months from today in YYYY-MM-DD format
 * 
 * @example
 * // Current date: March 1, 2026
 * useGetThreeMonthsFromNow() // "2026-06-01" (June 1, 2026)
 * 
 * @example
 * // Set appointment booking limit to 3 months
 * <input type="date" max={useGetThreeMonthsFromNow()} />
 * // Users can only book appointments within the next 3 months
 * 
 * @example
 * // Set search date range
 * const [filters, setFilters] = useState({
 *   startDate: useGetToday(),           // "2026-03-01"
 *   endDate: useGetThreeMonthsFromNow() // "2026-06-01"
 * });
 */
export const useGetThreeMonthsFromNow = () => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setMonth(today.getMonth() + 3);
  return formatLocalDate(futureDate);
};

/**
 * Formats a date string to show only the day and month (e.g., "01 Mar")
 * 
 * Use this function for display purposes when you need a short, human-readable
 * format showing only the day and month, without the year.
 * 
 * @param {string} dateString - ISO date string (e.g., "2026-03-15")
 * @returns {string} Formatted string with day and month (e.g., "15 Mar")
 * 
 * @example
 * useGetDayMonthOnly("2026-03-15") // "15 Mar"
 * useGetDayMonthOnly("2026-12-25") // "25 Dec"
 * 
 * @note This function uses Intl.DateTimeFormat, which respects browser locale settings.
 * For timezone-aware display, use formatDateInTimezone from timezoneUtils.ts instead.
 */
export const useGetDayMonthOnly = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

/**
 * Calculates a date by adding or subtracting days from today
 * 
 * Use this function to get a date relative to today. Common use cases include:
 * - Getting "tomorrow" (daysOffset: 1)
 * - Getting "next week" (daysOffset: 7)
 * - Getting "next 30 days" (daysOffset: 30)
 * - Getting "yesterday" (daysOffset: -1)
 * 
 * @param {number} [daysOffset=0] - Number of days to add to today
 *   Positive numbers = future dates
 *   Negative numbers = past dates
 *   Default is 0 (today)
 * @returns {string} Calculated date in YYYY-MM-DD format
 * 
 * @example
 * // Current date: March 1, 2026
 * getFormattedDate(0)   // "2026-03-01" (today)
 * getFormattedDate(1)   // "2026-03-02" (tomorrow)
 * getFormattedDate(7)   // "2026-03-08" (next week)
 * getFormattedDate(30)  // "2026-03-31" (30 days from today)
 * getFormattedDate(-1)  // "2026-02-28" (yesterday)
 * 
 * @example
 * // Set default search date range
 * const searchStart = getFormattedDate(0);   // Today
 * const searchEnd = getFormattedDate(30);    // 30 days from today
 * 
 * @example
 * // Quick filter buttons in UI
 * <button onClick={() => search(getFormattedDate(0), getFormattedDate(7))}>
 *   This Week
 * </button>
 */
export const getFormattedDate = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return formatLocalDate(date);
};

/**
 * Validates a date of birth to ensure the person is at least 18 years old
 * 
 * This function calculates the user's age and returns an error message if they
 * are under 18. Use this when validating user registration or profile updates.
 * 
 * @param {string} dateString - ISO date string (e.g., "2008-03-01")
 * @returns {string | undefined}
 *   - Returns undefined if the user is 18+ (validation passed)
 *   - Returns an error message if the user is under 18 (validation failed)
 * 
 * @example
 * // Current date: March 1, 2026
 * validateDateOfBirth("2008-03-01") // undefined (valid - exactly 18 years old)
 * validateDateOfBirth("2008-03-02") // "You must be at least 18 years old" (invalid - 17 years old)
 * validateDateOfBirth("2000-01-01") // undefined (valid - over 18 years old)
 * 
 * @example
 * // Use in form validation
 * const handleSubmit = (formData) => {
 *   const ageError = validateDateOfBirth(formData.dateOfBirth);
 *   if (ageError) {
 *     showError(ageError);
 *     return;
 *   }
 *   submitForm(formData);
 * };
 * 
 * @example
 * // Use as form field validator
 * <DateInput 
 *   name="dateOfBirth"
 *   validate={validateDateOfBirth}
 *   max={useGetMaxDate()}
 * />
 * 
 * @note
 * - The function accounts for leap years and month boundaries
 * - Age is calculated as: (currentYear - birthYear) - 1 if birthday hasn't occurred this year
 * - For example, if today is March 1, 2026 and DOB is March 2, 2008, age is 17 (birthday hasn't happened yet)
 * 
 * @see useGetMaxDate - For setting max date in date pickers (complements this validation)
 */
export const validateDateOfBirth = (dateString: string): string | undefined => {
  if (!dateString) return undefined;

  const birthDate = new Date(dateString);

  if (Number.isNaN(birthDate.getTime())) {
    return 'Invalid date of birth';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (birthDate > today) {
    return 'Date of birth cannot be in the future';
  }

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred this year
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Check if at least 18 years old
  if (age < 18) {
    return 'You must be at least 18 years old';
  }

  return undefined;
};

