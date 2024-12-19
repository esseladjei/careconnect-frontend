import React from 'react'
interface NoResultsCardProps {
  title: string;
  message: string
}
const NoResultsCard: React.FC<NoResultsCardProps> = ({ title, message }) => {
  return (
    <div className="bg-white p-4 sm:p-6">
      <h3 className="mt-0.5 text-lg text-gray-900">{title}</h3>
      <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
        {message}
      </p>
    </div>
  )
}

export default NoResultsCard;