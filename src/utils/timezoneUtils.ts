/**
 * Timezone formatting utilities
 * Provides functions to format dates and times in user's timezone
 */

/**
 * Format a date/time to user's timezone with a specific format
 * @param dateString - ISO date string or Date object
 * @param timezone - IANA timezone string (e.g., 'America/New_York')
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDateInTimezone(
  dateString: string | Date,
  timezone: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-GB', {
    ...defaultOptions,
    timeZone: timezone,
  }).format(date);
}

/**
 * Format time only in user's timezone
 * @param dateString - ISO date string or Date object
 * @param timezone - IANA timezone string
 * @returns Time string (e.g., '10:30 AM')
 */
export function formatTimeInTimezone(
  dateString: string | Date,
  timezone: string
): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Format date and time together in user's timezone
 * @param dateString - ISO date string or Date object
 * @param timezone - IANA timezone string
 * @returns Date and time string (e.g., 'Mar 15, 2025, 10:30 AM')
 */
export function formatDateTimeInTimezone(
  dateString: string | Date,
  timezone: string
): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Format date in short format (e.g., 'Mar 15')
 * @param dateString - ISO date string or Date object
 * @param timezone - IANA timezone string
 * @returns Short date string
 */
export function formatDateShortInTimezone(
  dateString: string | Date,
  timezone: string
): string {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Get timezone abbreviation (e.g., 'EST', 'PST')
 * @param timezone - IANA timezone string
 * @param date - Optional date for accurate DST handling
 * @returns Timezone abbreviation
 */
export function getTimezoneAbbreviation(timezone: string, date?: Date): string {
  const d = date || new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    timeZoneName: 'short',
  }).formatToParts(d);

  const tzName = parts.find((part) => part.type === 'timeZoneName')?.value;
  return tzName || timezone.split('/')[1] || timezone;
}

/**
 * Convert UTC date to user's timezone as a Date object
 * Note: This returns a Date object set to the same absolute moment,
 * but you should use the formatting functions above for display
 */
export function convertToTimezone(
  dateString: string | Date,
  _timezone: string
): Date {
  // Note: JavaScript's Date object doesn't store timezone info
  // This function returns the same Date object, which represents
  // an absolute moment in time. Use formatting functions for display.
  return typeof dateString === 'string' ? new Date(dateString) : dateString;
}
