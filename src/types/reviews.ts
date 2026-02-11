// Types
export interface Review {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

// Mock reviews data
export const mockReviews: Review[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    rating: 5,
    date: '2026-01-15',
    comment: 'Excellent care and very professional. Highly recommend!',
    verified: true,
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    rating: 4,
    date: '2026-01-10',
    comment: 'Very knowledgeable and took time to explain everything.',
    verified: true,
  },
  {
    id: '3',
    patientName: 'Emma Davis',
    rating: 5,
    date: '2026-01-05',
    comment: "Best healthcare experience I've had. Very caring and attentive.",
    verified: true,
  },
];
