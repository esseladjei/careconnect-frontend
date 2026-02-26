// Types
export interface ReviewRating {
  professionalism: number;
  communication: number;
  punctuality: number;
  empathy: number;
  overall: number;
}

export interface Review {
  _id: string;
  patientId: string;
  providerId: string;
  appointmentId: string;
  patientName: string;
  rating: ReviewRating;
  comment: string;
  verified: boolean;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProviderRatingSummary {
  professionalismAvg?: number;
  communicationAvg?: number;
  punctualityAvg?: number;
  empathyAvg?: number;
  overallAvg: number;
  totalReviews: number;
  status: 'new-provider' | 'established';
}

export interface ProviderFlag {
  _id: string;
  providerId: string;
  patientId: string;
  appointmentId: string;
  flagType:
    | 'no-show'
    | 'abusive-behavior'
    | 'payment-dispute'
    | 'suspicious-activity';
  description: string;
  date: string;
  resolved: boolean;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubmitReviewPayload {
  appointmentId: string;
  providerId: string;
  rating: Omit<ReviewRating, 'overall'>;
  comment: string;
}

export interface SubmitFlagPayload {
  appointmentId: string;
  patientId: string;
  flagType: ProviderFlag['flagType'];
  description: string;
}
