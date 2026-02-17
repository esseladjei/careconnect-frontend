// --- Sub-Component: Referral Benefit Card ---
import React from 'react';

interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start space-x-4">
    <span className="text-3xl text-blue-600 shrink-0">{icon}</span>
    <div>
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

export default BenefitCard;
