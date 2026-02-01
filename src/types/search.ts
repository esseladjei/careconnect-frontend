// types/search.ts
export interface SearchParams {
  startDate: string; // ISO date
  endDate: string;
  location: string;
}

export interface FilterParams {
  specializations: string[];
  appointmentType?: 'In-person' | 'Video Call';
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
    userId: {
      _id: string;
      email: string;
      role: string;
      title: string;
      firstname: string;
      lastname: string;
    };
    gender: string;
    specialization: string;
    bio: string;
    experience: number;
    hourlyRate: number;
    available: boolean;
    location: string;
    languages: string[];
  };
  slots: Array<{
    start: string;
    end: string;
    price: number;
  }>;
}
