// types/search.ts
export interface SearchParams {
  startDate: string; // ISO date
  endDate: string;
  location: string;
}

export interface FilterParams {
  specialties: string[];
  appointmentType?: 'In-person' | 'Phone call';
  minPrice?: number;
  maxPrice?: number;
}

export interface SearchQuery {
  search: SearchParams;
  filters: FilterParams;
}

export interface SearchResult {
  provider: {
    _id: string;
    specialties: string[];
    languages: string[];
    location: string;
    available: string;
    experience?: string | number;
    practiceName?: string;
    providerStatus?: string;
  };
  user: {
    _id: string;
    email: string;
    role: string;
    title: string;
    firstName: string;
    lastName: string;
    gender: string;
  };
  availability: {
    id: string;
    start: string;
    end: string;
    price: number;
    appointmentType: string;
    location: string;
  };
}
