// Calculate the max date (18 years ago from today)
export const useGetMaxDate = () => {
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  return maxDate.toISOString().split('T')[0];
};

export const useGetToday = () => {
  return new Date().toISOString().split('T')[0];
};

export const useGetMonth = () => {
  const today = new Date();
  return new Date(today.setMonth(today.getMonth() + 3))
    .toISOString()
    .split('T')[0];
};

export const useGetDayMonthOnly = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

export const getFormattedDate = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const validateDateOfBirth = (dateString: string): string | undefined => {
  if (!dateString) return undefined;

  const birthDate = new Date(dateString);
  const today = new Date();

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
