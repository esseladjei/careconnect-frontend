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
