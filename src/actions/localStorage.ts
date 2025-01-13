'use client';
export const setItem = <T>(key: string, value: T): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Error setting localStorage item:", error);
  }
};

export const getItem = <T>(key: string): T | null => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null
  } catch (error) {
    console.error("Error getting localStorage item:", error);
    return null;
  }
};
export const removeFromLocalStorage =(key: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("Error getting localStorage item:", error);
  }
};
 