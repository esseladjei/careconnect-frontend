export interface Referral {
  _id: string;
  referrerId: string;
  referrerName: string;
  referrerRole: 'patient' | 'provider';
  referredEmail?: string;
  referredName?: string;
  referredUserId?: string;
  status: 'pending' | 'completed' | 'expired';
  bonusAmount: number;
  bonusPaid: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalBonusEarned: number;
  bonusPerReferral: number;
  referrals: Referral[];
}

export interface CreateReferralResponse {
  message: string;
  referralCode: string;
  referralLink: string;
}
